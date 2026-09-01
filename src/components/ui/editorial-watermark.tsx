import Image from "next/image";

type EditorialWatermarkProps = {
  opacity?: number;
  tone?: "default" | "inverse";
  variant?: "lower-left" | "lower-right" | "upper-right";
};

export function EditorialWatermark({
  opacity,
  tone = "default",
  variant = "lower-right",
}: EditorialWatermarkProps) {
  return (
    <div
      aria-hidden="true"
      className={`editorial-watermark editorial-watermark--${variant} editorial-watermark--${tone}`}
      style={opacity === undefined ? undefined : {opacity}}
    >
      <Image
        src="/logo/trb-logo-image-plain.svg"
        alt=""
        fill
        sizes="(min-width: 1024px) 115rem, 125vw"
        className="object-contain"
        draggable={false}
      />
    </div>
  );
}
