import {getTranslations} from "next-intl/server";

import {Container} from "@/components/layout/container";
import {Link} from "@/i18n/navigation";

export default async function NotFound() {
  const t = await getTranslations("Common.NotFound");

  return (
    <main className="flex min-h-screen items-center py-[var(--space-section)]">
      <Container>
        <h1 className="font-display text-5xl sm:text-7xl">{t("title")}</h1>
        <p className="mt-6 max-w-xl text-lg text-page-muted">{t("description")}</p>
        <Link className="mt-8 inline-block border-b border-current py-2" href="/">
          {t("returnHome")}
        </Link>
      </Container>
    </main>
  );
}
