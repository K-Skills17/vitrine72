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
            Prévia em até <strong className="text-white">{CORE_OFFER.previewBusinessDays} dias úteis</strong>{" "}
            após o recebimento do briefing completo.
          </li>
          <li>
            <strong className="text-white">{RULES.maxRevisionRounds} rodada de revisão</strong> incluída —
            você tem {RULES.revisionWindowHours}h para solicitar alterações após receber a prévia.
          </li>
          <li>
            Site publicado a partir do <strong className="text-white">dia {RULES.goLiveMinDays}</strong> após
            o pagamento (prazo de reflexão do CDC), mediante aprovação.
          </li>
          <li>
            Domínio registrado no <strong className="text-white">CPF/CNPJ do contratante</strong> — você é
            o titular.
          </li>
          <li>
            Manutenção: <strong className="text-white">R$ {MAINTENANCE.pricePerCycle.toLocaleString("pt-BR")}</strong>{" "}
            a cada {MAINTENANCE.cycleWeeks * 7} dias, com até {MAINTENANCE.editsPerCycle} edições por ciclo.
          </li>
          <li>
            Cancelamento em até 7 dias corridos após o pagamento: reembolso integral (art. 49 CDC).
            Após o início da produção: reembolso parcial conforme Termos de Serviço.
          </li>
          <li>
            O contratante é responsável pela veracidade das informações e das imagens fornecidas.
          </li>
        </ul>
        <p className="text-gray-500 text-xs pt-2">
          Leia o{" "}
          <a href="/termos" target="_blank" className="text-brand-gold underline">
            contrato completo
          </a>{" "}
          antes de aceitar.
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
