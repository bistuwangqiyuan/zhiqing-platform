import { defineRouting } from "next-intl/routing";

export const locales = ["zh", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "zh";

export const routing = defineRouting({
  locales,
  defaultLocale,
  // Chinese keeps the bare paths (/products); English is prefixed (/en/products).
  localePrefix: "as-needed",
  // Persisted via the NEXT_LOCALE cookie + Accept-Language detection.
  localeDetection: true
});
