"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { MAX_IMAGE_BYTES, prepareChatImage, type PreparedImage } from "../lib/chat-image";

interface Props {
  tenantId?: string;
  primaryColor?: string;
  headerTitle?: string;
  whatsappNumber?: string;
}

interface Message {
  content: string;
  role: "user" | "assistant";
  /** Local preview of a photo the visitor sent (not reloaded from history). */
  imageUrl?: string;
}

const API_BASE = "https://lk-chatbot-production.up.railway.app/api/webchat";

export default function ChatbotEmbed({ tenantId, primaryColor = "#2563eb", headerTitle = "Assistente", whatsappNumber }: Props) {
  const [open, setOpen] = useState(false);
  const [showBubble, setShowBubble] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<PreparedImage | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);

  const storageKey = tenantId ? `lk_chat_session_${tenantId}` : null;

  // Show bubble after 2.5s
  useEffect(() => {
    const t = setTimeout(() => setShowBubble(true), 2500);
    return () => clearTimeout(t);
  }, []);

  // Auto-open once per session after 5s
  useEffect(() => {
    if (!showBubble) return;
    if (sessionStorage.getItem("lk_chat_auto_opened")) return;
    const t = setTimeout(() => {
      sessionStorage.setItem("lk_chat_auto_opened", "1");
      setOpen(true);
    }, 5000);
    return () => clearTimeout(t);
  }, [showBubble]);

  // Restore session from localStorage
  useEffect(() => {
    if (!storageKey) return;
    const stored = localStorage.getItem(storageKey);
    if (stored) setSessionId(stored);
  }, [storageKey]);

  // Load history when chat opens with existing session
  useEffect(() => {
    if (!open || !sessionId || !tenantId || messages.length > 0) return;
    fetch(`${API_BASE}/${tenantId}/messages/${sessionId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.messages?.length > 0) setMessages(data.messages);
      })
      .catch(() => {});
  }, [open, sessionId, tenantId, messages.length]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Focus input when opened
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 200);
  }, [open]);

  const createSession = useCallback(async (): Promise<string> => {
    const res = await fetch(`${API_BASE}/${tenantId}/session`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    const data = await res.json();
    const id = data.sessionId;
    if (storageKey) localStorage.setItem(storageKey, id);
    setSessionId(id);
    return id;
  }, [tenantId, storageKey]);

  const onPickFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      setImage(await prepareChatImage(file));
      setImageError(null);
    } catch (err) {
      setImageError(
        (err as Error).message === "too-large"
          ? `Imagem muito grande. Máximo ${MAX_IMAGE_BYTES / 1024 / 1024} MB.`
          : "Não foi possível ler este arquivo. Envie uma foto (JPG ou PNG)."
      );
    }
  };

  const sendMessage = async () => {
    const text = input.trim();
    const sentImage = image;
    if ((!text && !sentImage) || loading || !tenantId) return;

    setInput("");
    setImage(null);
    setMessages((prev) => [...prev, { content: text, role: "user", imageUrl: sentImage?.dataUrl }]);
    setLoading(true);

    try {
      let sid = sessionId;
      if (!sid) sid = await createSession();

      const res = await fetch(`${API_BASE}/${tenantId}/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: sid,
          text,
          ...(sentImage ? { imageBase64: sentImage.base64, imageMimeType: sentImage.mimeType } : {}),
        }),
      });
      const data = await res.json();

      if (data.reply) {
        setMessages((prev) => [...prev, { content: data.reply, role: "assistant" }]);
      } else {
        setMessages((prev) => [...prev, { content: "Desculpe, ocorreu um erro. Tente novamente.", role: "assistant" }]);
      }
    } catch {
      setMessages((prev) => [...prev, { content: "Não foi possível conectar ao assistente. Tente novamente.", role: "assistant" }]);
    } finally {
      setLoading(false);
    }
  };

  // Fallback: if no tenantId, send to WhatsApp
  const sendToWhatsApp = () => {
    if (!input.trim()) return;
    const num = whatsappNumber ?? "5511953542831";
    window.open(`https://wa.me/${num}?text=${encodeURIComponent(input.trim())}`, "_blank", "noopener");
    setInput("");
    setOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      tenantId ? sendMessage() : sendToWhatsApp();
    }
  };

  const formatText = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.split(urlRegex).map((part, i) =>
      urlRegex.test(part) ? (
        <a key={i} href={part} target="_blank" rel="noopener noreferrer" style={{ color: primaryColor, textDecoration: "underline" }}>{part}</a>
      ) : <span key={i}>{part}</span>
    );
  };

  if (!showBubble) return null;

  return (
    <div style={{ position: "fixed", bottom: "5.25rem", right: "1.25rem", zIndex: 39, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.75rem" }}>

      {/* Chat window */}
      {open && (
        <div style={{
          width: "360px", maxWidth: "calc(100vw - 2rem)",
          height: "480px", maxHeight: "calc(100vh - 10rem)",
          background: "#fff", borderRadius: "1rem",
          boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
          display: "flex", flexDirection: "column", overflow: "hidden",
          fontFamily: "system-ui, sans-serif",
          animation: "slide-up 0.25s ease-out",
        }}>
          {/* Header */}
          <div style={{ padding: "1rem 1.25rem", backgroundColor: primaryColor, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div style={{ width: "2.25rem", height: "2.25rem", borderRadius: "9999px", backgroundColor: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <div>
                <p style={{ margin: 0, fontSize: "0.875rem", fontWeight: 600, color: "#fff" }}>{headerTitle}</p>
                <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", marginTop: "2px" }}>
                  <span style={{ width: "6px", height: "6px", borderRadius: "9999px", backgroundColor: "#4ade80", display: "inline-block" }} />
                  <span style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.7)" }}>Online agora</span>
                </div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Fechar" style={{ background: "none", border: "none", cursor: "pointer", padding: "0.25rem", borderRadius: "9999px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="2.5" strokeLinecap="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: "1rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {messages.length === 0 && !loading && (
              <div style={{ textAlign: "center", padding: "2rem 1rem" }}>
                <p style={{ fontSize: "0.875rem", fontWeight: 500, color: "#1e293b", margin: "0 0 0.25rem" }}>Olá! Como posso ajudar?</p>
                <p style={{ fontSize: "0.75rem", color: "#94a3b8", margin: 0 }}>
                  Digite sua dúvida abaixo.{tenantId ? " Você também pode enviar uma foto." : ""}
                </p>
              </div>
            )}
            {messages.map((msg, i) => (
              <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
                <div style={{
                  maxWidth: "80%", padding: "0.625rem 0.875rem", borderRadius: "0.875rem",
                  fontSize: "0.875rem", lineHeight: 1.5, wordBreak: "break-word", whiteSpace: "pre-wrap",
                  backgroundColor: msg.role === "user" ? primaryColor : "#f1f5f9",
                  color: msg.role === "user" ? "#fff" : "#1e293b",
                  borderBottomRightRadius: msg.role === "user" ? "0.25rem" : "0.875rem",
                  borderBottomLeftRadius: msg.role === "user" ? "0.875rem" : "0.25rem",
                }}>
                  {msg.imageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element -- local data URL preview
                    <img src={msg.imageUrl} alt="Foto enviada" style={{ display: "block", width: "100%", maxHeight: "12rem", objectFit: "cover", borderRadius: "0.5rem", marginBottom: msg.content ? "0.5rem" : 0 }} />
                  )}
                  {msg.content && formatText(msg.content)}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <div style={{ backgroundColor: "#f1f5f9", padding: "0.75rem 1rem", borderRadius: "0.875rem 0.875rem 0.875rem 0.25rem", display: "flex", gap: "0.375rem", alignItems: "center" }}>
                  {[0, 150, 300].map((delay) => (
                    <span key={delay} style={{ width: "7px", height: "7px", borderRadius: "9999px", backgroundColor: "#94a3b8", display: "inline-block", animation: `bounce 1s ${delay}ms infinite` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Photo preview / error */}
          {(image || imageError) && (
            <div style={{ padding: "0.5rem 1rem 0", display: "flex", alignItems: "center", gap: "0.75rem" }}>
              {image && (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element -- local data URL preview */}
                  <img src={image.dataUrl} alt="Pré-visualização da foto" style={{ width: "3rem", height: "3rem", objectFit: "cover", borderRadius: "0.5rem" }} />
                  <span style={{ flex: 1, fontSize: "0.75rem", color: "#64748b" }}>Foto pronta para enviar</span>
                  <button onClick={() => setImage(null)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: "0.75rem", color: "#64748b", textDecoration: "underline", padding: "0.5rem" }}>
                    Remover
                  </button>
                </>
              )}
              {imageError && <span style={{ fontSize: "0.75rem", color: "#b91c1c" }}>{imageError}</span>}
            </div>
          )}

          {/* Input */}
          <div style={{ padding: "0.75rem 1rem", borderTop: "1px solid #e2e8f0", display: "flex", gap: "0.5rem", alignItems: "flex-end" }}>
            {tenantId && (
              <>
                <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={onPickFile} />
                <button
                  onClick={() => fileRef.current?.click()}
                  aria-label="Enviar foto"
                  style={{
                    width: "2.5rem", height: "2.5rem", flexShrink: 0, borderRadius: "0.625rem",
                    border: "1px solid #e2e8f0", background: "#f8fafc", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <circle cx="9" cy="10" r="1.75" />
                    <path d="m21 16-5-5-8 8" />
                  </svg>
                </button>
              </>
            )}
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Escreva sua mensagem..."
              rows={1}
              style={{
                flex: 1, resize: "none", border: "1px solid #e2e8f0", borderRadius: "0.625rem",
                padding: "0.625rem 0.875rem", fontSize: "0.875rem", fontFamily: "inherit",
                outline: "none", maxHeight: "80px", color: "#1e293b", backgroundColor: "#f8fafc",
              }}
            />
            <button
              onClick={() => tenantId ? sendMessage() : sendToWhatsApp()}
              disabled={(!input.trim() && !image) || loading}
              style={{
                width: "2.5rem", height: "2.5rem", flexShrink: 0, borderRadius: "0.625rem",
                backgroundColor: input.trim() || image ? primaryColor : "#e2e8f0",
                border: "none", cursor: input.trim() || image ? "pointer" : "default",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "background-color 0.15s",
              }}
              aria-label="Enviar"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Bubble */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Fechar chat" : "Abrir chat"}
        style={{
          width: "3.5rem", height: "3.5rem", borderRadius: "9999px",
          backgroundColor: primaryColor, border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 16px rgba(0,0,0,0.25)", transition: "transform 0.15s",
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1.08)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "scale(1)"; }}
      >
        {open ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        ) : (
          <>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <span style={{ position: "absolute", top: 0, right: 0, width: "12px", height: "12px", backgroundColor: "#4ade80", borderRadius: "9999px", border: "2px solid #fff" }} />
          </>
        )}
      </button>

      <style>{`@keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }`}</style>
    </div>
  );
}
