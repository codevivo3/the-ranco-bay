import type {MetadataRoute} from "next";

import {getLocalizedPath, routing} from "@/i18n/routing";
import {getSiteUrl} from "@/lib/constants/site";
import {
  getPublishedPropertyInformation,
  isPropertyInformationReady,
} from "@/lib/sanity/property-information";

const publicPaths = [
  "",
  "house",
  "guide",
  "contact",
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl();

  const propertyResults = await Promise.all(
    routing.locales.map(async (locale) => {
      const result = await getPublishedPropertyInformation(locale);
      return [
        locale,
        result.status === "success" && isPropertyInformationReady(result.data),
      ] as const;
    }),
  );
  const readyPropertyLocales = propertyResults
    .filter(([, isReady]) => isReady)
    .map(([locale]) => locale);

  const existingPages = publicPaths.flatMap((path) => {
    const suffix = path ? `/${path}` : "";
    const languages = {
      ...Object.fromEntries(
        routing.locales.map((locale) => [
          locale,
          new URL(getLocalizedPath(locale, suffix), baseUrl).toString(),
        ]),
      ),
      "x-default": new URL(
        getLocalizedPath(routing.defaultLocale, suffix),
        baseUrl,
      ).toString(),
    };

    return routing.locales.map((locale) => ({
      url: new URL(getLocalizedPath(locale, suffix), baseUrl).toString(),
      changeFrequency: "monthly" as const,
      priority: path ? 0.8 : locale === routing.defaultLocale ? 1 : 0.9,
      alternates: {languages},
    }));
  });

  const propertyLanguages = Object.fromEntries(
    readyPropertyLocales.map((locale) => [
      locale,
      new URL(getLocalizedPath(locale, "/property"), baseUrl).toString(),
    ]),
  );
  const propertyAlternates = {
    ...propertyLanguages,
    ...(readyPropertyLocales.includes(routing.defaultLocale)
      ? {
          "x-default": new URL(
            getLocalizedPath(routing.defaultLocale, "/property"),
            baseUrl,
          ).toString(),
        }
      : {}),
  };
  const propertyPages = readyPropertyLocales.map((locale) => ({
    url: new URL(getLocalizedPath(locale, "/property"), baseUrl).toString(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
    alternates: {languages: propertyAlternates},
  }));

  return [...existingPages, ...propertyPages];
}
