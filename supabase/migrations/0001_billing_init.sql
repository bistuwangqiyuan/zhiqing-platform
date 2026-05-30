-- 智擎 PreFounder · 钱包 + 计费 初始化迁移
-- 所有金额以 micro_cny 存储（1 CNY = 1,000,000 micro_cny），与 lib/pricing.ts 一致。
-- 整数运算避免浮点误差；Stripe 充值最小单位 1 fen = 10,000 micro_cny。

-- =============================================================
-- 1. wallets · 每个 auth.users 一条
-- =============================================================
create table if not exists public.wallets (
  user_id       uuid primary key references auth.users(id) on delete cascade,
  balance_micro bigint not null default 0 check (balance_micro >= 0),
  updated_at    timestamptz not null default now()
);

-- =============================================================
-- 2. transactions · 不可篡改流水（充值/扣费/赠送/退款/调整）
-- =============================================================
do $$ begin
  create type public.tx_kind as enum ('signup_grant','topup','debit','refund','adjust');
exception
  when duplicate_object then null;
end $$;

create table if not exists public.transactions (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  kind          public.tx_kind not null,
  amount_micro  bigint not null,                 -- 正=入账，负=扣减
  balance_after bigint not null,
  ref           text,                            -- stripe session_id / ai_call_id 等
  meta          jsonb,
  created_at    timestamptz not null default now()
);

-- 幂等键：同一 ref 不能重复入账（Stripe webhook 重放保护）
create unique index if not exists transactions_ref_uniq
  on public.transactions(ref) where ref is not null;

create index if not exists transactions_user_created_idx
  on public.transactions(user_id, created_at desc);

-- =============================================================
-- 3. ai_calls · AI 调用日志（可对账）
-- =============================================================
create table if not exists public.ai_calls (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  model         text not null,
  input_tokens  int  not null default 0,
  output_tokens int  not null default 0,
  cost_micro    bigint not null default 0,       -- Claude 真实成本
  charged_micro bigint not null default 0,       -- ceil(cost × 1.1)
  status        text not null,                    -- 'ok' / 'error'
  error_message text,
  created_at    timestamptz not null default now()
);

create index if not exists ai_calls_user_created_idx
  on public.ai_calls(user_id, created_at desc);

-- =============================================================
-- 4. 原子扣款 RPC（防竞态：UPDATE ... WHERE balance >= amount）
-- =============================================================
create or replace function public.debit_wallet(
  p_user uuid,
  p_amount bigint,
  p_ref text,
  p_meta jsonb default '{}'::jsonb
) returns bigint
language plpgsql
security definer
set search_path = public
as $$
declare
  v_balance bigint;
begin
  if p_amount <= 0 then
    raise exception 'amount_must_be_positive';
  end if;

  update public.wallets
     set balance_micro = balance_micro - p_amount,
         updated_at    = now()
   where user_id = p_user
     and balance_micro >= p_amount
  returning balance_micro into v_balance;

  if v_balance is null then
    raise exception 'insufficient_balance' using errcode = 'P0001';
  end if;

  insert into public.transactions(user_id, kind, amount_micro, balance_after, ref, meta)
  values (p_user, 'debit', -p_amount, v_balance, p_ref, p_meta);

  return v_balance;
end $$;

-- =============================================================
-- 5. 入账 RPC（充值 / 退款 / 赠送 / 调整）
-- =============================================================
create or replace function public.credit_wallet(
  p_user uuid,
  p_amount bigint,
  p_kind public.tx_kind,
  p_ref text,
  p_meta jsonb default '{}'::jsonb
) returns bigint
language plpgsql
security definer
set search_path = public
as $$
declare
  v_balance bigint;
begin
  if p_amount <= 0 then
    raise exception 'amount_must_be_positive';
  end if;

  -- 确保 wallet 存在（兼容旧用户）
  insert into public.wallets(user_id, balance_micro) values (p_user, 0)
    on conflict (user_id) do nothing;

  update public.wallets
     set balance_micro = balance_micro + p_amount,
         updated_at    = now()
   where user_id = p_user
  returning balance_micro into v_balance;

  insert into public.transactions(user_id, kind, amount_micro, balance_after, ref, meta)
  values (p_user, p_kind, p_amount, v_balance, p_ref, p_meta);

  return v_balance;
end $$;

-- =============================================================
-- 6. 注册赠 ¥1 试用额度（1,000,000 micro_cny）
-- =============================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.wallets(user_id, balance_micro)
  values (new.id, 1000000);

  insert into public.transactions(user_id, kind, amount_micro, balance_after, ref, meta)
  values (new.id, 'signup_grant', 1000000, 1000000, 'welcome-' || new.id::text,
          jsonb_build_object('reason', 'signup_free_credit_cny_1'));

  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- =============================================================
-- 7. RLS：用户仅可读自己；所有写入只通过 service_role（API 路由）
-- =============================================================
alter table public.wallets       enable row level security;
alter table public.transactions  enable row level security;
alter table public.ai_calls      enable row level security;

drop policy if exists wallet_self_read on public.wallets;
create policy wallet_self_read on public.wallets
  for select using (auth.uid() = user_id);

drop policy if exists tx_self_read on public.transactions;
create policy tx_self_read on public.transactions
  for select using (auth.uid() = user_id);

drop policy if exists ai_self_read on public.ai_calls;
create policy ai_self_read on public.ai_calls
  for select using (auth.uid() = user_id);
