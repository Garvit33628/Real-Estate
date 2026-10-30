const nprFormatter = new Intl.NumberFormat('en-NP', {
  style: 'currency',
  currency: 'NPR',
  maximumFractionDigits: 0,
});

export function formatNpr(value) {
  return nprFormatter.format(Number(value) || 0);
}