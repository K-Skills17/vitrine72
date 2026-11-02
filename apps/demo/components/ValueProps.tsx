import { ShieldIcon, ClockIcon, AwardIcon, SparklesIcon, RulerIcon, StarIcon } from "./Icon";
import type { NicheConfig } from "../lib/niche";

interface Prop {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function ValueCard({ icon, title, description }: Prop) {
  return (
    <div
      style={{
        padding: "2rem 1.5rem",
        borderRadius: "1rem",
        backgroundColor: "var(--color-surface)",
        border: "1px solid #f0f0f0",
        boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
      }}
    >
      <div
        style={{
          marginBottom: "1rem",
          width: "3rem",
          height: "3rem",
          borderRadius: "0.75rem",
          backgroundColor: "var(--color-primary-light)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {icon}
      </div>
      <h3
        style={{
          marginBottom: "0.5rem",
          fontSize: "1rem",
          fontWeight: 700,
          color: "var(--color-text)",
        }}
      >
        {title}
      </h3>
      <p style={{ fontSize: "0.875rem", lineHeight: 1.65, color: "var(--color-muted)" }}>
        {description}
      </p>
    </div>
  );
}

interface Props {
  config: NicheConfig;
}

const esteticaProps: Prop[] = [
  {
    icon: <ShieldIcon size={22} color="var(--color-primary)" />,
    title: "Produtos certificados ANVISA",
    description: "Todos os materiais utilizados têm registro na ANVISA, garantindo segurança e qualidade comprovadas.",
  },
  {
    icon: <AwardIcon size={22} color="var(--color-primary)" />,
    title: "Profissionais certificados",
    description: "Nossa equipe tem formação e certificações reconhecidas nas principais técnicas do mercado.",
  },
  {
    icon: <SparklesIcon size={22} color="var(--color-primary)" />,
    title: "Resultado natural",
    description: "Técnica precisa que realça sua beleza sem excessos. O objetivo é sempre o resultado mais sutil e elegante.",
  },
  {
    icon: <ClockIcon size={22} color="var(--color-primary)" />,
    title: "Atendimento ágil",
    description: "Horários flexíveis e atendimento pontual. Respeitamos o seu tempo do início ao fim.",
  },
];

const planejadosProps: Prop[] = [
  {
    icon: <RulerIcon size={22} color="var(--color-primary)" />,
    title: "Projeto 100% sob medida",
    description: "Cada centímetro do seu espaço é aproveitado. Projetamos para o seu imóvel, não para um catálogo.",
  },
  {
    icon: <AwardIcon size={22} color="var(--color-primary)" />,
    title: "Materiais de alta qualidade",
    description: "MDF de primeira linha, ferragens importadas e acabamentos que duram décadas com o uso diário.",
  },
  {
    icon: <StarIcon size={22} color="var(--color-primary)" />,
    title: "Projeto 3D incluso",
    description: "Você vê o resultado antes de fabricar. Aprovação visual completa antes de qualquer produção.",
  },
  {
    icon: <ClockIcon size={22} color="var(--color-primary)" />,
    title: "Prazo garantido",
    description: "Entrega no prazo combinado com equipe de instalação própria, sem terceirização.",
  },
];

export default function ValueProps({ config }: Props) {
  const props = config.niche === "planejados" ? planejadosProps : esteticaProps;

  return (
    <section
      style={{
        padding: "5rem 1.25rem",
        backgroundColor: "var(--color-bg)",
      }}
    >
      <div style={{ maxWidth: "72rem", margin: "0 auto" }}>
        <h2
          style={{
            marginBottom: "0.75rem",
            textAlign: "center",
            fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
            fontWeight: 700,
            fontFamily: `"Playfair Display", serif`,
            color: "var(--color-text)",
          }}
        >
          Por que escolher a {config.brandName}?
        </h2>
        <p
          style={{
            marginBottom: "3rem",
            textAlign: "center",
            fontSize: "0.95rem",
            color: "var(--color-muted)",
          }}
        >
          O que nos diferencia no mercado
        </p>

        <div
          style={{
            display: "grid",
            gap: "1.25rem",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          }}
        >
          {props.map((prop, i) => (
            <ValueCard key={i} {...prop} />
          ))}
        </div>
      </div>
    </section>
  );
}
