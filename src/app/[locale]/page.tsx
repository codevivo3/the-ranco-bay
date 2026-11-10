import type {Metadata} from "next";
import {hasLocale} from "next-intl";
import {getTranslations, setRequestLocale} from "next-intl/server";
import {notFound} from "next/navigation";

import {HomepageDiscovery} from "@/components/sections/homepage-discovery";
import {StaticHomeHero} from "@/components/sections/static-home-hero";
import {
  getLocalizedPath,
  routing,
  type AppLocale,
} from "@/i18n/routing";
import {getSiteUrl} from "@/lib/constants/site";
import {getLocalizedSocialMetadata} from "@/lib/seo/localized-social-metadata";

type HomePageProps = {
  params: Promise<{locale: string}>;
};

export async function generateMetadata({
  params,
}: HomePageProps): Promise<Metadata> {
  const {locale} = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const t = await getTranslations({locale, namespace: "Metadata"});
  const metadataBase = getSiteUrl();
  const pathname = getLocalizedPath(locale);
  const pageUrl = new URL(pathname, metadataBase).toString();
  const socialMetadata = await getLocalizedSocialMetadata({
    locale,
    page: "home",
    pathname: pageUrl,
    title: t("openGraphTitle"),
    description: t("openGraphDescription"),
  });

  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: pageUrl,
      languages: {
        ...Object.fromEntries(
          routing.locales.map((supportedLocale) => [
            supportedLocale,
            new URL(
              getLocalizedPath(supportedLocale),
              metadataBase,
            ).toString(),
          ]),
        ),
        "x-default": new URL(
          getLocalizedPath(routing.defaultLocale),
          metadataBase,
        ).toString(),
      },
    },
    ...socialMetadata,
  };
}

export default async function HomePage({params}: HomePageProps) {
  const {locale} = await params;
  setRequestLocale(locale);

  return (
    <main id="main-content">
      <StaticHomeHero />
      <HomepageDiscovery locale={locale as AppLocale} />
    </main>
  );
}
