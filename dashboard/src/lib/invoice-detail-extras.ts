import type { DemoInstanceId } from "@/lib/demo-instances"
import type { Invoice } from "@/lib/demo-invoices"

export type InvoiceLineItem = {
  id: string
  description: string
  quantity: number
  unitAmount: number
  amount: number
  glCode: string
  glName: string
  costCenter: string
  costCenterName: string
}

export type AgentCheckStatus = "pass" | "fail" | "review" | "queued"

export type AgentCheck = {
  id: string
  category: "Invoice validation" | "Vendor validation" | "PO validation" | "Contract validation"
  name: string
  status: AgentCheckStatus
  detail: string
}

export type ProcessNode = {
  id: string
  label: string
  caption: string
}

export type ProcessState = {
  nodes: ProcessNode[]
  currentIndex: number
  summary: string
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

function pad(prefix: string, n: number): string {
  return `${prefix}-${String(n).padStart(6, "0")}`
}

function clientCrmCode(invoice: Invoice): string {
  const explicit =
    invoice.metadata["Client id"] ??
    invoice.metadata["client_id"] ??
    invoice.metadata["Client"]
  const source = explicit || invoice.vendor
  const token = source
    .trim()
    .replace(/_/g, "-")
    .split(/[\s-]+/)[0]
    ?.toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
  return token || "CLIENT"
}

export function getInvoiceLineItems(invoice: Invoice, demoId: DemoInstanceId): InvoiceLineItem[] {
  const n = seed(invoice.id)
  const findings = new Set(invoice.issues?.map((issue) => issue.findingId) ?? [])

  if (demoId === "fashion") {
    const costCenters = [
      { code: "CC-DERR-LM", name: "Derrimut last mile" },
      { code: "CC-ECEK-LM", name: "Eastern Creek last mile" },
      { code: "CC-TRUG-DC", name: "Truganina DC outbound" },
    ]
    const cc = costCenters[n % costCenters.length]
    const specs: Array<{
      description: string
      glCode: string
      glName: string
      weight: number
      qty: number
    }> = [
      {
        description: "Base last-mile — metro parcel",
        glCode: "6100",
        glName: "Freight-out",
        weight: 0.72,
        qty: 1,
      },
      {
        description: "Fuel surcharge",
        glCode: "6110",
        glName: "Fuel surcharge",
        weight: 0.16,
        qty: 1,
      },
    ]

    if (findings.has("L05") || n % 3 === 0) {
      specs.push({
        description: "Residential delivery surcharge",
        glCode: "6130",
        glName: "Last-mile accessorials",
        weight: 0.08,
        qty: 1,
      })
    }
    if (findings.has("L04") || n % 5 === 1) {
      specs.push({
        description: "Additional label / reprint",
        glCode: "6120",
        glName: "Label & handling",
        weight: 0.12,
        qty: 1,
      })
    }
    if (findings.has("L01")) {
      specs.push({
        description: "Second carton — split shipment",
        glCode: "6100",
        glName: "Freight-out",
        weight: 0.18,
        qty: 1,
      })
    }

    const amounts = splitAmount(
      invoice.amount,
      specs.map((spec) => spec.weight)
    )
    return specs.map((spec, index) => ({
      id: `${invoice.id}-L${index + 1}`,
      description: spec.description,
      quantity: spec.qty,
      unitAmount: amounts[index],
      amount: amounts[index],
      glCode: spec.glCode,
      glName: spec.glName,
      costCenter: cc.code,
      costCenterName: cc.name,
    }))
  }

  const crmClient = clientCrmCode(invoice)
  let rawSpecs: Array<{
    description: string
    glCode: string
    glName: string
    weight: number
    qty: number
    crmSku: string
    crmProduct: string
  }> = [
    {
      description: "Linehaul — booked lane",
      glCode: "4100",
      glName: "Client freight revenue",
      weight: 0.68,
      qty: 1,
      crmSku: "LINEHAUL",
      crmProduct: "Linehaul freight",
    },
    {
      description: "Fuel recovery",
      glCode: "4110",
      glName: "Fuel surcharge revenue",
      weight: 0.12,
      qty: 1,
      crmSku: "FUEL",
      crmProduct: "Fuel surcharge",
    },
    {
      description: "Toll pass-through",
      glCode: "4120",
      glName: "Toll recovery",
      weight: 0.08,
      qty: 1,
      crmSku: "TOLL",
      crmProduct: "Toll pass-through",
    },
    {
      description: "Warehouse handling",
      glCode: "4130",
      glName: "Warehouse recovery",
      weight: 0.1,
      qty: 1,
      crmSku: "WHSE",
      crmProduct: "Warehouse handling",
    },
  ]

  // Filter out customer billing lines that were unrecovered / not passed through according to Insights
  if (findings.has("P01")) {
    rawSpecs = rawSpecs.filter((spec) => spec.crmSku !== "TOLL")
  }
  if (findings.has("P02")) {
    rawSpecs = rawSpecs.filter((spec) => spec.crmSku !== "FUEL")
  }
  if (findings.has("P03") || findings.has("P04")) {
    rawSpecs = rawSpecs.filter((spec) => spec.crmSku !== "WHSE")
  }

  const specs = rawSpecs

  const amounts = splitAmount(
    invoice.amount,
    specs.map((spec) => spec.weight)
  )
  return specs.map((spec, index) => ({
    id: `${invoice.id}-L${index + 1}`,
    description: spec.description,
    quantity: spec.qty,
    unitAmount: amounts[index],
    amount: amounts[index],
    glCode: spec.glCode,
    glName: spec.glName,
    costCenter: `CRM-${crmClient}-${spec.crmSku}`,
    costCenterName: spec.crmProduct,
  }))
}

export function getAgentChecks(invoice: Invoice, demoId: DemoInstanceId): AgentCheck[] {
  const n = seed(invoice.id)
  const findings = new Set(invoice.issues?.map((issue) => issue.findingId) ?? [])
  const poRef = demoId === "fashion" ? pad("ORD", n) : pad("BKG", 10000 + Math.max(n - 1, 0))
  const bank = `•• ${String(1000 + (n % 9000)).slice(-4)}`
  const abn = `${51 + (n % 40)} ${100 + (n % 900)} ${200 + (n % 800)} ${300 + (n % 700)}`

  const queued = Boolean(invoice.analysisPending)
  const red = !queued && invoice.status === "red"
  const amber = !queued && invoice.status === "amber"

  const status = (failWhen: boolean, reviewWhen = false): AgentCheckStatus => {
    if (queued) return "queued"
    if (failWhen) return "fail"
    if (reviewWhen) return "review"
    return "pass"
  }

  const contractFail =
    red &&
    (findings.size > 0 ||
      ["L02", "L03", "L05", "P01", "P02", "P03", "P04", "P05"].some((id) => findings.has(id)))

  return [
    {
      id: "INV-DUP",
      category: "Invoice validation",
      name: "Duplicate detection",
      status: status(red && n % 17 === 0, amber && n % 13 === 0),
      detail:
        red && n % 17 === 0
          ? `Same vendor + amount + date already exists on a prior invoice. Hold until AP confirms it is not a resubmit of ${invoice.id}.`
          : `No matching vendor / amount / date hash in the open AP book. ${invoice.id} is a new document.`,
    },
    {
      id: "INV-ARITH",
      category: "Invoice validation",
      name: "Header vs line totals",
      status: status(false, amber && n % 11 === 0),
      detail:
        amber && n % 11 === 0
          ? "Line extensions add to the header, but GST rounding is one cent off the tax line. Review before posting."
          : `Line extensions plus tax reconcil to ${invoice.currency} ${invoice.amount.toLocaleString("en-AU", { minimumFractionDigits: 2 })}.`,
    },
    {
      id: "INV-BANK",
      category: "Invoice validation",
      name: "Bank account validation",
      status: status(red && n % 19 === 1),
      detail:
        red && n % 19 === 1
          ? `Remittance account ${bank} is not the registered account on the vendor master. Possible redirected payment.`
          : `Remittance account ${bank} matches the vendor master. Direct-credit path is unchanged.`,
    },
    {
      id: "INV-TAX",
      category: "Invoice validation",
      name: "Tax invoice / GST",
      status: status(false),
      detail: `ABN ${abn} is present and the tax invoice fields required for a valid Australian tax invoice are populated.`,
    },
    {
      id: "VEN-MASTER",
      category: "Vendor validation",
      name: "Vendor master verification",
      status: status(false, amber && n % 7 === 0),
      detail:
        amber && n % 7 === 0
          ? `${invoice.vendor} is active, but the trading name on the PDF does not exactly match the master record. Confirm alias mapping.`
          : `${invoice.vendor} is an active, unblocked supplier on the master with a current payment term.`,
    },
    {
      id: "VEN-ABN",
      category: "Vendor validation",
      name: "ABN and vendor identity",
      status: status(red && n % 23 === 0),
      detail:
        red && n % 23 === 0
          ? `ABN on the invoice does not match the ABN held for ${invoice.vendor}. Treat as a vendor-identity exception.`
          : `ABN ${abn} matches the registered identity for ${invoice.vendor}.`,
    },
    {
      id: "PO-EXIST",
      category: "PO validation",
      name: "PO / booking match",
      status: status(red && (findings.has("L01") || n % 9 === 2), amber),
      detail:
        red && findings.has("L01")
          ? `${poRef} exists, but the invoice covers two fulfilment units against a single-carton order.`
          : amber
            ? `${poRef} is linked, but receipt quantity is still open. Three-way match is incomplete.`
            : `${poRef} is open and uniquely matched to this invoice.`,
    },
    {
      id: "PO-PRICE",
      category: "PO validation",
      name: "Price and quantity vs PO",
      status: status(red && (findings.has("L02") || findings.has("L04")), amber && n % 5 === 1),
      detail:
        red && findings.has("L02")
          ? "Billed units or weight sit above the PO / pack-bench quantity. Price match fails on the base line."
          : red && findings.has("L04")
            ? "A second label line is not on the PO. Quantity match fails for the reprint."
            : `Qty and unit price sit within the tolerance on ${poRef}.`,
    },
    {
      id: "CON-RATE",
      category: "Contract validation",
      name: "Contracted rate card",
      status: status(contractFail && (findings.has("L02") || findings.has("P02") || findings.has("P04") || red)),
      detail:
        findings.has("L02")
          ? "Rated kilos exceed the contracted DIM / scale weight. This is the Insight dispute."
          : findings.has("P02") || findings.has("P04")
            ? "Recovery lines do not match the rate-card index or warehouse markup that was agreed."
            : red
              ? "One or more billed lines sit outside the current contract schedule. See Insight for the leakage chain."
              : "Base rates and markups match the live contract / rate card.",
    },
    {
      id: "CON-ACCESS",
      category: "Contract validation",
      name: "Accessorial entitlement",
      status: status(
        findings.has("L05") || findings.has("P01") || findings.has("P03") || findings.has("P05"),
        findings.has("L03")
      ),
      detail:
        findings.has("L05")
          ? "Residential surcharge is not entitled on a commercial POD. Contract surcharge table fails."
          : findings.has("P01") || findings.has("P03") || findings.has("P05")
            ? "A pass-through the contract requires is missing or an accessorial was absorbed. See Insight."
            : findings.has("L03")
              ? "SLA credit entitlement exists on the service guide and has not been claimed."
              : "Surcharges and pass-throughs on this invoice are within the contracted entitlements.",
    },
  ]
}

export function getProcessState(invoice: Invoice): ProcessState {
  const held = invoice.status === "red" && Boolean(invoice.agentAction)
  const nodes: ProcessNode[] = [
    { id: "captured", label: "Captured", caption: "OCR and header extract" },
    { id: "validated", label: "Validated", caption: "Mandatory agent checks" },
    {
      id: "exceptions",
      label: "Exception review",
      caption: held ? "Agent acted — on hold" : "Exceptions and Insight",
    },
    {
      id: "settlement",
      label: "Settlement",
      caption: invoice.status === "green" ? "Cleared to pay" : held ? "Payment held" : "Release to AP",
    },
  ]

  if (invoice.analysisPending) {
    return {
      nodes,
      currentIndex: 0,
      summary: `${invoice.id} has been captured. Mandatory checks have not finished running.`,
    }
  }
  if (invoice.status === "green") {
    return {
      nodes,
      currentIndex: 3,
      summary: `${invoice.id} cleared checks and contract match. It is in settlement and can post.`,
    }
  }
  if (invoice.status === "amber") {
    return {
      nodes,
      currentIndex: 2,
      summary: `${invoice.id} is in exception review. A PO, vendor, or evidence gap needs input before release.`,
    }
  }
  return {
    nodes,
    currentIndex: 2,
    summary: held
      ? `${invoice.id} failed a mandatory or contract check. The agent has acted and settlement is held.`
      : `${invoice.id} is in exception review against the contracted terms.`,
  }
}
