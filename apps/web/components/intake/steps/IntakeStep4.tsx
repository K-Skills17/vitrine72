"use client";

import { useState } from "react";
import { FormField } from "@/components/ui/FormField";

interface Props {
  data: Record<string, unknown>;
  onNext: (_update: Record<string, unknown>) => void;
  onBack: () => void;
}

const MIN_PHOTOS = 8;

export function IntakeStep4({ data, onNext, onBack }: Props) {
  const [proofYears, setProofYears] = useState((data.proofYears as string) ?? "");
  const [proofClients, setProofClients] = useState((data.proofClients as string) ?? "");
  const [proofCerts, setProofCerts] = useState((data.proofCerts as string) ?? "");
  const [allowGoogleReviews, setAllowGoogleReviews] = useState(
    (data.allowGoogleReviews as boolean) ?? false
  );
  const [photos, setPhotos] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState<string[]>((data.uploadedPhotos as string[]) ?? []);
  const [logoUploaded, setLogoUploaded] = useState<string | null>(
    (data.logoPath as string) ?? null
  );
  const [colorChoice, setColorChoice] = useState((data.colorChoice as string) ?? "");
  const [siteRef1, setSiteRef1] = useState((data.siteRef1 as string) ?? "");
  const [siteRef2, setSiteRef2] = useState((data.siteRef2 as string) ?? "");
  const [siteDontLike, setSiteDontLike] = useState((data.siteDontLike as string) ?? "");
  const [domainHas, setDomainHas] = useState((data.domainHas as string) ?? "");
  const [domainName, setDomainName] = useState((data.domainName as string) ?? "");
  const [domainAccess, setDomainAccess] = useState((data.domainAccess as string) ?? "");
  const [error, setError] = useState<string | null>(null);

  async function uploadFiles(files: File[], role: "photo" | "logo") {
    setUploading(true);
    try {
      const formData = new FormData();
      for (const f of files) formData.append("file", f);
      formData.append("projectId", data.projectId as string ?? "");
      formData.append("role", role);
      const res = await fetch(
        `/api/intake/${data.__token ?? "noop"}/upload`,
        { method: "POST", body: formData }
      );
      const json = await res.json();
      return (json.paths as string[]) ?? [];
    } finally {
      setUploading(false);
    }
  }

  async function handlePhotos(files: FileList) {
    // Client-side compress before upload (basic: just set max 1MB per file)
    const arr = Array.from(files);
    const paths = await uploadFiles(arr, "photo");
    setUploaded((prev) => [...prev, ...paths]);
    setPhotos((prev) => [...prev, ...arr]);
  }

  function validate(): boolean {
    const totalPhotos = uploaded.length + photos.length;
    if (totalPhotos < MIN_PHOTOS) {
      setError(`Envie pelo menos ${MIN_PHOTOS} fotos. Você enviou ${totalPhotos}.`);
      return false;
    }
    setError(null);
    return true;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (validate()) {
      onNext({
        proofYears,
        proofClients,
        proofCerts,
        allowGoogleReviews,
        uploadedPhotos: uploaded,
        logoPath: logoUploaded,
        colorChoice,
        siteRef1,
        siteRef2,
        siteDontLike,
        domainHas,
        domainName,
        domainAccess,
      });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <h2 className="text-xl font-display font-semibold text-white">
        Provas e fotos
      </h2>

      <p className="text-gray-400 text-sm">
        Provas aumentam a confiança dos clientes. Preencha o que tiver.
      </p>

      <FormField label="Há quantos anos você atua? (opcional)">
        <input
          type="text"
          value={proofYears}
          onChange={(e) => setProofYears(e.target.value)}
          placeholder="Ex: 8 anos"
          className="input-field"
        />
      </FormField>

      <FormField label="Quantos clientes já atendeu? (opcional)">
        <input
          type="text"
          value={proofClients}
          onChange={(e) => setProofClients(e.target.value)}
          placeholder="Ex: mais de 500 clientes"
          className="input-field"
        />
      </FormField>

      <FormField label="Certificações ou prêmios (opcional)">
        <input
          type="text"
          value={proofCerts}
          onChange={(e) => setProofCerts(e.target.value)}
          placeholder="Ex: Certificado ABIH"
          className="input-field"
        />
      </FormField>

      <FormField label="">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={allowGoogleReviews}
            onChange={(e) => setAllowGoogleReviews(e.target.checked)}
            className="accent-brand-gold mt-1"
          />
          <span className="text-gray-300 text-sm">
            Autorizo o uso das avaliações do Google Meu Negócio no site.
          </span>
        </label>
      </FormField>

      <FormField
        label={`Fotos reais * (mínimo ${MIN_PHOTOS}: equipe, local e trabalho)`}
        hint={`${uploaded.length} foto(s) enviada(s)`}
      >
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => e.target.files && handlePhotos(e.target.files)}
          className="block text-sm text-gray-400 file:mr-3 file:bg-brand-dark-3 file:text-gray-300 file:border-0 file:px-3 file:py-1.5 file:rounded-lg"
        />
        {uploading && (
          <p className="text-xs text-gray-500 mt-1">Enviando fotos…</p>
        )}
      </FormField>

      {error && (
        <p className="text-red-400 text-sm">{error}</p>
      )}

      <FormField label="Logo (opcional)">
        <input
          type="file"
          accept="image/*,.svg"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (file) {
              const paths = await uploadFiles([file], "logo");
              setLogoUploaded(paths[0] ?? null);
            }
          }}
          className="block text-sm text-gray-400 file:mr-3 file:bg-brand-dark-3 file:text-gray-300 file:border-0 file:px-3 file:py-1.5 file:rounded-lg"
        />
      </FormField>

      <FormField label="Preferência de cores *">
        <div className="space-y-2">
          {[
            { value: "logo", label: "Usar as cores da minha logo" },
            { value: "preset1", label: "Paleta 1 do meu segmento (PLACEHOLDER: ver amostras)" },
            { value: "preset2", label: "Paleta 2 do meu segmento (PLACEHOLDER: ver amostras)" },
          ].map((opt) => (
            <label key={opt.value} className="flex items-start gap-3 cursor-pointer">
              <input
                type="radio"
                name="colorChoice"
                value={opt.value}
                checked={colorChoice === opt.value}
                onChange={() => setColorChoice(opt.value)}
                className="accent-brand-gold mt-0.5"
                disabled={opt.value === "logo" && !logoUploaded}
              />
              <span className={`text-sm ${colorChoice === opt.value ? "text-white" : "text-gray-400"}`}>
                {opt.label}
                {opt.value === "logo" && !logoUploaded && " (envie a logo primeiro)"}
              </span>
            </label>
          ))}
        </div>
      </FormField>

      <FormField label="2 sites que você gosta (opcional)">
        <input
          type="url"
          value={siteRef1}
          onChange={(e) => setSiteRef1(e.target.value)}
          placeholder="https://..."
          className="input-field mb-2"
        />
        <input
          type="url"
          value={siteRef2}
          onChange={(e) => setSiteRef2(e.target.value)}
          placeholder="https://..."
          className="input-field"
        />
      </FormField>

      <FormField label="1 site que você não gosta (opcional)">
        <input
          type="url"
          value={siteDontLike}
          onChange={(e) => setSiteDontLike(e.target.value)}
          placeholder="https://..."
          className="input-field"
        />
      </FormField>

      <FormField label="Você já tem domínio? *">
        <div className="flex gap-4">
          {[
            { value: "sim", label: "Sim" },
            { value: "nao", label: "Não" },
          ].map((opt) => (
            <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="domainHas"
                value={opt.value}
                checked={domainHas === opt.value}
                onChange={() => setDomainHas(opt.value)}
                className="accent-brand-gold"
              />
              <span className="text-gray-300 text-sm">{opt.label}</span>
            </label>
          ))}
        </div>
      </FormField>

      {domainHas === "sim" && (
        <>
          <FormField label="Qual o domínio?">
            <input
              type="text"
              value={domainName}
              onChange={(e) => setDomainName(e.target.value)}
              placeholder="seunegocio.com.br"
              className="input-field"
            />
          </FormField>
          <FormField label="Quem tem o acesso ao painel?">
            <input
              type="text"
              value={domainAccess}
              onChange={(e) => setDomainAccess(e.target.value)}
              placeholder="Eu mesmo / meu sobrinho / agência X"
              className="input-field"
            />
          </FormField>
        </>
      )}

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 border border-white/20 text-gray-400 py-3 rounded-xl hover:bg-brand-dark-2 transition"
        >
          Voltar
        </button>
        <button
          type="submit"
          className="flex-1 bg-brand-gold text-brand-dark font-bold py-3 rounded-xl hover:brightness-110 transition"
        >
          Próximo
        </button>
      </div>
    </form>
  );
}
