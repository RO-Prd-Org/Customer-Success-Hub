import type { ParquetRow } from "@/lib/parquet"

export function formatHeader(key: string): string {
  return key
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

export function formatCellValue(value: unknown): string {
  if (value === null || value === undefined) return "—"
  if (typeof value === "boolean") return value ? "Yes" : "No"
  if (typeof value === "number") {
    return Number.isInteger(value) ? String(value) : value.toFixed(2)
  }
  if (typeof value === "string") {
    if (/^\d{4}-\d{2}-\d{2}T/.test(value)) {
      const date = new Date(value)
      if (!Number.isNaN(date.getTime())) {
        return date.toLocaleString("en-AU", {
          dateStyle: "medium",
          timeStyle: "short",
        })
      }
    }
    return value
  }
  return String(value)
}

export function isBooleanColumn(rows: ParquetRow[], key: string): boolean {
  return rows.some((row) => typeof row[key] === "boolean")
}

export function isNumericColumn(rows: ParquetRow[], key: string): boolean {
  return rows.some((row) => typeof row[key] === "number")
}
