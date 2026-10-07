import type { DemoInstanceId } from "@/lib/demo-instances"
import { getInvoicesForDemo, type Invoice, type InvoiceIssue, type InvoiceStatus } from "@/lib/demo-invoices"
import { loadParquetFile, type ParquetRow } from "@/lib/parquet"

export function domainObjectsUrl(demoId: DemoInstanceId): string {
  return `/agent-output/${demoId}/domain_objects.parquet`
}

function parseJsonColumn<T>(value: unknown, fallback: T): T {
  if (value == null || value === "") return fallback
  if (typeof value === "string") {
    try {
      return JSON.parse(value) as T
    } catch {
      return fallback
    }
  }
  if (Array.isArray(value)) return value as T
  return fallback
}

function asNumber(value: unknown): number {
  if (typeof value === "bigint") return Number(value)
  if (typeof value === "number") return value
  if (value == null || value === "") return 0
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

function asString(value: unknown): string {
  if (value == null) return ""
  if (typeof value === "bigint") return String(value)
  return String(value)
}

function formatVendor(id: string): string {
  return id
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

function formatDate(value: unknown): string {
  const raw = asString(value)
  return raw.slice(0, 10)
}

function addDays(dateStr: string, days: number): string {
  if (!dateStr) return "—"
  const date = new Date(`${dateStr}T00:00:00`)
  if (Number.isNaN(date.getTime())) return "—"
  date.setDate(date.getDate() + days)
  return date.toISOString().slice(0, 10)
}

function buildAgentMetadata(row: ParquetRow): Record<string, string> {
  const entries: Array<[string, unknown]> = [
    ["Match status", row.match_status],
    ["Matched job", row.matched_job_id],
    ["Join path", row.join_path],
    ["Join confidence", row.join_confidence],
    ["Paid cost", row.paid_cost],
    ["Variance", row.variance_amount],
    ["Variance %", row.variance_pct],
    ["Analyzed at", row.analyzed_at],
  ]

  return Object.fromEntries(
    entries
      .filter(([, value]) => value != null && value !== "")
      .map(([key, value]) => [key, asString(value)])
  )
}

function mapIssues(row: ParquetRow): InvoiceIssue[] | undefined {
  const issues = parseJsonColumn<InvoiceIssue[]>(row.issues, [])
  return issues.length > 0 ? issues : undefined
}

function mapFashionRow(row: ParquetRow): Invoice {
  const id = asString(row.carrier_invoice_id)
  const invoiceDate = formatDate(row.invoice_date)
  const analyzed = Boolean(row.analyzed_at || row.reasoning)
  const status = (asString(row.invoice_status) as InvoiceStatus) || "green"

  return {
    id,
    name: `${formatVendor(asString(row.carrier_id || "Carrier"))} — ${invoiceDate || id}`,
    vendor: formatVendor(asString(row.carrier_id || "Unknown")),
    invoiceDate: invoiceDate || "—",
    dueDate: addDays(invoiceDate, 14),
    amount: asNumber(row.gross_amount ?? row.billed_amount),
    currency: asString(row.currency || "AUD"),
    status: analyzed ? status : "green",
    issues: mapIssues(row),
    reasoning: analyzed
      ? asString(row.reasoning)
      : "Awaiting agent analysis for this invoice.",
    agentAction: row.agent_action ? asString(row.agent_action) : undefined,
    conversationIds: parseJsonColumn<string[]>(row.conversation_ids, []),
    metadata: buildAgentMetadata(row),
    analysisPending: !analyzed,
    analyzedAt: row.analyzed_at ? asString(row.analyzed_at) : null,
    agentEvidence: row.evidence ? asString(row.evidence) : null,
  }
}

function mapLogisticsRow(row: ParquetRow): Invoice {
  const id = asString(row.client_invoice_id)
  const invoiceDate = formatDate(row.invoice_date)
  const analyzed = Boolean(row.analyzed_at || row.reasoning || row.analysis_notes)
  const status = (asString(row.invoice_status) as InvoiceStatus) || "green"

  return {
    id,
    name: `${formatVendor(asString(row.client_id || "Client"))} — ${invoiceDate || id}`,
    vendor: formatVendor(asString(row.client_id || "Unknown")),
    invoiceDate: invoiceDate || "—",
    dueDate: addDays(invoiceDate, 14),
    amount: asNumber(row.total_revenue ?? row.billed_amount),
    currency: "AUD",
    status: analyzed ? status : "green",
    issues: mapIssues(row),
    reasoning: analyzed
      ? asString(row.reasoning || row.analysis_notes)
      : "Awaiting agent analysis for this invoice.",
    agentAction: row.agent_action ? asString(row.agent_action) : undefined,
    conversationIds: parseJsonColumn<string[]>(row.conversation_ids, []),
    metadata: {
      ...buildAgentMetadata(row),
      ...(row.client_id ? { "Client id": asString(row.client_id) } : {}),
    },
    analysisPending: !analyzed,
    analyzedAt: row.analyzed_at ? asString(row.analyzed_at) : null,
    agentEvidence: row.evidence ? asString(row.evidence) : null,
  }
}

export function mapDomainRowToInvoice(
  demoId: DemoInstanceId,
  row: ParquetRow
): Invoice {
  return demoId === "fashion" ? mapFashionRow(row) : mapLogisticsRow(row)
}

export async function loadDomainInvoices(
  demoId: DemoInstanceId
): Promise<Invoice[]> {
  try {
    const rows = await loadParquetFile(domainObjectsUrl(demoId))
    if (rows && rows.length > 0) {
      return rows.map((row) => mapDomainRowToInvoice(demoId, row))
    }
  } catch {
    // Fall back to demo invoices if parquet is missing
  }
  return getInvoicesForDemo(demoId)
}

export function getVendorsFromInvoices(invoices: Invoice[]): string[] {
  return Array.from(new Set(invoices.map((invoice) => invoice.vendor))).sort()
}
