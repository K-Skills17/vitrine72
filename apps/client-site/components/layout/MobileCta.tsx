import { config, primaryCta } from "@/lib/config";
import { ButtonLink } from "../ui/Button";

/**
 * The one floating action on small screens: a full-width bar. The body
 * reserves its height (pb-sticky-cta) so it never covers content.
 */
export default function MobileCta() {
  const cta = primaryCta(config);
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-bg px-gutter py-3 md:hidden">
      <ButtonLink href={cta.href} external={cta.external} className="w-full">
        {cta.label}
      </ButtonLink>
    </div>
  );
}
