import {setRequestLocale} from "next-intl/server";

import {HomepageDiscovery} from "@/components/sections/homepage-discovery";
import {StaticHomeHero} from "@/components/sections/static-home-hero";
import type {AppLocale} from "@/i18n/routing";

type HomePageProps = {
  params: Promise<{locale: string}>;
};

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
