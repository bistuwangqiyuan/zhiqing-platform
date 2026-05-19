/**
 * DEPRECATED. The fake demo subscription checkout has been replaced by:
 *   - /api/stripe/checkout  – real one-time top-up (Alipay / WeChat / Card)
 *   - /account              – wallet + usage dashboard
 *
 * This stub remains so legacy bookmarks return a clear error instead of 404.
 */
import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      error: "deprecated",
      message:
        "本端点已停用。个人按量付费请前往 /account 充值（支付宝 / 微信 / 信用卡）。企业咨询请见 /contact。",
      redirect: "/account"
    },
    { status: 410 }
  );
}

export async function GET() {
  return NextResponse.redirect(
    new URL(
      "/account",
      process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
    ),
    { status: 308 }
  );
}
