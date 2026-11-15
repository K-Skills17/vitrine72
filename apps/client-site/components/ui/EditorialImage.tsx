import Image from "next/image";
import { cx } from "./cx";

const ratios = {
  portrait: "aspect-[4/5]",
  landscape: "aspect-[3/2]",
  band: "aspect-[4/3] md:aspect-[21/9]",
  square: "aspect-square",
} as const;

interface EditorialImageProps {
  src: string;
  alt: string;
  ratio: keyof typeof ratios;
  sizes: string;
  priority?: boolean;
  className?: string;
}

/** Every photograph: fixed ratio (no layout shift), cover crop, next/image. */
export function EditorialImage({ src, alt, ratio, sizes, priority, className }: EditorialImageProps) {
  return (
    <div className={cx("relative overflow-hidden bg-surface", ratios[ratio], className)}>
      <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
    </div>
  );
}
