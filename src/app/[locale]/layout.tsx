import type {Metadata} from "next";
import {draftMode} from "next/headers";
import {hasLocale, NextIntlClientProvider} from "next-intl";
import {getTranslations, setRequestLocale} from "next-intl/server";
import {notFound} from "next/navigation";
import {VisualEditing} from "next-sanity/visual-editing";

import {SiteFooter} from "@/components/layout/site-footer";
import {SiteHeader} from "@/components/navigation/site-header";
import {PreviewExitControl} from "@/components/preview/preview-exit-control";
import {bodyFont, displayFont} from "@/lib/fonts";
import {getSiteUrl} from "@/lib/constants/site";
import {routing} from "@/i18n/routing";

import "../globals.css";

type LocaleLayoutProps = {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export function generateMetadata(): Metadata {
  return {
    metadataBase: getSiteUrl(),
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const {locale} = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const {isEnabled: isDraftMode} = await draftMode();
  const accessibility = await getTranslations({
    locale,
    namespace: "Accessibility",
  });

  return (
    <html
      lang={locale}
      data-scroll-behavior="smooth"
      className={`${displayFont.variable} ${bodyFont.variable}`}
    >
      <body>
        <NextIntlClientProvider>
          <a
            href="#main-content"
            className="sr-only z-[70] bg-page-surface px-4 py-3 text-page-text focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
          >
            {accessibility("skipToContent")}
          </a>
          <SiteHeader />
          {children}
          <SiteFooter />
          {isDraftMode ? (
            <>
              <VisualEditing />
              <PreviewExitControl locale={locale} />
            </>
          ) : null}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
