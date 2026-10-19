interface Props {
  partnerName: string;
  freeCycles: number;
}

export function PartnerBanner({ partnerName, freeCycles }: Props) {
  return (
    <div className="bg-brand-gold text-brand-dark text-center py-3 px-4 text-sm font-semibold">
      Oferta especial de{" "}
      <strong>{partnerName}</strong>: ganhe {freeCycles} meses de
      manutenção grátis ao comprar pelo link.
    </div>
  );
}
