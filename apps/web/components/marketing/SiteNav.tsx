export function SiteNav() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-brand-dark/90 backdrop-blur border-b border-white/5">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <span className="font-display font-bold text-white text-lg tracking-tight">
          Vitrine<span className="text-brand-gold">72</span>
        </span>
        <a
          href="#preco"
          className="text-sm font-semibold bg-brand-gold text-brand-dark px-4 py-2 rounded-lg hover:brightness-110 transition"
        >
          Ver preços
        </a>
      </div>
    </header>
  );
}
