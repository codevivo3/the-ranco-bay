import {getTranslations, setRequestLocale} from "next-intl/server";

import {Container} from "@/components/layout/container";
import {SiteFooter} from "@/components/layout/site-footer";
import {SiteHeader} from "@/components/navigation/site-header";
import {CinematicHero} from "@/components/sections/cinematic-hero";
import {HomeSection} from "@/components/sections/home-section";
import {Link} from "@/i18n/navigation";

type HomePageProps = {
  params: Promise<{locale: string}>;
};

export default async function HomePage({params}: HomePageProps) {
  const {locale} = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Home");
  const accessibility = await getTranslations("Accessibility");

  return (
    <>
      <Link
        href="/#main-content"
        className="sr-only z-50 bg-page-surface px-4 py-3 focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        {accessibility("skipToContent")}
      </Link>
      <SiteHeader />
      <main id="main-content">
        <CinematicHero />
        <HomeSection id="story" eyebrow={t("Story.eyebrow")} title={t("Story.title")} body={t("Story.body")} />
        <HomeSection id="stay" eyebrow={t("Accommodation.eyebrow")} title={t("Accommodation.title")} body={t("Accommodation.body")} tone="surface" />
        <HomeSection id="guide" eyebrow={t("Guide.eyebrow")} title={t("Guide.title")} body={t("Guide.body")} />
        <HomeSection id="guest" eyebrow={t("GuestCompanion.eyebrow")} title={t("GuestCompanion.title")} body={t("GuestCompanion.body")} tone="surface" />
        <HomeSection id="location" eyebrow={t("Location.eyebrow")} title={t("Location.title")} body={t("Location.body")} />
        <section className="bg-page-accent py-[var(--space-section)] text-page-surface">
          <Container>
            <div className="max-w-[var(--content-narrow)]">
              <p className="mb-5 text-xs uppercase tracking-[0.18em] opacity-80">{t("FinalCta.eyebrow")}</p>
              <h2 className="font-display text-4xl sm:text-6xl">{t("FinalCta.title")}</h2>
              <p className="mt-6 text-lg leading-8">{t("FinalCta.body")}</p>
            </div>
          </Container>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
