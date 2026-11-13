import Image from "next/image";
import { cx } from "@/lib/utils";
import type { ImageRatio, ImageRef } from "@/types/image";

const ratios: Record<ImageRatio, string> = {
  "4/5": "aspect-[4/5]",
  "3/4": "aspect-[3/4]",
  "4/3": "aspect-[4/3]",
  "1/1": "aspect-square",
  "16/10": "aspect-[16/10]",
};

interface EditorialImageProps {
  image: ImageRef;
  ratio: ImageRatio;
  /** Responsive `sizes` hint for next/image. */
  sizes: string;
  priority?: boolean;
  /** Fade/slide in when scrolled into view (RevealObserver). */
  reveal?: boolean;
  className?: string;
}

/**
 * The only way photographs are rendered. Square-edged, fixed aspect ratio
 * (no layout shift), and a labelled sand placeholder while `src` is null.
 */
export function EditorialImage({ image, ratio, sizes, priority = false, reveal, className }: EditorialImageProps) {
  return (
    <figure data-reveal={reveal ? "" : undefined} className={cx("relative overflow-hidden bg-sand", ratios[ratio], className)}>
      {image.src ? (
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes={sizes}
          priority={priority}
          className={cx("object-cover", priority && "animate-hero-settle")}
          style={image.focal ? { objectPosition: image.focal } : undefined}
        />
      ) : (
        <div role="img" aria-label={image.alt} className="absolute inset-0 flex items-end p-5">
          <p className="text-caption text-umber">
            <span className="mr-2 font-semibold tracking-[0.12em]">IMG {image.slot}</span>
            {image.subject}
          </p>
        </div>
      )}
    </figure>
  );
}
