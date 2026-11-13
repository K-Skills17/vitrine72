import { btnPrimary, container } from "./ui";
import { checkout, nav } from "./content";

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`font-grotesk text-[1.35rem] font-bold tracking-[-0.03em] ${className}`}>
      Vitrini<span className="font-mono font-medium text-v-signal">72</span>
    </span>
  );
}

export function HomeNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-v-line bg-v-paper/90 backdrop-blur-md">
      <div className={`${container} flex h-16 items-center justify-between gap-6`}>
        <a href="#topo" aria-label="Vitrini72, início">
          <Wordmark />
        </a>
        <nav aria-label="Seções" className="hidden md:block">
          <ul className="flex gap-8">
            {nav.map((n) => (
              <li key={n.href}>
                <a href={n.href} className="font-grotesk text-[0.95rem] text-v-muted transition-colors hover:text-v-ink">
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <a href={checkout.core} className={`${btnPrimary} min-h-10 px-5 text-[0.9rem]`}>
          Quero meu site
        </a>
      </div>
    </header>
  );
}
