type CsvRow = Record<string, string | number | boolean | null | undefined>

function escapeCsvValue(value: unknown): string {
  if (value === null || value === undefined) return ""
  const text = String(value)
  if (/[",\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`
  }
  return text
}

export function exportRowsToCsv(
  rows: CsvRow[],
  columns: { key: string; label: string }[],
  filename: string
) {
  const header = columns.map((column) => escapeCsvValue(column.label)).join(",")
  const body = rows
    .map((row) =>
      columns.map((column) => escapeCsvValue(row[column.key])).join(",")
    )
    .join("\n")

  const blob = new Blob([`${header}\n${body}`], {
    type: "text/csv;charset=utf-8;",
  })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}
