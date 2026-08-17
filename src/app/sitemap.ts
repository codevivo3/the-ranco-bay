import type {MetadataRoute} from "next";

import {routing} from "@/i18n/routing";
import {getSiteUrl} from "@/lib/constants/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getSiteUrl();
  const languages = Object.fromEntries(
    routing.locales.map((locale) => [locale, new URL(`/${locale}`, baseUrl).toString()]),
  );

  return routing.locales.map((locale) => ({
    url: new URL(`/${locale}`, baseUrl).toString(),
    changeFrequency: "monthly",
    priority: locale === routing.defaultLocale ? 1 : 0.9,
    alternates: {languages},
  }));
}
