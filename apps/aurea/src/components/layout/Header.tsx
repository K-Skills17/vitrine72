import { WhatsAppLink } from "@/components/conversion/WhatsAppLink";
import { Container } from "@/components/ui/Container";
import { primaryNav } from "@/content/navigation";
import { siteConfig } from "@/config/site";
import { Logo } from "./Logo";
import { MobileNav } from "./MobileNav";
import { NavLinks } from "./NavLinks";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-ivory">
      <Container className="flex h-header items-center justify-between gap-8">
        <Logo />

        <nav aria-label="Principal" className="hidden lg:block">
          <NavLinks items={primaryNav} />
        </nav>

        <div className="flex items-center gap-6">
          <div className="hidden md:block">
            <WhatsAppLink location="header" size="compact" />
          </div>
          <div className="lg:hidden">
            <MobileNav
              items={primaryNav}
              footer={
                <div className="flex flex-col gap-6">
                  <WhatsAppLink location="mobile-nav" fullWidth />
                  <p className="text-small text-umber">
                    {siteConfig.address.street.value} · {siteConfig.address.city.value}
                  </p>
                </div>
              }
            />
          </div>
        </div>
      </Container>
    </header>
  );
}
