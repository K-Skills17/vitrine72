import type { Metadata } from "next";
import Image from "next/image";
import { SiteNav } from "@/components/marketing/SiteNav";
import { SiteFooter } from "@/components/marketing/SiteFooter";
import Link from "next/link";
import { ArrowRight, Globe, Bot, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "Sobre | Vitrine72",
  description:
    "Especialista em marketing digital que ajuda negócios locais a solidificar sua presença online e atrair clientes qualificados com sites, chatbots e Google Meu Negócio.",
};

const SOLUTIONS = [
  {
    icon: Globe,
    title: "Sites profissionais",
    description:
      "Sites institucionais criados em até 72 horas, prontos para converter visitantes em clientes.",
  },
  {
    icon: Bot,
    title: "Chatbots que qualificam e agendam",
    description:
      "Agentes de IA que atendem, qualificam e agendam clientes automaticamente — 24 horas por dia, 7 dias por semana.",
  },
  {
    icon: MapPin,
    title: "Google Meu Negócio",
    description:
      "Auditoria e otimização do perfil do Google para que o seu negócio apareça nas buscas certas, na hora certa.",
  },
];

export default function SobrePage() {
  return (
    <>
      <SiteNav />
      <main className="min-h-screen bg-brand-dark text-white">

        {/* Hero — photo + headline */}
        <section className="pt-32 pb-20 px-6">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
            {/* Photo */}
            <div className="relative">
              <div
                className="absolute inset-0 rounded-2xl"
                style={{
                  background:
                    "radial-gradient(ellipse at 60% 40%, rgb(var(--gold-rgb) / 0.15) 0%, transparent 70%)",
                }}
                aria-hidden
              />
              <Image
                src="/images/stephen.jpg"
                alt="Stephen Domingos Komando — Especialista em Marketing Digital"
                width={520}
                height={620}
                className="relative rounded-2xl w-full object-cover object-top shadow-2xl"
                priority
              />
            </div>

            {/* Text */}
            <div className="space-y-6">
              <span className="section-label">Quem está por trás da Vitrine72</span>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-ink-primary leading-tight">
                Especialista em presença{" "}
                <span className="text-gradient-gold">digital local</span>
              </h1>
              <p className="text-ink-muted text-lg leading-relaxed">
                Sou especialista em marketing digital focado em negócios locais. Meu
                trabalho é ajudar você a solidificar sua presença online e atrair os
                clientes certos — sem depender só de indicação.
              </p>
              <p className="text-ink-muted leading-relaxed">
                A Vitrine72 nasceu da necessidade real que vi em centenas de negócios:
                ter um site de qualidade, aparecer no Google e nunca perder um cliente
                por falta de atendimento. Resolvo esses três problemas com soluções
                práticas e rápidas.
              </p>
              <Link href="/#preco" className="btn-gold inline-flex items-center gap-2 mt-2">
                Ver planos
                <ArrowRight className="w-4 h-4" aria-hidden />
              </Link>
            </div>
          </div>
        </section>

        {/* Solutions */}
        <section className="py-20 px-6 bg-surface-raised border-y border-subtle">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <span className="section-label">O que eu faço</span>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-ink-primary mt-1">
                Soluções digitais para negócios locais
              </h2>
              <span className="divider-gold mt-5" />
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {SOLUTIONS.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="bg-surface-base rounded-2xl p-7 border border-subtle flex flex-col gap-4"
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center"
                    style={{ background: "rgb(var(--gold-rgb) / 0.12)" }}
                  >
                    <Icon className="w-5 h-5 text-brand-gold" aria-hidden />
                  </div>
                  <h3 className="text-ink-primary font-semibold text-lg">{title}</h3>
                  <p className="text-ink-muted text-sm leading-relaxed">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why section */}
        <section className="py-20 px-6">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <span className="section-label">Por que a Vitrine72</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-ink-primary">
              Seu negócio merece mais do que um site bonito
            </h2>
            <p className="text-ink-muted leading-relaxed text-lg">
              Um site sem estratégia é só um cartão de visitas que ninguém vê. Aqui,
              cada projeto é pensado para que o cliente certo encontre você, entre em
              contato e apareça na sua porta — com ou sem você online.
            </p>
            <p className="text-ink-muted leading-relaxed">
              Os chatbots que configuro trabalham enquanto você dorme: respondem dúvidas,
              qualificam o interesse e já marcam o horário. O Google Meu Negócio otimizado
              garante que você apareça quando alguém da sua cidade pesquisa o que você oferece.
            </p>
            <div className="pt-4">
              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP ?? "5511946827777"}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold inline-flex items-center gap-2"
              >
                Falar pelo WhatsApp
                <ArrowRight className="w-4 h-4" aria-hidden />
              </a>
            </div>
          </div>
        </section>

      </main>
      <SiteFooter />
    </>
  );
}
