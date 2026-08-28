import {setRequestLocale} from "next-intl/server";

import {CinematicHero} from "@/components/sections/cinematic-hero";
import {HomepageDiscovery} from "@/components/sections/homepage-discovery";

type HomePageProps = {
  params: Promise<{locale: string}>;
};

export default async function HomePage({params}: HomePageProps) {
  const {locale} = await params;
  setRequestLocale(locale);

  return (
    <main id="main-content">
      <CinematicHero />
      <HomepageDiscovery />
    </main>
  );
}
