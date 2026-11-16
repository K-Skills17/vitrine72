"use client";

import { useId, useState } from "react";
import { CLINIC_OFFER, clinicGuarantee } from "@vitrine72/core";
import { gap } from "./content";

const toNumber = (v: string) => {
  const n = Number(v.replace(/\D/g, ""));
  return Number.isFinite(n) ? n : 0;
};
const fmt = (n: number) => n.toLocaleString("pt-BR");

/**
 * The owner types the two numbers the call is built on. Nothing is sent
 * anywhere; it only shows the gap and which guarantee row would apply.
 */
export function GapCalculator() {
  const id = useId();
  const [views, setViews] = useState("");
  const [requests, setRequests] = useState("");
  const v = toNumber(views);
  const r = toNumber(requests);
  const ready = v > 0 && requests !== "";
  const per100 = ready ? Math.min(100, (r / v) * 100) : 0;
  const lost = ready ? Math.max(0, v - r) : 0;
  const target = ready ? clinicGuarantee(v) : null;

  const input =
    "mt-3 w-full border-b-2 border-v-paper/40 bg-transparent pb-2 font-grotesk text-[2.4rem] font-semibold tracking-[-0.02em] text-v-paper placeholder:text-v-paper/30 focus:border-v-paper focus:outline-none sm:text-[3rem]";

  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
      <div className="flex flex-col gap-8">
        <label htmlFor={`${id}-v`} className="block font-mono text-[0.78rem] uppercase leading-relaxed tracking-[0.08em] text-v-paper/80">
          {gap.calculator.viewsLabel}
          <input
            id={`${id}-v`}
            inputMode="numeric"
            autoComplete="off"
            placeholder="0"
            value={views ? fmt(v) : ""}
            onChange={(e) => setViews(e.target.value)}
            className={input}
          />
        </label>
        <label htmlFor={`${id}-r`} className="block font-mono text-[0.78rem] uppercase leading-relaxed tracking-[0.08em] text-v-paper/80">
          {gap.calculator.requestsLabel}
          <input
            id={`${id}-r`}
            inputMode="numeric"
            autoComplete="off"
            placeholder="0"
            value={requests ? fmt(r) : ""}
            onChange={(e) => setRequests(e.target.value)}
            className={input}
          />
        </label>
        <p className="font-grotesk text-[0.9rem] text-v-paper/70">{gap.calculator.privacy}</p>
      </div>

      <div aria-live="polite" className="border-t border-v-paper/25 pt-8 lg:border-l lg:border-t-0 lg:pl-14 lg:pt-0">
        {ready ? (
          <dl className="flex flex-col gap-8">
            <div>
              <dt className="font-mono text-[0.78rem] uppercase tracking-[0.08em] text-v-paper/70">De cada 100 visitas</dt>
              <dd className="mt-2 font-grotesk text-[3.4rem] font-semibold leading-none tracking-[-0.03em] text-v-paper">
                {per100 < 1 && per100 > 0 ? per100.toFixed(1).replace(".", ",") : Math.round(per100)}{" "}
                <span className="text-[1.2rem] font-normal text-v-paper/80">viram pedido de avaliação</span>
              </dd>
            </div>
            <div>
              <dt className="font-mono text-[0.78rem] uppercase tracking-[0.08em] text-v-paper/70">Viram a clínica e não pediram</dt>
              <dd className="mt-2 font-grotesk text-[2.2rem] font-semibold leading-none text-v-paper">{fmt(lost)}</dd>
            </div>
            <div className="border-t border-v-paper/25 pt-6">
              <dt className="font-mono text-[0.78rem] uppercase tracking-[0.08em] text-v-paper/70">Meta da garantia para esse volume</dt>
              <dd className="mt-2 font-grotesk text-[1.25rem] leading-snug text-v-paper">
                {target
                  ? `${target} pedidos de avaliação contados em ${CLINIC_OFFER.guaranteeDays} dias.`
                  : `Abaixo de ${fmt(CLINIC_OFFER.guaranteeMinViews)} visitas não oferecemos garantia: há pouca atenção para converter.`}
              </dd>
            </div>
          </dl>
        ) : (
          <p className="font-grotesk text-[1.25rem] leading-relaxed text-v-paper/80">
            Preencha os dois números para ver quantas pessoas viram a clínica e não pediram avaliação, e qual seria a meta da garantia.
          </p>
        )}
      </div>
    </div>
  );
}
