import Link from "next/link";
import { config, primaryCta } from "@/lib/config";
import { ButtonLink } from "../ui/Button";
import { Container } from "../ui/Layout";
import { MobileNav } from "./MobileNav";
import { navItems } from "./nav";
import { Wordmark } from "./Wordmark";

export default function Header() {
  const cta = primaryCta(config);
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg">
      <Container className="flex h-[4.5rem] items-center justify-between gap-6">
        <Wordmark />
        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-9">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="inline-flex min-h-11 items-center text-small text-ink hover:text-primary">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-5">
          <div className="hidden md:block">
            <ButtonLink href={cta.href} external={cta.external}>
              {cta.label}
            </ButtonLink>
          </div>
          <div className="lg:hidden">
            <MobileNav cta={cta} brand={<Wordmark />} />
          </div>
        </div>
      </Container>
    </header>
  );
}
