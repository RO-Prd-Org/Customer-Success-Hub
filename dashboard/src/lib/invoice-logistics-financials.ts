import type { Invoice } from "@/lib/demo-invoices"
import { getInvoiceLineItems, type InvoiceLineItem } from "@/lib/invoice-detail-extras"

export type LogisticsCostLine = {
  id: string
  description: string
  supplier: string
  amount: number
}

export type InvoiceLogisticsFinancials = {
  billing: number
  costs: number
  leakage: number
  gross: number
  potentialProfit: number
  usedPaidCost: boolean
  billingLines: InvoiceLineItem[]
  costLines: LogisticsCostLine[]
}

function seed(invoiceId: string): number {
  const digits = invoiceId.replace(/\D/g, "")
  return Number(digits || 0)
}

function money(value: number): number {
  return Math.round(value * 100) / 100
}

function splitAmount(total: number, weights: number[]): number[] {
  const weightSum = weights.reduce((sum, weight) => sum + weight, 0) || 1
  const cents = weights.map((weight) => Math.round((total * weight * 100) / weightSum))
  cents[cents.length - 1] += Math.round(total * 100) - cents.reduce((sum, value) => sum + value, 0)
  return cents.map((value) => money(value / 100))
}

function parseMetadataNumber(value: string | undefined): number | null {
  if (value == null || value === "") return null
  const parsed = Number(String(value).replace(/,/g, "").trim())
  return Number.isFinite(parsed) ? parsed : null
}

/**
 * paid_cost on red logistics invoices is often billed + leakage (what we
 * should have invoiced), not the true 3PL/input cost. Use it only when it
 * looks like a distinct cost base.
 */
function resolveCosts(billing: number, leakage: number, paidCost: number | null): {
  costs: number
  usedPaidCost: boolean
} {
  if (paidCost != null && paidCost > 0) {
    return { costs: money(paidCost), usedPaidCost: true }
  }

  const baseGross = Math.max(billing * 0.15, 20)
  return {
    costs: money(billing - baseGross + leakage),
    usedPaidCost: false,
  }
}

function buildCostLines(invoice: Invoice, totalCost: number): LogisticsCostLine[] {
  const n = seed(invoice.id)
  const findings = new Set(invoice.issues?.map((issue) => issue.findingId) ?? [])

  const haulage = ["RoadLine Haulage", "Metro Freight Co", "Pacific Logistics", "Owner Drivers Pool"]
  const fuel = ["BP Fuel Card", "Caltex StarCard", "Ampol Fleet"]
  const toll = ["Linkt Toll Tags", "EastLink Tag", "WestConnex Tag"]
  const warehouse3pl = ["Kewdale 3PL", "Eastern Creek 3PL", "Truganina 3PL"]

  const specs: Array<{ description: string; supplier: string; weight: number }> = [
    {
      description: "Subcontractor linehaul",
      supplier: haulage[n % haulage.length],
      weight: 0.62,
    },
    {
      description: "Fuel card — job diesel",
      supplier: fuel[n % fuel.length],
      weight: 0.14,
    },
    {
      description: "Toll tags — plaza hits",
      supplier: toll[n % toll.length],
      weight: 0.08,
    },
  ]

  if (findings.has("P04")) {
    specs.push({
      description: "Owned DC handling allocation",
      supplier: "Melbourne owned DC",
      weight: 0.12,
    })
  } else {
    specs.push({
      description: "3PL warehouse handling",
      supplier: warehouse3pl[n % warehouse3pl.length],
      weight: 0.12,
    })
  }

  if (findings.has("P05")) {
    specs.push({
      description: "Wait / liftgate accessorial",
      supplier: "Owner Drivers Pool",
      weight: 0.07,
    })
  }

  const amounts = splitAmount(
    totalCost,
    specs.map((spec) => spec.weight)
  )

  return specs.map((spec, index) => ({
    id: `${invoice.id}-C${index + 1}`,
    description: spec.description,
    supplier: spec.supplier,
    amount: amounts[index],
  }))
}

export function getInvoiceLogisticsFinancials(invoice: Invoice): InvoiceLogisticsFinancials {
  const billing = money(invoice.amount)
  const issueLeakage = money(
    (invoice.issues ?? []).reduce((sum, issue) => sum + issue.amount, 0)
  )
  const variance = parseMetadataNumber(invoice.metadata["Variance"])
  const leakage =
    issueLeakage > 0
      ? issueLeakage
      : variance != null && variance < 0
        ? money(Math.abs(variance))
        : 0

  const paidCost = parseMetadataNumber(invoice.metadata["Paid cost"])
  const { costs, usedPaidCost } = resolveCosts(billing, leakage, paidCost)
  const gross = money(billing - costs)
  const potentialProfit = money(gross + leakage)

  return {
    billing,
    costs,
    leakage,
    gross,
    potentialProfit,
    usedPaidCost,
    billingLines: getInvoiceLineItems(invoice, "logistics"),
    costLines: buildCostLines(invoice, costs),
  }
}
