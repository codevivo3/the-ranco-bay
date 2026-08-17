import {getTranslations} from "next-intl/server";

import {Container} from "./container";

export async function SiteFooter() {
  const t = await getTranslations("Common.Footer");

  return (
    <footer className="border-t border-page-border bg-page-surface py-8">
      <Container className="flex flex-wrap justify-between gap-3 text-sm text-page-muted">
        <p>{t("brand")}</p>
        <p>{t("location")}</p>
      </Container>
    </footer>
  );
}
