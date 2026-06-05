"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { signIn } from "next-auth/react";
import {
  Mail,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Link as LinkIcon
} from "lucide-react";

type State = "idle" | "sending" | "sent" | "error";

export function LoginForm() {
  const t = useTranslations("login");
  const search = useSearchParams();
  const redirect = search.get("redirect") ?? "/account";
  const urlError = search.get("error");

  const [email, setEmail] = useState("");
  const [state, setState] = useState<State>("idle");
  const [devLink, setDevLink] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(
    urlError === "auth_not_configured"
      ? t("errorNotConfigured")
      : urlError
        ? decodeURIComponent(urlError)
        : null
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setState("sending");
    setError(null);
    setDevLink(null);

    const callbackUrl = redirect.startsWith("/") ? redirect : "/account";

    try {
      const result = await signIn("nodemailer", {
        email,
        callbackUrl,
        redirect: false
      });
      if (result?.error) {
        setState("error");
        setError(result.error);
        return;
      }
    } catch (err) {
      setState("error");
      setError((err as Error).message);
      return;
    }

    // Surface the dev magic-link if the API exposes it (no email service yet).
    try {
      const r = await fetch(
        `/api/auth/dev-link?email=${encodeURIComponent(email)}`,
        { cache: "no-store" }
      );
      if (r.ok) {
        const data = (await r.json()) as { url?: string };
        if (data.url) setDevLink(data.url);
      }
    } catch {
      // ignore — production with real email won't expose this
    }

    setState("sent");
  }

  if (state === "sent") {
    return (
      <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
        <CheckCircle2 className="h-6 w-6 text-emerald-600" />
        <h3 className="mt-3 text-[15px] font-semibold text-emerald-900">
          {devLink ? t("sentTitleLink") : t("sentTitleEmail")}
        </h3>
        {devLink ? (
          <>
            <p className="mt-2 text-[13px] text-emerald-800 leading-relaxed">
              {t.rich("devLinkDesc", { email, b: (c) => <strong>{c}</strong> })}
            </p>
            <a
              href={devLink}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-[13px] font-medium text-white hover:bg-emerald-700"
            >
              <LinkIcon className="h-4 w-4" />
              {t("clickToLogin")}
            </a>
          </>
        ) : (
          <p className="mt-2 text-[13px] text-emerald-800 leading-relaxed">
            {t.rich("emailSentDesc", { email, b: (c) => <strong>{c}</strong> })}
          </p>
        )}
        <button
          onClick={() => {
            setState("idle");
            setEmail("");
            setDevLink(null);
          }}
          className="mt-4 ml-3 text-[13px] text-emerald-700 underline"
        >
          {t("changeEmail")}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-4">
      <div>
        <label className="text-[12px] text-ink-500" htmlFor="email">
          {t("emailLabel")}
        </label>
        <div className="mt-2 relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={state === "sending"}
            className="w-full pl-9 pr-4 py-3 rounded-xl border border-ink-200 bg-white text-[14px] text-ink-900 placeholder:text-ink-400 focus:border-ink-700 focus:outline-none disabled:opacity-50"
          />
        </div>
      </div>

      {error && (
        <div className="flex gap-2 items-start text-[12px] text-coral-600 bg-coral-50 p-3 rounded-lg">
          <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={state === "sending"}
        className="w-full btn-primary justify-center disabled:opacity-50"
      >
        {state === "sending" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            {t("sending")}
          </>
        ) : (
          t("submit")
        )}
      </button>

      <p className="text-[11px] text-ink-400 text-center pt-2">
        {t.rich("agree", {
          terms: (c) => (
            <Link href="/about#terms" className="underline">
              {c}
            </Link>
          ),
          privacy: (c) => (
            <Link href="/about#privacy" className="underline">
              {c}
            </Link>
          )
        })}
      </p>
    </form>
  );
}
