import type { DemoInstanceId } from "@/lib/demo-instances"
import type { DashboardStats } from "@/lib/dashboard-stats"

export const FASHION_FINDINGS: Record<string, string> = {
  L01: "Avoidable split shipment",
  L02: "Billed weight overcharge",
  L03: "Missed SLA service credit",
  L04: "Duplicate label charge",
  L05: "Invalid residential surcharge",
}

export const LOGISTICS_FINDINGS: Record<string, string> = {
  P01: "Unrecovered toll pass-through",
  P02: "Fuel recovery lag",
  P03: "Third-party warehouse not passed through",
  P04: "Owned warehouse under-recovery",
  P05: "Subcontractor accessorial absorbed",
}

export type ScenarioConfig = {
  title: string
  subtitle: string
  invoiceLabel: string
  spendLabel: string
  findings: Record<string, string>
  connectedSystems: Array<{ name: string; description: string }>
  buildExecutiveSummary: (stats: DashboardStats) => string
  buildAttentionLine: (stats: DashboardStats) => string | null
}

const fashionSystems = [
  { name: "Commerce & OMS", description: "Orders, allocations, and promise dates" },
  { name: "WMS", description: "Pick, pack, and depot weigh-in events" },
  { name: "TMS", description: "Labels, manifests, and rate quotes" },
  { name: "Carrier feeds", description: "Tracking, POD, and invoice lines" },
  { name: "Procurement", description: "Contract rates and surcharge rules" },
]

const logisticsSystems = [
  { name: "Client billing", description: "Bookings, rate cards, and receivables" },
  { name: "Subcontractor AP", description: "Linehaul, accessorial, and fuel invoices" },
  { name: "Fleet telemetry", description: "GPS, wait time, and toll tag events" },
  { name: "Warehousing", description: "Owned allocations and 3PL payables" },
  { name: "Finance", description: "Pass-through markup and recovery lines" },
]

export function getScenarioConfig(demoId: DemoInstanceId): ScenarioConfig {
  if (demoId === "fashion") {
    return {
      title: "Last-mile control tower",
      subtitle: "Carrier spend, contract compliance, and recoverable leakage",
      invoiceLabel: "Carrier invoices",
      spendLabel: "Carrier spend",
      findings: FASHION_FINDINGS,
      connectedSystems: fashionSystems,
      buildExecutiveSummary(stats) {
        if (stats.analyzedCount === 0) {
          return `RedOwl is reconciling ${stats.totalInvoices.toLocaleString("en-AU")} carrier invoices against depot measurements, contract rates, and delivery outcomes for the ${stats.periodLabel} billing window. Initial ingestion is complete; exception review is queueing now.`
        }
        const rate =
          stats.analyzedSpend > 0
            ? ((stats.totalLeakage / stats.analyzedSpend) * 100).toFixed(2)
            : "0.00"
        return `${stats.analyzedCount.toLocaleString("en-AU")} of ${stats.totalInvoices.toLocaleString("en-AU")} carrier invoices have been reconciled for ${stats.periodLabel}. Identified leakage totals ${formatAud(stats.totalLeakage)} (${rate}% of reviewed spend), with ${formatAud(stats.recoverableLeakage)} recoverable through disputes, credits, or contract enforcement. Weight and surcharge mismatches remain the highest-volume exception categories.`
      },
      buildAttentionLine(stats) {
        if (stats.redCount > 0) {
          return `${stats.redCount} invoice${stats.redCount === 1 ? "" : "s"} already have autonomous dispute or hold actions in flight.`
        }
        if (stats.amberCount > 0) {
          return `${stats.amberCount} invoice${stats.amberCount === 1 ? "" : "s"} need AP approval before credits or recoveries can be released.`
        }
        if (stats.pendingCount > 0) {
          return `${stats.pendingCount.toLocaleString("en-AU")} invoices are still in the reconciliation queue for this period.`
        }
        return null
      },
    }
  }

  return {
    title: "Cost recovery dashboard",
    subtitle: "Client billing accuracy and subcontractor pass-through",
    invoiceLabel: "Customer invoices",
    spendLabel: "Billed revenue",
    findings: LOGISTICS_FINDINGS,
    connectedSystems: logisticsSystems,
    buildExecutiveSummary(stats) {
      if (stats.analyzedCount === 0) {
        return `Finance is matching ${stats.totalInvoices.toLocaleString("en-AU")} client invoices to subcontractor payables, toll events, fuel swipes, and warehouse costs for ${stats.periodLabel}. No exceptions have been published yet.`
      }
      const rate =
        stats.analyzedSpend > 0
          ? ((stats.totalLeakage / stats.analyzedSpend) * 100).toFixed(2)
          : "0.00"
      return `${stats.analyzedCount.toLocaleString("en-AU")} client invoices reviewed for ${stats.periodLabel}. Unrecovered pass-through totals ${formatAud(stats.totalLeakage)} (${rate}% of reviewed revenue), with ${formatAud(stats.recoverableLeakage)} eligible for supplemental billing or subcontractor dispute. Toll and fuel timing gaps are the most common drivers.`
    },
    buildAttentionLine(stats) {
      if (stats.redCount > 0) {
        return `${stats.redCount} client bill${stats.redCount === 1 ? "" : "s"} have recovery actions already issued to billing or AP.`
      }
      if (stats.amberCount > 0) {
        return `${stats.amberCount} recovery${stats.amberCount === 1 ? "" : "s"} awaiting commercial sign-off on rate card or markup rules.`
      }
      if (stats.pendingCount > 0) {
        return `${stats.pendingCount.toLocaleString("en-AU")} client invoices remain unmatched to input cost feeds.`
      }
      return null
    },
  }
}

export function getFindingLabels(demoId: DemoInstanceId): Record<string, string> {
  return demoId === "fashion" ? FASHION_FINDINGS : LOGISTICS_FINDINGS
}

function formatAud(amount: number) {
  return amount.toLocaleString("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
}
