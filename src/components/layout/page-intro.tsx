import Image from "next/image";

import {Container} from "@/components/layout/container";
import {PageIntroFrame} from "@/components/layout/page-intro-frame";

type PageIntroProps = {
  alt: string;
  body: string;
  eyebrow: string;
  image: string;
  title: string;
  titleLines?: readonly string[];
  titleLinesFromDesktop?: boolean;
  titleRole?: "editorial" | "hero";
};

export function PageIntro({
  alt,
  body,
  eyebrow,
  image,
  title,
  titleLines,
  titleLinesFromDesktop = false,
  titleRole = "hero",
}: PageIntroProps) {
  const isEditorialStatement = titleRole === "editorial";

  return (
    <PageIntroFrame>
      <Container className="py-8">
        <div
          className={`grid items-center gap-10 lg:gap-16 ${isEditorialStatement ? "lg:grid-cols-[1.65fr_1fr]" : "lg:grid-cols-[0.82fr_1.18fr]"}`}
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
          <div className="relative aspect-square w-full max-w-[34rem] justify-self-start overflow-hidden lg:max-w-none">
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
    </PageIntroFrame>
  );
}
