export function formatDate(value: string | Date, locale: string = "th-TH") {
  const d = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString(locale);
}

