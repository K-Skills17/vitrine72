interface Props {
  partnerName: string;
  freeCycles: number;
}

export function PartnerBanner({ partnerName, freeCycles }: Props) {
  return (
    <div className="text-center py-3 px-4 text-sm font-semibold text-brand-dark" style={{ background: "var(--gold-accent)" }}>
      Oferta especial de{" "}
      <strong>{partnerName}</strong>: ganhe {freeCycles} meses de
      manutenção grátis ao comprar pelo link.
    </div>
  );
}
