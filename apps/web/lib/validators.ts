/**
 * CPF and CNPJ check-digit validation.
 * Validates the mathematical check digits, not just the format.
 */

export function validateCPF(cpf: string): boolean {
  const clean = cpf.replace(/\D/g, "");
  if (clean.length !== 11) return false;
  // All same digit
  if (/^(\d)\1+$/.test(clean)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(clean[i]) * (10 - i);
  let r = (sum * 10) % 11;
  if (r === 10 || r === 11) r = 0;
  if (r !== parseInt(clean[9])) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(clean[i]) * (11 - i);
  r = (sum * 10) % 11;
  if (r === 10 || r === 11) r = 0;
  return r === parseInt(clean[10]);
}

export function validateCNPJ(cnpj: string): boolean {
  const clean = cnpj.replace(/\D/g, "");
  if (clean.length !== 14) return false;
  if (/^(\d)\1+$/.test(clean)) return false;

  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

  function calcDigit(num: string, weights: number[]): number {
    let sum = 0;
    for (let i = 0; i < weights.length; i++) {
      sum += parseInt(num[i]) * weights[i];
    }
    const r = sum % 11;
    return r < 2 ? 0 : 11 - r;
  }

  const d1 = calcDigit(clean, weights1);
  if (d1 !== parseInt(clean[12])) return false;
  const d2 = calcDigit(clean, weights2);
  return d2 === parseInt(clean[13]);
}
