type HomeSectionProps = {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  tone?: "default" | "surface" | "accent";
};

const toneClasses = {
  default: "bg-page-background text-page-text",
  surface: "bg-page-surface text-page-text",
  accent: "bg-page-accent text-page-surface",
} as const;

export function HomeSection({
  id,
  eyebrow,
  title,
  body,
  tone = "default",
}: HomeSectionProps) {
  return (
    <section id={id} className={`py-[var(--space-section)] ${toneClasses[tone]}`}>
      <div className="mx-auto max-w-[var(--content-width)] px-[var(--space-gutter)]">
        <div className="max-w-[var(--content-narrow)]">
          <p className="mb-5 text-xs uppercase tracking-[0.18em] opacity-75">
            {eyebrow}
          </p>
          <h2 className="font-display text-4xl sm:text-5xl">{title}</h2>
          <p className="mt-6 max-w-2xl text-base leading-7 sm:text-lg">{body}</p>
        </div>
      </div>
    </section>
  );
}
