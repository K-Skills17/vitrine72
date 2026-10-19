"use client";

import { useState } from "react";
import { RULES, CORE_OFFER, MAINTENANCE } from "@vitrine72/core";

interface Props {
  onSubmit: () => Promise<void>;
  onBack: () => void;
  submitting: boolean;
}

export function IntakeStepContract({ onSubmit, onBack, submitting }: Props) {
  const [accepted, setAccepted] = useState(false);
  const [lgpdAccepted, setLgpdAccepted] = useState(false);

  const canSubmit = accepted && lgpdAccepted && !submitting;

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-display font-semibold text-white">
        Contrato e envio
      </h2>

      <div className="bg-brand-dark-2 border border-white/10 rounded-xl p-5 text-sm text-gray-300 space-y-3 max-h-64 overflow-y-auto">
        <p className="font-semibold text-white">Resumo das condições:</p>
        <ul className="space-y-2 list-disc list-inside">
          <li>
            Prévia em até {CORE_OFFER.previewBusinessDays} dias úteis após o
            recebimento do briefing completo.
          </li>
          <li>
            {RULES.maxRevisionRounds} rodada de revisão incluída (
            {RULES.revisionWindowHours}h para solicitar após a prévia).
          </li>
          <li>
            Site publicado a partir do dia {RULES.goLiveMinDays} após o
            pagamento.
          </li>
          <li>
            Domínio registrado no CPF/CNPJ do contratante.
          </li>
          <li>
            Manutenção: R$ {MAINTENANCE.pricePerCycle.toLocaleString("pt-BR")}/
            {MAINTENANCE.cycleWeeks * 7} dias com até{" "}
            {MAINTENANCE.editsPerCycle} edições incluídas.
          </li>
        </ul>
        <p className="text-gray-500 text-xs pt-2">
          NEEDS #13: Texto completo do contrato pendente de revisão jurídica.
        </p>
      </div>

      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={accepted}
          onChange={(e) => setAccepted(e.target.checked)}
          className="accent-brand-gold mt-1 flex-shrink-0"
        />
        <span className="text-gray-300 text-sm">
          Li e aceito as condições do serviço acima e os{" "}
          <a
            href="/termos"
            target="_blank"
            className="text-brand-gold underline"
          >
            Termos de Serviço
          </a>
          .
        </span>
      </label>

      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={lgpdAccepted}
          onChange={(e) => setLgpdAccepted(e.target.checked)}
          className="accent-brand-gold mt-1 flex-shrink-0"
        />
        <span className="text-gray-300 text-sm">
          Autorizo o uso dos meus dados conforme a{" "}
          <a
            href="/privacidade"
            target="_blank"
            className="text-brand-gold underline"
          >
            Política de Privacidade
          </a>{" "}
          (LGPD).
        </span>
      </label>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 border border-white/20 text-gray-400 py-3 rounded-xl hover:bg-brand-dark-2 transition"
          disabled={submitting}
        >
          Voltar
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={!canSubmit}
          className="flex-1 bg-brand-gold text-brand-dark font-bold py-3 rounded-xl hover:brightness-110 transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {submitting ? "Enviando…" : "Enviar briefing"}
        </button>
      </div>
    </div>
  );
}
