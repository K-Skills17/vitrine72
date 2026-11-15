import Image from "next/image";
import Link from "next/link";
import { config, getPhotoUrl } from "@/lib/config";

/** Client logo when supplied, otherwise the business name set in the display face. */
export function Wordmark() {
  const logo = config.logoPath ? getPhotoUrl(config.logoPath) : "";
  return (
    <Link href="/" className="inline-flex min-h-11 items-center" aria-label={`${config.businessName} — início`}>
      {logo ? (
        <Image src={logo} alt="" width={160} height={48} className="h-10 w-auto object-contain" priority />
      ) : (
        <span className="font-display text-2xl leading-none text-ink">{config.businessName}</span>
      )}
    </Link>
  );
}
