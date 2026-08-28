type TemporaryGalleryPlaceholderProps = {
  slideNumber: number;
  tone: "lagoon" | "lake" | "sand";
};

export const TEMPORARY_GALLERY_TEST_SLIDES = [
  {format: "portrait", slideNumber: 2, tone: "sand"},
  {format: "landscape", slideNumber: 3, tone: "lagoon"},
  {format: "portrait", slideNumber: 4, tone: "lake"},
] as const;

const toneClasses = {
  lagoon:
    "bg-[var(--trb-lagoon)] text-[color-mix(in_srgb,var(--trb-sand)_82%,transparent)]",
  lake: "bg-[var(--trb-lake)] text-[color-mix(in_srgb,var(--trb-sand)_82%,transparent)]",
  sand: "bg-[var(--trb-sand)] text-[color-mix(in_srgb,var(--trb-lake)_72%,transparent)]",
} as const;

export function TemporaryGalleryPlaceholder({
  slideNumber,
  tone,
}: TemporaryGalleryPlaceholderProps) {
  return (
    <div
      aria-hidden="true"
      data-temporary-gallery-placeholder="true"
      className={`${toneClasses[tone]} relative flex h-full w-full items-center justify-center overflow-hidden`}
    >
      <div className="absolute inset-[clamp(0.75rem,2vw,1.5rem)] border border-dashed border-current opacity-35" />
      <span className="font-display text-[clamp(3rem,7vw,7rem)] leading-none opacity-55">
        {String(slideNumber).padStart(2, "0")}
      </span>
    </div>
  );
}
