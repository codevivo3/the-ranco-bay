import {getTranslations} from "next-intl/server";

import {Link} from "@/i18n/navigation";
import {routing} from "@/i18n/routing";
import {Container} from "@/components/layout/container";

export async function SiteHeader() {
  const t = await getTranslations("Navigation");

  return (
    <header className="border-b border-page-border bg-page-surface">
      <Container className="flex flex-wrap items-center justify-between gap-5 py-5">
        <Link className="font-display text-xl text-page-accent" href="/">
          {t("brand")}
        </Link>
        <nav aria-label={t("primaryLabel")}>
          <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
            <li><Link href="/#stay">{t("stay")}</Link></li>
            <li><Link href="/#story">{t("story")}</Link></li>
            <li><Link href="/#guide">{t("guide")}</Link></li>
            <li><Link href="/#location">{t("location")}</Link></li>
          </ul>
        </nav>
        <nav aria-label={t("languageLabel")}>
          <ul className="flex gap-3 text-xs uppercase tracking-[0.12em]">
            {routing.locales.map((locale) => (
              <li key={locale}>
                <Link href="/" locale={locale} hrefLang={locale}>
                  {t(`locales.${locale}`)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </header>
  );
}
