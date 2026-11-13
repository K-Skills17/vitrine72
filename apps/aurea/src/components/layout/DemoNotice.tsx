import { siteConfig } from "@/config/site";

/** Always-visible statement that the clinic is fictional. Scrolls away with the page. */
export function DemoNotice() {
  if (!siteConfig.isDemo) return null;
  return (
    <div className="bg-sand px-gutter py-2 text-center text-legal text-umber">
      Site de demonstração. A {siteConfig.name} é uma clínica fictícia criada pela Vitrini72.
    </div>
  );
}
