-- 智擎 PreFounder · Neon initial schema
-- Run this once in the Neon SQL editor (or via `psql $NETLIFY_DATABASE_URL -f`)
-- to provision both Auth.js v5 tables and the wallet/billing tables.

-- =============================================================
-- Auth.js v5 standard tables (case-sensitive identifier names
-- match @auth/drizzle-adapter expectations).
-- =============================================================
create table if not exists "user" (
  "id"            text primary key,
  "name"          text,
  "email"         text not null unique,
  "emailVerified" timestamptz,
  "image"         text,
  "createdAt"     timestamptz not null default now()
);

create table if not exists "account" (
  "userId"            text not null references "user"("id") on delete cascade,
  "type"              text not null,
  "provider"          text not null,
  "providerAccountId" text not null,
  "refresh_token"     text,
  "access_token"      text,
  "expires_at"        integer,
  "token_type"        text,
  "scope"             text,
  "id_token"          text,
  "session_state"     text,
  primary key ("provider", "providerAccountId")
);

create table if not exists "session" (
  "sessionToken" text primary key,
  "userId"       text not null references "user"("id") on delete cascade,
  "expires"      timestamptz not null
);

create table if not exists "verificationToken" (
  "identifier" text not null,
  "token"      text not null,
  "expires"    timestamptz not null,
  primary key ("identifier", "token")
);

-- =============================================================
-- Wallet / billing — all amounts in integer micro_cny
-- =============================================================
do $$ begin
  create type tx_kind as enum ('signup_grant','topup','debit','refund','adjust');
exception
  when duplicate_object then null;
end $$;

create table if not exists "wallet" (
  "userId"        text primary key references "user"("id") on delete cascade,
  "balance_micro" bigint not null default 0 check ("balance_micro" >= 0),
  "updated_at"    timestamptz not null default now()
);

create table if not exists "transaction" (
  "id"            uuid primary key default gen_random_uuid(),
  "userId"        text not null references "user"("id") on delete cascade,
  "kind"          tx_kind not null,
  "amount_micro"  bigint not null,
  "balance_after" bigint not null,
  "ref"           text,
  "meta"          jsonb,
  "created_at"    timestamptz not null default now()
);

create unique index if not exists transaction_ref_uniq
  on "transaction"("ref") where "ref" is not null;
create index if not exists transaction_user_created_idx
  on "transaction"("userId", "created_at" desc);

create table if not exists "ai_call" (
  "id"             uuid primary key default gen_random_uuid(),
  "userId"         text not null references "user"("id") on delete cascade,
  "model"          text not null,
  "input_tokens"   integer not null default 0,
  "output_tokens"  integer not null default 0,
  "cost_micro"     bigint not null default 0,
  "charged_micro"  bigint not null default 0,
  "status"         text not null,
  "error_message"  text,
  "created_at"     timestamptz not null default now()
);

create index if not exists ai_call_user_created_idx
  on "ai_call"("userId", "created_at" desc);

-- =============================================================
-- Atomic debit. Race-safe via UPDATE ... WHERE balance >= amount.
-- Throws SQLSTATE P0001 "insufficient_balance" when balance < amount.
-- =============================================================
create or replace function debit_wallet(
  p_user text,
  p_amount bigint,
  p_ref text,
  p_meta jsonb default '{}'::jsonb
) returns bigint
language plpgsql
as $$
declare
  v_balance bigint;
begin
  if p_amount <= 0 then
    raise exception 'amount_must_be_positive';
  end if;

  update "wallet"
     set "balance_micro" = "balance_micro" - p_amount,
         "updated_at"    = now()
   where "userId" = p_user
     and "balance_micro" >= p_amount
  returning "balance_micro" into v_balance;

  if v_balance is null then
    raise exception 'insufficient_balance' using errcode = 'P0001';
  end if;

  insert into "transaction"("userId", "kind", "amount_micro", "balance_after", "ref", "meta")
  values (p_user, 'debit', -p_amount, v_balance, p_ref, p_meta);

  return v_balance;
end $$;

-- =============================================================
-- Idempotent credit. Same ref => no-op (returns null).
-- Used by Stripe webhook (replay-safe) and signup-grant.
-- =============================================================
create or replace function credit_wallet(
  p_user text,
  p_amount bigint,
  p_kind tx_kind,
  p_ref text,
  p_meta jsonb default '{}'::jsonb
) returns bigint
language plpgsql
as $$
declare
  v_balance bigint;
  v_existing int;
begin
  if p_amount <= 0 then
    raise exception 'amount_must_be_positive';
  end if;

  if p_ref is not null then
    select 1 into v_existing from "transaction" where "ref" = p_ref limit 1;
    if found then
      return null;
    end if;
  end if;

  insert into "wallet"("userId", "balance_micro") values (p_user, 0)
    on conflict ("userId") do nothing;

  update "wallet"
     set "balance_micro" = "balance_micro" + p_amount,
         "updated_at"    = now()
   where "userId" = p_user
  returning "balance_micro" into v_balance;

  insert into "transaction"("userId", "kind", "amount_micro", "balance_after", "ref", "meta")
  values (p_user, p_kind, p_amount, v_balance, p_ref, p_meta);

  return v_balance;
end $$;
