import { Reveal } from "@/components/Reveal";
import { Mail, Phone, MapPin, ShieldCheck } from "lucide-react";
import { ContactForm } from "@/components/ContactForm";

export const metadata = { title: "联系我们" };

export default function ContactPage({ searchParams }: { searchParams: { type?: string } }) {
  const type = searchParams?.type ?? "general";

  return (
    <section className="pt-28 pb-24">
      <div className="container">
        <div className="grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-5">
            <Reveal>
              <p className="text-[12px] tracking-[0.18em] uppercase text-ink-500">Contact</p>
              <h1 className="mt-3 text-display-xl font-semibold text-ink-900 tracking-tightest">
                我们直接<br /> 与<span className="text-gradient-gold">创始人</span>对话。
              </h1>
              <p className="mt-6 text-[15px] text-ink-500 leading-relaxed">
                填写以下表单，72 小时内由合伙人级顾问与你取得联系。深度陪跑申请将进入 Critic Agent 预筛流程。
              </p>

              <div className="mt-12 space-y-5">
                <Item icon={<Mail className="h-4 w-4" />} title="邮箱" value="founders@zhiqing.ai" />
                <Item icon={<Phone className="h-4 w-4" />} title="电话" value="+86 21 8088 8888 / +1 415 888 8888" />
                <Item icon={<MapPin className="h-4 w-4" />} title="办公室" value="上海 · 新加坡 · 伦敦" />
                <Item icon={<ShieldCheck className="h-4 w-4" />} title="NDA" value="可在创始人会议前签署，保护团队商业秘密" />
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-7">
            <ContactForm defaultType={type} />
          </div>
        </div>
      </div>
    </section>
  );
}

function Item({ icon, title, value }: { icon: React.ReactNode; title: string; value: string }) {
  return (
    <div className="flex items-start gap-4">
      <span className="h-9 w-9 rounded-full bg-ink-50 grid place-items-center text-ink-700 flex-shrink-0">{icon}</span>
      <div>
        <p className="text-[12px] text-ink-400">{title}</p>
        <p className="text-[14px] text-ink-700 mt-0.5">{value}</p>
      </div>
    </div>
  );
}
