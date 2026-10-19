import Link from "next/link";

const LINKS = [
  { href: "/ops", label: "Pipeline" },
  { href: "/ops/commissions", label: "Comissões" },
  { href: "/ops/edits", label: "Edições" },
];

export function OpsNav() {
  return (
    <nav className="fixed left-0 top-0 h-full w-56 bg-brand-dark-2 border-r border-white/5 p-4 space-y-1">
      <div className="mb-6 px-2">
        <span className="font-display font-bold text-white text-lg">
          Vitrine<span className="text-brand-gold">72</span>{" "}
          <span className="text-gray-500 text-sm font-normal">ops</span>
        </span>
      </div>
      {LINKS.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          className="block px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-brand-dark-3 transition text-sm"
        >
          {l.label}
        </Link>
      ))}
    </nav>
  );
}
