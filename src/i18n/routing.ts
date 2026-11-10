import {defineRouting} from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "it", "de", "fr"],
  defaultLocale: "en",
  localePrefix: "as-needed",
  localeDetection: false,
  alternateLinks: false,
});

export type AppLocale = (typeof routing.locales)[number];

export function getLocalizedPath(locale: string, pathname = "") {
  const suffix = pathname === "/" ? "" : pathname.startsWith("/")
    ? pathname
    : `/${pathname}`;

  if (locale === routing.defaultLocale) {
    return suffix || "/";
  }

  return suffix ? `/${locale}${suffix}` : `/${locale}/`;
}
