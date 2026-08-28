type SectionHeadingProps = {
  body?: string;
  eyebrow: string;
  title: string;
  titleLines?: readonly string[];
  titleRole?: "editorial" | "section";
};

export function SectionHeading({
  body,
  eyebrow,
  title,
  titleLines,
  titleRole = "section",
}: SectionHeadingProps) {
  const isEditorialStatement = titleRole === "editorial";

  return (
    <div className={isEditorialStatement ? "max-w-none" : "max-w-3xl"}>
      <p className="text-xs uppercase tracking-[0.18em] text-page-muted">
        {eyebrow}
      </p>
      <h2
        className={`${isEditorialStatement ? "editorial-statement" : "section-display"} mt-5 text-page-text-strong`}
      >
        {titleLines
          ? titleLines.map((line, index) => (
              <span key={line} className="lg:block">
                {line}
                {index < titleLines.length - 1 ? " " : null}
              </span>
            ))
          : title}
      </h2>
      {body ? (
        <p className="mt-6 max-w-2xl text-base leading-7 text-page-muted sm:text-lg sm:leading-8">
          {body}
        </p>
      ) : null}
    </div>
  );
}
