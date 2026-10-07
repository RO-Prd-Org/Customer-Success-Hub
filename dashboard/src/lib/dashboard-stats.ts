import type { Invoice } from "@/lib/demo-invoices"

export type FindingSummary = {
  findingId: string
  label: string
  count: number
  amount: number
}

export type VendorSummary = {
  vendor: string
  invoiceCount: number
  totalSpend: number
  leakageAmount: number
  issueCount: number
}

export type MonthlyTrend = {
  month: string
  label: string
  spend: number
  leakage: number
  invoices: number
}

export type DashboardStats = {
  totalInvoices: number
  analyzedCount: number
  pendingCount: number
  redCount: number
  amberCount: number
  greenCount: number
  invoicesWithIssues: number
  totalIssues: number
  totalSpend: number
  analyzedSpend: number
  totalLeakage: number
  recoverableLeakage: number
  leakageRatePct: number
  recoverableRatePct: number
  findings: FindingSummary[]
  topVendors: VendorSummary[]
  monthlyTrend: MonthlyTrend[]
  recentFlagged: Invoice[]
  periodLabel: string
}

function monthKey(date: string) {
  return date.slice(0, 7)
}

function monthLabel(key: string) {
  const [year, month] = key.split("-")
  const date = new Date(Number(year), Number(month) - 1, 1)
  return date.toLocaleString("en-AU", { month: "short", year: "2-digit" })
}

export function buildDashboardStats(
  invoices: Invoice[],
  findingLabels: Record<string, string>
): DashboardStats {
  let analyzedCount = 0
  let pendingCount = 0
  let redCount = 0
  let amberCount = 0
  let greenCount = 0
  let totalIssues = 0
  let totalLeakage = 0
  let recoverableLeakage = 0
  let invoicesWithIssues = 0
  let totalSpend = 0
  let analyzedSpend = 0

  const findingMap = new Map<string, FindingSummary>()
  const vendorMap = new Map<string, VendorSummary>()
  const monthMap = new Map<string, MonthlyTrend>()
  const monthKeys: string[] = []

  for (const [findingId, label] of Object.entries(findingLabels)) {
    findingMap.set(findingId, { findingId, label, count: 0, amount: 0 })
  }

  for (const invoice of invoices) {
    totalSpend += invoice.amount

    const vendorEntry = vendorMap.get(invoice.vendor) ?? {
      vendor: invoice.vendor,
      invoiceCount: 0,
      totalSpend: 0,
      leakageAmount: 0,
      issueCount: 0,
    }
    vendorEntry.invoiceCount += 1
    vendorEntry.totalSpend += invoice.amount

    const key = monthKey(invoice.invoiceDate)
    if (key.length === 7) {
      if (!monthMap.has(key)) {
        monthKeys.push(key)
        monthMap.set(key, {
          month: key,
          label: monthLabel(key),
          spend: 0,
          leakage: 0,
          invoices: 0,
        })
      }
      const monthEntry = monthMap.get(key)!
      monthEntry.spend += invoice.amount
      monthEntry.invoices += 1
    }

    if (invoice.analysisPending) {
      pendingCount += 1
      vendorMap.set(invoice.vendor, vendorEntry)
      continue
    }

    analyzedCount += 1
    analyzedSpend += invoice.amount

    if (invoice.status === "red") redCount += 1
    else if (invoice.status === "amber") amberCount += 1
    else greenCount += 1

    const invoiceLeakage =
      invoice.issues?.reduce((sum, issue) => sum + issue.amount, 0) ?? 0

    if (invoice.issues?.length) {
      invoicesWithIssues += 1
      totalIssues += invoice.issues.length
      vendorEntry.leakageAmount += invoiceLeakage
      vendorEntry.issueCount += invoice.issues.length

      if (monthMap.has(key)) {
        monthMap.get(key)!.leakage += invoiceLeakage
      }

      for (const issue of invoice.issues) {
        totalLeakage += issue.amount
        if (issue.recoverable) recoverableLeakage += issue.amount

        const entry = findingMap.get(issue.findingId) ?? {
          findingId: issue.findingId,
          label: findingLabels[issue.findingId] ?? issue.type,
          count: 0,
          amount: 0,
        }
        entry.count += 1
        entry.amount += issue.amount
        findingMap.set(issue.findingId, entry)
      }
    }

    vendorMap.set(invoice.vendor, vendorEntry)
  }

  monthKeys.sort()
  const periodLabel =
    monthKeys.length === 0
      ? "Current period"
      : monthKeys.length === 1
        ? monthLabel(monthKeys[0])
        : `${monthLabel(monthKeys[0])} – ${monthLabel(monthKeys[monthKeys.length - 1])}`

  const recentFlagged = invoices
    .filter((invoice) => invoice.issues?.length)
    .sort((a, b) => b.invoiceDate.localeCompare(a.invoiceDate))
    .slice(0, 8)

  const topVendors = Array.from(vendorMap.values())
    .sort((a, b) => b.totalSpend - a.totalSpend)
    .slice(0, 6)

  const leakageRatePct =
    analyzedSpend > 0 ? (totalLeakage / analyzedSpend) * 100 : 0
  const recoverableRatePct =
    totalLeakage > 0 ? (recoverableLeakage / totalLeakage) * 100 : 0

  return {
    totalInvoices: invoices.length,
    analyzedCount,
    pendingCount,
    redCount,
    amberCount,
    greenCount,
    invoicesWithIssues,
    totalIssues,
    totalSpend,
    analyzedSpend,
    totalLeakage,
    recoverableLeakage,
    leakageRatePct,
    recoverableRatePct,
    findings: Array.from(findingMap.values()),
    topVendors,
    monthlyTrend: monthKeys.map((key) => monthMap.get(key)!),
    recentFlagged,
    periodLabel,
  }
}
