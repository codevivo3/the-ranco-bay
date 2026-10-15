import {setRequestLocale} from "next-intl/server";

import {HomepageDiscovery} from "@/components/sections/homepage-discovery";
import {StaticHomeHero} from "@/components/sections/static-home-hero";

type HomePageProps = {
  params: Promise<{locale: string}>;
};

export default async function HomePage({params}: HomePageProps) {
  const {locale} = await params;
  setRequestLocale(locale);

  return (
    <main id="main-content">
      <StaticHomeHero />
      <HomepageDiscovery />
    </main>
  );
}
