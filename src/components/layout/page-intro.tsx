import Image from "next/image";

import {Container} from "@/components/layout/container";

type PageIntroProps = {
  alt: string;
  body: string;
  eyebrow: string;
  fullViewport?: boolean;
  image: string;
  title: string;
  titleLines?: readonly string[];
  titleLinesFromDesktop?: boolean;
  titleRole?: "editorial" | "hero";
  wideEditorial?: boolean;
};

export function PageIntro({
  alt,
  body,
  eyebrow,
  fullViewport = false,
  image,
  title,
  titleLines,
  titleLinesFromDesktop = false,
  titleRole = "hero",
  wideEditorial = false,
}: PageIntroProps) {
  const isEditorialStatement = titleRole === "editorial";

  return (
    <section
      className={`${fullViewport ? "flex min-h-[100svh] items-center" : ""} bg-page-background pb-[var(--space-section)] pt-[clamp(9rem,18vw,13rem)]`}
    >
      <Container
        className={
          isEditorialStatement && wideEditorial ? "!max-w-[110rem]" : ""
        }
      >
        <div
          className={`grid items-end gap-10 lg:gap-16 ${isEditorialStatement ? "lg:grid-cols-[1.5fr_1fr]" : "lg:grid-cols-[0.82fr_1.18fr]"}`}
        >
          <div className="pb-2">
            <p className="text-xs uppercase tracking-[0.18em] text-page-muted">
              {eyebrow}
            </p>
            <h1
              className={`${isEditorialStatement ? "editorial-statement" : "hero-display"} mt-5 text-page-text-strong`}
            >
              {titleLines
                ? titleLines.map((line, index) => (
                    <span
                      key={line}
                      className={titleLinesFromDesktop ? "lg:block" : "block"}
                    >
                      {line}
                      {titleLinesFromDesktop && index < titleLines.length - 1
                        ? " "
                        : null}
                    </span>
                  ))
                : title}
            </h1>
            <p className="mt-7 max-w-xl text-base leading-7 text-page-muted sm:text-lg sm:leading-8">
              {body}
            </p>
          </div>
          <div className="relative aspect-[4/5] min-h-[28rem] overflow-hidden sm:aspect-[5/4] lg:aspect-[4/5] lg:max-h-[46rem]">
            <Image
              src={image}
              alt={alt}
              fill
              sizes={
                isEditorialStatement
                  ? "(min-width: 1024px) 40vw, 100vw"
                  : "(min-width: 1024px) 55vw, 100vw"
              }
              className="object-cover"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
