import Image from "next/image";

type HouseChapterImageProps = {
  alt: string;
  image: string;
  imagePosition?: string;
};

type HouseChapterTextProps = {
  body: string;
  index: string;
  title: string;
};

export function HouseChapterImage({
  alt,
  image,
  imagePosition,
}: HouseChapterImageProps) {
  return (
    <div className="relative h-full w-full overflow-hidden">
      <Image
        src={image}
        alt={alt}
        fill
        sizes="(min-width: 1024px) 58vw, 92vw"
        className="object-cover transition-transform duration-700 group-hover:scale-[1.01] motion-reduce:transition-none"
        style={imagePosition ? {objectPosition: imagePosition} : undefined}
      />
    </div>
  );
}

export function HouseChapterText({
  body,
  index,
  title,
}: HouseChapterTextProps) {
  return (
    <article className="editorial-gallery-text-card trb-editorial-glass">
      <div>
        <p className="text-xs tabular-nums tracking-[0.18em] text-page-muted">
          {index}
        </p>
        <h2 className="mt-5 font-display text-4xl leading-none text-page-text-strong sm:text-5xl">
          {title}
        </h2>
        <p className="mt-6 max-w-xl text-base leading-7 text-page-muted sm:text-lg sm:leading-8">
          {body}
        </p>
      </div>
    </article>
  );
}
