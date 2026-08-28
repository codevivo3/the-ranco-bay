import type {Metadata} from "next";
import {getTranslations} from "next-intl/server";

import {routing} from "@/i18n/routing";

type PublicPage = "contact" | "guide" | "house";

export async function getLocalizedPageMetadata(
  locale: string,
  page: PublicPage,
): Promise<Metadata> {
  const t = await getTranslations({locale, namespace: "Metadata.pages"});
  const pathname = `/${locale}/${page}`;

  return {
    title: t(`${page}.title`),
    description: t(`${page}.description`),
    alternates: {
      canonical: pathname,
      languages: Object.fromEntries(
        routing.locales.map((supportedLocale) => [
          supportedLocale,
          `/${supportedLocale}/${page}`,
        ]),
      ),
    },
    openGraph: {
      title: t(`${page}.title`),
      description: t(`${page}.description`),
      url: pathname,
    },
  };
}
