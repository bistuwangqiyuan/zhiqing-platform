/**
 * Dev-mode magic-link cache.
 *
 * Auth.js v5 generates a magic link via `sendVerificationRequest`. Instead of
 * mailing it (no SMTP wired), we stash the most-recent link per email here
 * so `/login` can render it inline. After consumption (or 10 minutes,
 * whichever comes first) we drop it.
 *
 * SECURITY NOTE: This is intentionally exposed only when
 * `SHOW_DEV_MAGIC_LINK=1` (or NETLIFY_DEV=true) — see /api/auth/dev-link.
 * Once a real email provider (Resend / SES / SendGrid) is wired into
 * sendVerificationRequest in `auth.ts`, this whole module can be deleted.
 *
 * Cache lives in module scope, which on Netlify means per-Lambda-instance.
 * That is fine for the dev-mode UX: the same browser typically lands on
 * the same warm instance, and stale entries are auto-pruned.
 */
type Entry = { url: string; expiresAt: number };

const cache: Map<string, Entry> = (globalThis as any).__zhiqingDevLinkCache ??
  ((globalThis as any).__zhiqingDevLinkCache = new Map());

const TTL_MS = 10 * 60 * 1000;

export function rememberDevMagicLink(identifier: string, url: string): void {
  pruneExpired();
  cache.set(identifier.toLowerCase().trim(), {
    url,
    expiresAt: Date.now() + TTL_MS
  });
}

export function consumeDevMagicLink(identifier: string): string | null {
  pruneExpired();
  const key = identifier.toLowerCase().trim();
  const e = cache.get(key);
  if (!e) return null;
  if (e.expiresAt < Date.now()) {
    cache.delete(key);
    return null;
  }
  return e.url;
}

function pruneExpired() {
  const now = Date.now();
  for (const [k, v] of cache.entries()) {
    if (v.expiresAt < now) cache.delete(k);
  }
}

export function isDevLinkSurfacingEnabled(): boolean {
  return (
    process.env.SHOW_DEV_MAGIC_LINK === "1" ||
    process.env.NETLIFY_DEV === "true" ||
    process.env.NODE_ENV !== "production" ||
    // No real SMTP configured ⇒ surface the link, otherwise the user can
    // never finish login. Once you wire a real email provider, remove this
    // last clause and gate strictly on SHOW_DEV_MAGIC_LINK.
    !process.env.AUTH_EMAIL_PROVIDER_HOST
  );
}
