import type {Metadata} from "next";
import {getTranslations} from "next-intl/server";

import {routing} from "@/i18n/routing";
import {getLocalizedSocialMetadata} from "@/lib/seo/localized-social-metadata";

type PublicPage = "contact" | "guide" | "house" | "upperFloor";

const pagePaths: Record<PublicPage, string> = {
  contact: 'contact',
  guide: 'guide',
  house: 'house',
  upperFloor: 'apartments/upper-floor',
};

export async function getLocalizedPageMetadata(
  locale: string,
  page: PublicPage,
): Promise<Metadata> {
  const t = await getTranslations({locale, namespace: "Metadata.pages"});
  const pathname = `/${locale}/${pagePaths[page]}`;
  const title = t(`${page}.title`);
  const description = t(`${page}.description`);
  const socialMetadata = await getLocalizedSocialMetadata({
    locale,
    page,
    pathname,
    title,
    description,
  });

  return {
    title,
    description,
    alternates: {
      canonical: pathname,
      languages: Object.fromEntries(
        routing.locales.map((supportedLocale) => [
          supportedLocale,
          `/${supportedLocale}/${pagePaths[page]}`,
        ]),
      ),
    },
    ...socialMetadata,
    ...(page === 'upperFloor'
      ? {
          robots: {
            index: false,
            follow: true,
          },
        }
      : {}),
  };
}
