import type {Metadata} from "next";
import {getTranslations} from "next-intl/server";

import {routing} from "@/i18n/routing";
import {getLocalizedSocialMetadata} from "@/lib/seo/localized-social-metadata";

type PublicPage = "contact" | "guide" | "house" | "property" | "upperFloor";

type MetadataOverrides = {
  description?: string;
  index?: boolean;
  socialImage?: {
    alt: string;
    height?: number;
    url: string;
    width?: number;
  };
  title?: string;
};

const pagePaths: Record<PublicPage, string> = {
  contact: 'contact',
  guide: 'guide',
  house: 'house',
  property: 'property',
  upperFloor: 'apartments/upper-floor',
};

export async function getLocalizedPageMetadata(
  locale: string,
  page: PublicPage,
  overrides: MetadataOverrides = {},
): Promise<Metadata> {
  const t = await getTranslations({locale, namespace: "Metadata.pages"});
  const pathname = `/${locale}/${pagePaths[page]}`;
  const title = overrides.title ?? t(`${page}.title`);
  const description = overrides.description ?? t(`${page}.description`);
  const socialMetadata = await getLocalizedSocialMetadata({
    locale,
    page,
    pathname,
    socialImage: overrides.socialImage,
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
    ...(page === 'upperFloor' || overrides.index === false
      ? {
          robots: {
            index: false,
            follow: true,
          },
        }
      : {}),
  };
}
