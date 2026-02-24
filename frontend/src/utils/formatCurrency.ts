export function formatCurrency(value: number, currency: string = "THB") {
  try {
    return new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `฿${Number(value || 0).toLocaleString("th-TH")}`;
  }
}

