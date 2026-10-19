export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { PartyPopper } from "lucide-react";
import { createServiceClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Pedido confirmado | Vitrine72",
  robots: { index: false },
};

interface Props {
  searchParams: Promise<{ src?: string; ref?: string }>;
}

export default async function ObrigadoPage({ searchParams }: Props) {
  const { src, ref: orderId } = await searchParams;

  // Look up the intake link for this order
  let intakeUrl: string | null = null;
  if (orderId) {
    const supabase = createServiceClient();
    const { data } = await supabase
      .from("projects")
      .select("intake_token")
      .eq("payment_provider_ref", orderId)
      .maybeSingle();
    if (data?.intake_token) {
      intakeUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/intake/${data.intake_token}`;
    }
  }

  return (
    <main className="min-h-screen bg-brand-dark flex items-center justify-center px-4">
      <div className="max-w-lg w-full text-center space-y-6">
        <div className="flex justify-center" aria-hidden>
          <PartyPopper className="w-14 h-14 text-brand-gold" />
        </div>
        <h1 className="text-3xl font-display font-bold text-white">
          Pagamento confirmado!
        </h1>
        <p className="text-gray-300">
          Agora é só preencher o formulário de briefing para começarmos a criar
          o seu site.
        </p>

        {intakeUrl ? (
          <a
            href={intakeUrl}
            className="inline-block bg-brand-gold text-brand-dark font-bold px-8 py-4 rounded-lg text-lg hover:brightness-110 transition"
          >
            Preencher formulário agora
          </a>
        ) : (
          <p className="text-brand-gold animate-pulse">
            Aguarde… carregando seu link de briefing.
          </p>
        )}

        <p className="text-sm text-gray-500">
          O link também foi enviado para o seu e-mail.
          {src === "kiwify" && " Pedido via Kiwify."}
          {src === "asaas" && " Pedido via Asaas."}
        </p>
      </div>
    </main>
  );
}
