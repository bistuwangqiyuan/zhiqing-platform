/**
 * Auth.js v5 (NextAuth) configuration.
 *
 * Auth model: passwordless email magic-link, persisted to Neon via the
 * Drizzle adapter. We intentionally do NOT wire an SMTP provider yet —
 * `sendVerificationRequest` instead writes the URL to a transient
 * `dev_magic_links` cache + console, and `/login` then fetches it via
 * `/api/auth/dev-link` and shows it inline. This lets the platform run
 * without any third-party email service. Swap in Resend later by replacing
 * `sendVerificationRequest` with a real SMTP/HTTP send.
 *
 * Sign-up flow (handled by Auth.js + the Drizzle adapter):
 *   1. POST /api/auth/signin/email  → adapter creates/locates user row
 *   2. emailVerified set on first link click
 *   3. signIn callback fires → we ensure a wallet row exists and
 *      atomically grant ¥1 trial credit on first sight (idempotent via
 *      transaction.ref = `welcome-<userId>`).
 */
import NextAuth, { type NextAuthConfig } from "next-auth";
import EmailProvider from "next-auth/providers/nodemailer";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { getDb, isDbConfigured } from "@/lib/db";
import { rememberDevMagicLink } from "@/lib/auth/dev-link-cache";
import { grantSignupBonusIfMissing } from "@/lib/wallet";

export const SIGNUP_GRANT_MICRO = 1_000_000; // ¥1

function buildConfig(): NextAuthConfig {
  const secret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;

  if (!isDbConfigured() || !secret) {
    return {
      providers: [],
      pages: { signIn: "/login" },
      trustHost: true,
      // Provide a placeholder secret so NextAuth boot doesn't throw — middleware
      // and routes will detect the missing config separately and return 503.
      secret: secret ?? "missing-auth-secret-not-for-production"
    } satisfies NextAuthConfig;
  }

  const db = getDb();

  return {
    adapter: DrizzleAdapter(db),
    session: { strategy: "database" },
    trustHost: true,
    secret,
    pages: {
      signIn: "/login",
      verifyRequest: "/login?sent=1"
    },
    providers: [
      EmailProvider({
        // No real SMTP — sendVerificationRequest is overridden below.
        server: {
          host: "noop",
          port: 0,
          auth: { user: "", pass: "" }
        },
        from: process.env.AUTH_EMAIL_FROM ?? "noreply@zhiqing.local",
        async sendVerificationRequest({ identifier, url }) {
          rememberDevMagicLink(identifier, url);
          // eslint-disable-next-line no-console
          console.log(
            `[auth] magic-link for ${identifier}: ${url}\n` +
              "(dev-mode surfacing; configure a real email provider for production.)"
          );
        }
      })
    ],
    callbacks: {
      async signIn({ user }) {
        if (user?.id) {
          try {
            await grantSignupBonusIfMissing(user.id);
          } catch (e) {
            console.error("[auth] grantSignupBonusIfMissing failed", e);
          }
        }
        return true;
      },
      async session({ session, user }) {
        if (session.user && user) {
          session.user.id = user.id;
        }
        return session;
      }
    }
  } satisfies NextAuthConfig;
}

export const { handlers, signIn, signOut, auth } = NextAuth(buildConfig());
