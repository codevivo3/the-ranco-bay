import type {Metadata} from "next";

import {routing, type AppLocale} from "@/i18n/routing";

type SocialPage =
  | "contact"
  | "guide"
  | "home"
  | "house"
  | "property"
  | "upperFloor";

const openGraphLocales: Record<AppLocale, string> = {
  en: "en_US",
  it: "it_IT",
  de: "de_DE",
  fr: "fr_FR",
};

const officialSocialImage = {
  url: "/openGraph/trb-open-graph.png",
  width: 1200,
  height: 630,
  alt: "The Ranco Bay — Lake Maggiore Apartments",
} as const;

type LocalizedSocialMetadataOptions = {
  description: string;
  locale: string;
  page: SocialPage;
  pathname: string;
  socialImage?: {
    alt: string;
    height?: number;
    url: string;
    width?: number;
  };
  title: string;
};

export async function getLocalizedSocialMetadata({
  description,
  locale,
  pathname,
  socialImage,
  title,
}: LocalizedSocialMetadataOptions): Promise<
  Pick<Metadata, "openGraph" | "twitter">
> {
  const openGraphLocale = openGraphLocales[locale as AppLocale];

  if (!openGraphLocale) {
    throw new Error(`Unsupported social metadata locale: ${locale}`);
  }

  const image = socialImage ?? officialSocialImage;

  return {
    openGraph: {
      type: "website",
      title,
      description,
      url: pathname,
      locale: openGraphLocale,
      alternateLocale: routing.locales
        .filter((supportedLocale) => supportedLocale !== locale)
        .map((supportedLocale) => openGraphLocales[supportedLocale]),
      images: [
        {
          url: image.url,
          width: image.width,
          height: image.height,
          alt: image.alt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image.url],
    },
  };
}
