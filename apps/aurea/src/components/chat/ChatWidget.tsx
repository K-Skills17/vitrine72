"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { chatbotConfig } from "@/config/chatbot";
import { MAX_IMAGE_BYTES, prepareChatImage, type PreparedImage } from "@/lib/chat-image";
import { buildWhatsAppUrl, configuredWhatsAppNumber } from "@/lib/whatsapp";

interface Message {
  role: "user" | "assistant";
  content: string;
  /** Local preview of an image the visitor sent (not reloaded from history). */
  imageUrl?: string;
}

const { apiBase, tenantId, title, showAfterMs, autoOpenAfterMs } = chatbotConfig;
const SESSION_KEY = tenantId ? `lk_chat_session_${tenantId}` : null;
const AUTO_OPENED_KEY = "lk_chat_auto_opened";

function safeGet(store: () => Storage, key: string): string | null {
  try {
    return store().getItem(key);
  } catch {
    return null;
  }
}
function safeSet(store: () => Storage, key: string, value: string) {
  try {
    store().setItem(key, value);
  } catch {
    /* storage unavailable: chat still works, session just isn't remembered */
  }
}

/** Splits text on URLs so links are clickable without injecting HTML. */
function Linkified({ text }: { text: string }) {
  const parts = text.split(/(https?:\/\/[^\s]+)/g);
  return (
    <>
      {parts.map((part, i) =>
        /^https?:\/\//.test(part) ? (
          <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
            {part}
          </a>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}

/**
 * Floating chat assistant backed by lk-chatbot. Visitors can send text and
 * photos (analysed by the chatbot service). Without a tenant configured it
 * falls back to sending the typed text to WhatsApp; images are then disabled.
 */
export function ChatWidget() {
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [image, setImage] = useState<PreparedImage | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  // Lazy init: storage access throws on the server and is caught as null.
  // The widget renders nothing until after mount, so there is no hydration mismatch.
  const [sessionId, setSessionId] = useState<string | null>(() => (SESSION_KEY ? safeGet(() => localStorage, SESSION_KEY) : null));
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const imagesEnabled = Boolean(tenantId);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), showAfterMs);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!visible || safeGet(() => sessionStorage, AUTO_OPENED_KEY)) return;
    const t = setTimeout(() => {
      safeSet(() => sessionStorage, AUTO_OPENED_KEY, "1");
      setOpen(true);
    }, autoOpenAfterMs);
    return () => clearTimeout(t);
  }, [visible]);

  useEffect(() => {
    if (!open || !sessionId || !tenantId || messages.length > 0) return;
    fetch(`${apiBase}/${tenantId}/messages/${sessionId}`)
      .then((r) => r.json())
      .then((data: { messages?: Message[] }) => {
        if (data.messages?.length) setMessages(data.messages.map((m) => ({ role: m.role, content: m.content })));
      })
      .catch(() => {});
  }, [open, sessionId, messages.length]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 150);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const createSession = useCallback(async (): Promise<string> => {
    const res = await fetch(`${apiBase}/${tenantId}/session`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    const data = (await res.json()) as { sessionId: string };
    if (SESSION_KEY) safeSet(() => localStorage, SESSION_KEY, data.sessionId);
    setSessionId(data.sessionId);
    return data.sessionId;
  }, []);

  async function onPickFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      setImage(await prepareChatImage(file));
      setNotice(null);
    } catch (err) {
      const reason = (err as Error).message;
      setNotice(
        reason === "too-large"
          ? `Imagem muito grande. Máximo ${MAX_IMAGE_BYTES / 1024 / 1024} MB.`
          : "Não foi possível ler este arquivo. Envie uma foto (JPG ou PNG).",
      );
    }
  }

  async function send() {
    const text = input.trim();
    if ((!text && !image) || loading) return;

    if (!tenantId) {
      if (!text) return;
      window.open(buildWhatsAppUrl(text, configuredWhatsAppNumber), "_blank", "noopener,noreferrer");
      setInput("");
      setOpen(false);
      return;
    }

    const sent = image;
    setInput("");
    setImage(null);
    setMessages((prev) => [...prev, { role: "user", content: text, imageUrl: sent?.dataUrl }]);
    setLoading(true);
    try {
      const sid = sessionId ?? (await createSession());
      const res = await fetch(`${apiBase}/${tenantId}/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: sid,
          text,
          ...(sent ? { imageBase64: sent.base64, imageMimeType: sent.mimeType } : {}),
        }),
      });
      const data = (await res.json()) as { reply?: string };
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply ?? "Desculpe, ocorreu um erro. Tente novamente." },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Não foi possível conectar ao atendimento. Tente novamente." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  if (!visible) return null;

  const canSend = (input.trim().length > 0 || image !== null) && !loading;

  return (
    <div className="fixed bottom-[calc(var(--spacing-sticky-cta)+0.75rem)] right-5 z-40 flex flex-col items-end gap-3 lg:bottom-24">
      {open && (
        <section
          role="dialog"
          aria-label={title}
          className="flex h-[min(34rem,calc(100dvh-8rem))] w-[min(23rem,calc(100vw-2.5rem))] flex-col border border-line bg-porcelain"
        >
          <header className="flex items-center justify-between bg-espresso px-5 py-4 text-ivory">
            <div>
              <p className="font-display text-[1.375rem] leading-tight">{title}</p>
              <p className="text-caption text-ivory/70">Respostas gerais · a indicação é feita em consulta</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Fechar atendimento"
              className="grid size-11 place-items-center text-ivory/80 hover:text-ivory"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </header>

          <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4" aria-live="polite">
            {messages.length === 0 && !loading && (
              <div className="m-auto max-w-[16rem] text-center">
                <p className="font-display text-h3 leading-tight">Como podemos ajudar?</p>
                <p className="mt-2 text-small text-umber">
                  Tire dúvidas sobre tratamentos e avaliação.{imagesEnabled ? " Você também pode enviar uma foto." : ""}
                </p>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={m.role === "user" ? "self-end" : "self-start"}>
                <div
                  className={
                    m.role === "user"
                      ? "max-w-[16.5rem] bg-espresso px-4 py-3 text-small whitespace-pre-wrap break-words text-ivory"
                      : "max-w-[16.5rem] border border-line bg-ivory px-4 py-3 text-small whitespace-pre-wrap break-words text-espresso"
                  }
                >
                  {m.imageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element -- local data URL preview
                    <img src={m.imageUrl} alt="Foto enviada por você" className="mb-2 max-h-48 w-full object-cover" />
                  )}
                  {m.content && <Linkified text={m.content} />}
                </div>
              </div>
            ))}
            {loading && (
              <p className="self-start border border-line bg-ivory px-4 py-3 text-small text-umber">
                {messages.at(-1)?.imageUrl ? "Analisando a imagem…" : "Digitando…"}
              </p>
            )}
            <div ref={endRef} />
          </div>

          <div className="border-t border-line p-3">
            {image && (
              <div className="mb-2 flex items-center gap-3 bg-sand p-2">
                {/* eslint-disable-next-line @next/next/no-img-element -- local data URL preview */}
                <img src={image.dataUrl} alt="Pré-visualização da foto" className="size-12 object-cover" />
                <span className="flex-1 text-caption text-umber">Foto pronta para enviar</span>
                <button type="button" onClick={() => setImage(null)} className="min-h-11 px-3 text-caption underline">
                  Remover
                </button>
              </div>
            )}
            {notice && <p className="mb-2 text-caption text-error">{notice}</p>}
            <div className="flex items-end gap-2">
              {imagesEnabled && (
                <>
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onPickFile} />
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    aria-label="Enviar foto"
                    className="grid size-11 shrink-0 place-items-center border border-line text-umber hover:border-espresso hover:text-espresso"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                      <rect x="3" y="5" width="18" height="14" />
                      <circle cx="9" cy="10" r="1.75" />
                      <path d="m21 16-5-5-8 8" />
                    </svg>
                  </button>
                </>
              )}
              <label className="sr-only" htmlFor="chat-input">
                Sua mensagem
              </label>
              <textarea
                id="chat-input"
                ref={inputRef}
                value={input}
                rows={1}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    void send();
                  }
                }}
                placeholder="Escreva sua mensagem…"
                className="max-h-24 min-h-11 flex-1 resize-none rounded-xs border border-line bg-ivory px-3 py-2.5 text-small text-espresso placeholder:text-umber/70 focus:border-espresso focus:outline-none"
              />
              <button
                type="button"
                onClick={() => void send()}
                disabled={!canSend}
                aria-label="Enviar mensagem"
                className="grid size-11 shrink-0 place-items-center bg-espresso text-ivory disabled:bg-line disabled:text-umber"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </button>
            </div>
            <p className="mt-2 text-legal text-umber">
              {imagesEnabled ? "Fotos e mensagens são processadas por um serviço externo. " : ""}
              Não envie dados de saúde sensíveis.{" "}
              <Link href="/privacidade" className="underline underline-offset-2">
                Privacidade
              </Link>
            </p>
          </div>
        </section>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? "Fechar atendimento" : "Abrir atendimento"}
        className="grid size-14 place-items-center bg-espresso text-ivory transition-colors hover:bg-umber"
      >
        {open ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
            <path d="M4 5h16v11H9l-5 4V5Z" />
          </svg>
        )}
      </button>
    </div>
  );
}
