const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

function groupThousands(value: number): string {
  return Math.round(value)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function formatMoney(value: number, compact = false): string {
  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";

  if (compact) {
    if (abs >= 1_000_000) {
      const millions = abs / 1_000_000;
      const text =
        millions >= 10
          ? millions.toFixed(1).replace(/\.0$/, "")
          : millions.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
      return `${sign}$${text}M`;
    }
    if (abs >= 1_000) {
      const thousands = abs / 1_000;
      const text = Number.isInteger(thousands)
        ? String(thousands)
        : thousands >= 100
          ? String(Math.round(thousands))
          : thousands.toFixed(1).replace(/\.0$/, "");
      return `${sign}$${text}k`;
    }
  }

  return `${sign}$${groupThousands(abs)}`;
}

export function formatPercent(value: number, digits = 1): string {
  return `${(value * 100).toFixed(digits)}%`;
}

export function formatDelta(value: number): string {
  const arrow = value > 0 ? "↑" : value < 0 ? "↓" : "→";
  return `${arrow} ${formatPercent(Math.abs(value))}`;
}

function parseIsoDate(value: string): { year: number; month: number; day: number } | null {
  const match = value.slice(0, 10).match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;
  return {
    year: Number(match[1]),
    month: Number(match[2]),
    day: Number(match[3]),
  };
}

export function formatDate(value: string | null): string {
  if (!value) return "—";
  const parsed = parseIsoDate(value);
  if (!parsed) return value;
  return `${parsed.day} ${MONTHS[parsed.month - 1]} ${parsed.year}`;
}

export function formatMonth(value: string | null): string {
  if (!value) return "—";
  const parsed = parseIsoDate(value.slice(0, 10));
  if (!parsed) return value;
  return `${MONTHS[parsed.month - 1]} ${parsed.year}`;
}
