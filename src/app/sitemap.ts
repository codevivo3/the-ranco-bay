import type {MetadataRoute} from "next";

import {routing} from "@/i18n/routing";
import {getSiteUrl} from "@/lib/constants/site";

const publicPaths = ["", "house", "guide", "contact"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getSiteUrl();

  return publicPaths.flatMap((path) => {
    const suffix = path ? `/${path}` : "";
    const languages = Object.fromEntries(
      routing.locales.map((locale) => [
        locale,
        new URL(`/${locale}${suffix}`, baseUrl).toString(),
      ]),
    );

    return routing.locales.map((locale) => ({
      url: new URL(`/${locale}${suffix}`, baseUrl).toString(),
      changeFrequency: "monthly" as const,
      priority: path ? 0.8 : locale === routing.defaultLocale ? 1 : 0.9,
      alternates: {languages},
    }));
  });
}
