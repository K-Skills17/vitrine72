"use client";

import { useState, useEffect, useRef } from "react";
import type { NicheConfig } from "../lib/niche";
import {
  trackEvent,
  buildWhatsAppUrl,
  buildQualifierMessage,
} from "../lib/analytics";

interface Props {
  config: NicheConfig;
  preselect?: string;
  onClose: () => void;
}

export default function Qualifier({ config, preselect, onClose }: Props) {
  const { qualifier, whatsappNumber, features } = config;
  const steps = qualifier.steps;
  const totalSteps = steps.length;

  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [softMode, setSoftMode] = useState(false);
  const [softMessage, setSoftMessage] = useState("");
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (preselect) {
      setAnswers((prev) => ({ ...prev, service: preselect }));
    }
    trackEvent("qualifier_open");
  }, [preselect]);

  useEffect(() => {
    if (currentStep === 0 && nameRef.current) {
      nameRef.current.focus();
    }
  }, [currentStep]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const step = steps[currentStep];
  const progress = Math.round((currentStep / totalSteps) * 100);

  function handleTextNext(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const val = (
      e.currentTarget.elements.namedItem("answer") as HTMLInputElement
    ).value.trim();
    if (!val) return;
    advance(step.id, val);
  }

  function handleChoice(option: string) {
    advance(step.id, option);
  }

  function advance(id: string, value: string) {
    const newAnswers = { ...answers, [id]: value };
    setAnswers(newAnswers);
    trackEvent(`qualifier_step_${currentStep + 1}`, { step: id, value });

    if (currentStep + 1 < totalSteps) {
      const nextIdx = currentStep + 1;
      const nextStep = steps[nextIdx];
      // Skip service step if it was preselected
      if (nextStep.id === "service" && preselect) {
        const withService = { ...newAnswers, service: preselect };
        setAnswers(withService);
        setCurrentStep(nextIdx + 1);
      } else {
        setCurrentStep(nextIdx);
      }
    } else {
      finish(newAnswers);
    }
  }

  function goBack() {
    if (currentStep > 0) setCurrentStep((s) => s - 1);
  }

  function finish(finalAnswers: Record<string, string>) {
    trackEvent("qualifier_complete");

    const isLowFit = qualifier.lowFitAnswers.some(
      (a) => finalAnswers["timing"] === a || finalAnswers["budget"] === a
    );

    if (isLowFit) trackEvent("lead_low_fit");

    const message = buildQualifierMessage(
      qualifier.messageTemplate,
      finalAnswers
    );

    if (isLowFit && features.lowFitMode === "soft") {
      setSoftMode(true);
      setSoftMessage(message);
      return;
    }

    trackEvent("whatsapp_redirect");
    const url = buildWhatsAppUrl(whatsappNumber, message);
    window.open(url, "_blank", "noopener,noreferrer");
    onClose();
  }

  if (softMode) {
    return (
      <div
        className="qualifier-overlay"
        role="dialog"
        aria-modal="true"
        onClick={onClose}
      >
        <div className="qualifier-sheet" onClick={(e) => e.stopPropagation()}>
          <p
            className="mb-2 text-2xl font-bold"
            style={{
              fontFamily: `"${config.fontDisplay}", serif`,
              color: "var(--color-primary)",
            }}
          >
            Quase lá!
          </p>
          <p
            className="mb-6 text-sm"
            style={{ color: "var(--color-muted)" }}
          >
            Vamos te enviar nosso material primeiro para que você possa se
            preparar melhor para a conversa.
          </p>
          <a
            href={buildWhatsAppUrl(whatsappNumber, softMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full rounded-xl py-3 text-center text-sm font-semibold text-white"
            style={{ backgroundColor: "#25d366" }}
            onClick={() => trackEvent("whatsapp_redirect")}
            data-testid="soft-whatsapp-link"
          >
            Falar no WhatsApp mesmo assim
          </a>
          <button
            onClick={onClose}
            className="mt-4 w-full text-xs underline"
            style={{ color: "var(--color-muted)" }}
          >
            Fechar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="qualifier-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Qualificação WhatsApp"
      data-testid="qualifier-overlay"
      onClick={onClose}
    >
      <div
        className="qualifier-sheet"
        onClick={(e) => e.stopPropagation()}
        data-testid="qualifier-sheet"
      >
        {/* Header */}
        <div
          style={{
            marginBottom: "1rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span style={{ fontSize: "0.75rem", color: "var(--color-muted)" }}>
            Passo {currentStep + 1} de {totalSteps}
          </span>
          <button
            onClick={onClose}
            aria-label="Fechar"
            style={{
              border: "none",
              background: "none",
              cursor: "pointer",
              color: "var(--color-muted)",
              padding: "4px",
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Progress bar */}
        <div
          style={{
            marginBottom: "1.25rem",
            height: "4px",
            borderRadius: "9999px",
            background: "#e5e7eb",
          }}
        >
          <div
            className="progress-bar"
            style={{ width: `${progress}%` }}
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>

        {/* Question */}
        <p
          style={{
            marginBottom: "1.25rem",
            fontSize: "1.1rem",
            fontWeight: 600,
            fontFamily: `"${config.fontDisplay}", serif`,
            color: "var(--color-text)",
          }}
          data-testid="qualifier-question"
        >
          {step.label}
        </p>

        {/* Text step */}
        {step.type === "text" && (
          <form onSubmit={handleTextNext}>
            <input
              ref={nameRef}
              name="answer"
              type="text"
              placeholder={step.placeholder}
              defaultValue={answers[step.id] ?? ""}
              maxLength={50}
              required
              style={{
                display: "block",
                width: "100%",
                borderRadius: "0.75rem",
                border: "2px solid #e5e7eb",
                padding: "0.75rem 1rem",
                fontSize: "0.875rem",
                marginBottom: "1rem",
                outline: "none",
                boxSizing: "border-box",
              }}
              onFocus={(e) =>
                (e.currentTarget.style.borderColor = "var(--color-primary)")
              }
              onBlur={(e) =>
                (e.currentTarget.style.borderColor = "#e5e7eb")
              }
              data-testid="qualifier-text-input"
            />
            <button
              type="submit"
              style={{
                width: "100%",
                borderRadius: "0.75rem",
                padding: "0.75rem",
                fontSize: "0.875rem",
                fontWeight: 600,
                color: "#fff",
                background: "var(--color-primary)",
                border: "none",
                cursor: "pointer",
              }}
              data-testid="qualifier-next-btn"
            >
              Continuar →
            </button>
          </form>
        )}

        {/* Choice step */}
        {step.type === "choice" && (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
            data-testid="qualifier-choices"
          >
            {step.options.map((opt) => (
              <button
                key={opt}
                className="choice-btn"
                data-selected={answers[step.id] === opt ? "true" : "false"}
                onClick={() => handleChoice(opt)}
                data-testid={`choice-${opt
                  .toLowerCase()
                  .replace(/[^a-z0-9]/g, "-")}`}
              >
                {opt}
              </button>
            ))}
          </div>
        )}

        {/* Back button */}
        {currentStep > 0 && (
          <button
            onClick={goBack}
            style={{
              marginTop: "1rem",
              border: "none",
              background: "none",
              cursor: "pointer",
              fontSize: "0.75rem",
              color: "var(--color-muted)",
            }}
            data-testid="qualifier-back-btn"
          >
            ← Voltar
          </button>
        )}
      </div>
    </div>
  );
}
