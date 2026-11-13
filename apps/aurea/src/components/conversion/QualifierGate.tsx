"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { buttonStyles } from "@/components/ui/Button";
import { getTreatmentSummary } from "@/content/treatments";
import {
  lowFitAnswers,
  qualifierCopy,
  qualifierSteps,
  type QualifierAnswers,
} from "@/content/qualifier";
import { track } from "@/lib/analytics";
import { cx } from "@/lib/utils";
import { buildQualifiedMessage, buildWhatsAppUrl, configuredWhatsAppNumber } from "@/lib/whatsapp";

interface GateState {
  ctaLocation?: string;
  treatmentSlug?: string;
}

/**
 * Qualification gate in front of every WhatsApp CTA. One delegated click
 * listener intercepts links marked data-destination="whatsapp" and opens a
 * four-step dialog; the answers become the WhatsApp message. If this script
 * does not load, the links still open WhatsApp directly.
 *
 * A treatment CTA (data-treatment) preselects that treatment and skips the
 * "what would you like" step.
 */
export function QualifierGate() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [gate, setGate] = useState<GateState | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<QualifierAnswers>({});

  const steps = gate?.treatmentSlug ? qualifierSteps.filter((s) => s.id !== "service") : qualifierSteps;
  const step = steps[stepIndex];

  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }
      const link = (event.target as Element | null)?.closest<HTMLAnchorElement>('a[data-destination="whatsapp"]');
      if (!link || link.dataset.qualify === "false") return;
      event.preventDefault();

      const slug = link.dataset.treatment;
      const treatment = slug ? getTreatmentSummary(slug) : undefined;
      setGate({ ctaLocation: link.dataset.ctaLocation, treatmentSlug: treatment?.slug });
      setAnswers(treatment ? { service: treatment.name } : {});
      setStepIndex(0);
      track("qualifier_open", { cta_location: link.dataset.ctaLocation, treatment_slug: treatment?.slug });
    }
    // Bubble phase, after AnalyticsListener (capture) has recorded the click.
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (gate && !dialog.open) dialog.showModal();
    if (!gate && dialog.open) dialog.close();
  }, [gate]);

  const close = useCallback(() => setGate(null), []);

  function openWhatsApp(url: string) {
    window.open(url, "_blank", "noopener,noreferrer");
    close();
  }

  function finish(final: QualifierAnswers) {
    const lowFit = lowFitAnswers.some((a) => final.timing === a || final.budget === a);
    const params = { cta_location: gate?.ctaLocation, treatment_slug: gate?.treatmentSlug };
    track("qualifier_complete", params);
    if (lowFit) track("lead_low_fit", params);
    track("whatsapp_redirect", { ...params, destination: "whatsapp" });
    openWhatsApp(buildWhatsAppUrl(buildQualifiedMessage(final), configuredWhatsAppNumber));
  }

  function answer(value: string) {
    if (!step) return;
    const next = { ...answers, [step.id]: value };
    setAnswers(next);
    track("qualifier_step", { qualifier_step: String(stepIndex + 1), treatment_slug: gate?.treatmentSlug });
    if (stepIndex + 1 < steps.length) setStepIndex(stepIndex + 1);
    else finish(next);
  }

  return (
    <dialog
      ref={dialogRef}
      onClose={close}
      onClick={(e) => e.target === dialogRef.current && close()}
      aria-labelledby="qualifier-title"
      className="m-auto w-[min(32rem,calc(100vw-2.5rem))] bg-porcelain p-0 text-espresso backdrop:bg-espresso/60"
    >
      {gate && step && (
        <div className="flex flex-col gap-6 p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-2">
              <p className="text-eyebrow font-semibold uppercase text-sage-deep">
                Etapa {stepIndex + 1} de {steps.length}
              </p>
              <h2 id="qualifier-title" className="font-display text-h3 font-normal text-balance">
                {step.label}
              </h2>
            </div>
            <button
              type="button"
              onClick={close}
              aria-label={qualifierCopy.close}
              className="-mr-2 -mt-2 grid size-11 shrink-0 place-items-center text-umber hover:text-espresso"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="h-px bg-line" role="progressbar" aria-valuemin={0} aria-valuemax={steps.length} aria-valuenow={stepIndex}>
            <div className="h-px bg-espresso transition-[width]" style={{ width: `${(stepIndex / steps.length) * 100}%` }} />
          </div>

          {stepIndex === 0 && <p className="-mt-2 text-small text-umber">{qualifierCopy.intro}</p>}

          {step.type === "text" ? (
            <form
              key={step.id}
              onSubmit={(e) => {
                e.preventDefault();
                const value = (new FormData(e.currentTarget).get("answer") as string | null)?.trim();
                if (value) answer(value);
              }}
              className="flex flex-col gap-4"
            >
              <label htmlFor="qualifier-text" className="sr-only">
                {step.label}
              </label>
              <input
                id="qualifier-text"
                name="answer"
                type="text"
                autoComplete="given-name"
                required
                maxLength={50}
                autoFocus
                defaultValue={answers[step.id] ?? ""}
                placeholder={step.placeholder}
                className="min-h-12 rounded-xs border border-line bg-ivory px-4 text-body text-espresso placeholder:text-umber/70 focus:border-espresso focus:outline-none"
              />
              <button type="submit" className={buttonStyles({ fullWidth: true })}>
                {qualifierCopy.next}
              </button>
            </form>
          ) : (
            <ul className="flex flex-col border-t border-line">
              {step.options.map((option) => (
                <li key={option} className="border-b border-line">
                  <button
                    type="button"
                    onClick={() => answer(option)}
                    className={cx(
                      "flex min-h-12 w-full items-center justify-between gap-4 px-1 py-3 text-left text-body transition-colors hover:bg-ivory",
                      answers[step.id] === option && "font-semibold",
                    )}
                  >
                    {option}
                    <span aria-hidden className="text-umber">
                      →
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}

          {stepIndex > 0 && (
            <button
              type="button"
              onClick={() => setStepIndex(stepIndex - 1)}
              className="min-h-11 self-start text-caption text-umber underline underline-offset-2"
            >
              ← {qualifierCopy.back}
            </button>
          )}
        </div>
      )}
    </dialog>
  );
}
