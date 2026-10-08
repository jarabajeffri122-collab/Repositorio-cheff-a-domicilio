export function formatCurrency(amount: number): string {
  const formatted = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

  return `${formatted} COP`;
}

export function formatGrams(grams: number): string {
  if (grams >= 1000) {
    return `${(grams / 1000).toFixed(2)} kg (${grams.toLocaleString('es-CO')} g)`;
  }
  return `${grams.toLocaleString('es-CO')} g`;
}

export function formatUnitMultiples(units: number): string {
  return `${units} × 150g (${(units * 150).toLocaleString('es-CO')} g)`;
}
