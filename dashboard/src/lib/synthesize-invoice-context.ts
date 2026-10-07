import {
  getConversationsForInvoice,
  type Conversation,
  type ConversationMessage,
} from "@/lib/demo-conversations"
import type { DemoInstanceId } from "@/lib/demo-instances"
import type { Invoice, InvoiceIssue } from "@/lib/demo-invoices"

type CarrierDesk = {
  label: string
  greeting: string
  inbox: string
  specialists: Array<{ name: string; email: string; title: string }>
}

const CARRIER_DESKS: Record<string, CarrierDesk> = {
  fedex: {
    label: "FedEx Australia Billing",
    greeting: "FedEx Revenue Assurance & Accounts Team",
    inbox: "billing@fedex.com.au",
    specialists: [
      {
        name: "David Chen",
        email: "dchen@fedex.com.au",
        title: "Senior Revenue Assurance Specialist | FedEx Australia",
      },
      {
        name: "Amina Shah",
        email: "ashah@fedex.com.au",
        title: "Billing Exceptions Lead | FedEx Australia",
      },
    ],
  },
  dhl: {
    label: "DHL Express Billing",
    greeting: "DHL Rating Desk & Accounts Team",
    inbox: "accounts@dhl.com",
    specialists: [
      {
        name: "Markus Bauer",
        email: "mbauer@dhl.com",
        title: "Senior Revenue Assurance Specialist | DHL Express",
      },
      {
        name: "Sophie Lang",
        email: "slang@dhl.com",
        title: "Claims Coordinator | DHL Express",
      },
    ],
  },
  australiapost: {
    label: "Australia Post Merchant Desk",
    greeting: "Australia Post Merchant Billing Team",
    inbox: "billing@auspost.com.au",
    specialists: [
      {
        name: "Priya Nair",
        email: "pnair@auspost.com.au",
        title: "Merchant Claims Specialist | Australia Post",
      },
      {
        name: "Tom Walsh",
        email: "twalsh@auspost.com.au",
        title: "Revenue Assurance | Australia Post",
      },
    ],
  },
}

const OPS_CONTACTS = [
  {
    name: "Marcus Vance",
    email: "dc.melbourne@redowl.io",
    title: "Warehouse Operations Lead | Melbourne DC",
  },
  {
    name: "Elena Rossi",
    email: "dc.sydney@redowl.io",
    title: "Outbound Lead | Eastern Creek DC",
  },
  {
    name: "Jonah Hale",
    email: "dc.brisbane@redowl.io",
    title: "Pack-bench Supervisor | Brisbane North",
  },
] as const

type InternalDesk = {
  name: string
  email: string
  title: string
}

const FREIGHT_OPS_DESKS: readonly InternalDesk[] = [
  {
    name: "Dave Miller",
    email: "control.tower@redowl.io",
    title: "Control Tower Supervisor | RedOwl Logistics",
  },
  {
    name: "Marcus Vance",
    email: "operations@redowl.io",
    title: "Freight Operations | RedOwl Logistics",
  },
]

const COMMERCIAL_DESKS: readonly InternalDesk[] = [
  {
    name: "Sarah Jenkins",
    email: "commercial.manager@redowl.io",
    title: "Commercial Manager | RedOwl Logistics",
  },
  {
    name: "Sarah Jenkins",
    email: "commercial@redowl.io",
    title: "Commercial Manager | RedOwl Logistics",
  },
]

const KAM_DESKS: readonly InternalDesk[] = [
  {
    name: "Elena Rostova",
    email: "account.executive@redowl.io",
    title: "Key Account Manager | RedOwl Logistics",
  },
  {
    name: "Elena Rostova",
    email: "sales@redowl.io",
    title: "Sales / Key Account Management | RedOwl Logistics",
  },
]

const FINANCE_AP_DESKS: readonly InternalDesk[] = [
  {
    name: "Karen Taylor",
    email: "billing@redowl.io",
    title: "Finance & Billing Specialist | RedOwl Logistics",
  },
  {
    name: "Mei Chen",
    email: "finance.ap@redowl.io",
    title: "AP Controller | RedOwl Logistics",
  },
]

const LOGISTICS_INTERNAL_PARTIES = [
  "RedOwl Agent",
  "Freight Operations",
  "Commercial Team",
  "Key Account Management",
  "Finance AP",
] as const

const LOGISTICS_TEAM_INBOXES = [
  [
    "control.tower@redowl.io",
    "commercial.manager@redowl.io",
    "account.executive@redowl.io",
    "billing@redowl.io",
  ],
  [
    "operations@redowl.io",
    "commercial@redowl.io",
    "sales@redowl.io",
    "finance.ap@redowl.io",
  ],
  [
    "operations@redowl.io",
    "commercial.manager@redowl.io",
    "sales@redowl.io",
    "finance.ap@redowl.io",
  ],
] as const

const LOGISTICS_GREETINGS = [
  "Hi Operations, Commercial, KAM & Finance AP,",
  "Hi Freight Ops, Commercial, Sales & Finance AP,",
  "Hi Control Tower, Commercial & Finance AP,",
] as const

function seed(invoiceId: string): number {
  const digits = Number(invoiceId.replace(/\D/g, "") || 0)
  return (digits * 1664525 + 1013904223) >>> 0
}

function pick<T>(items: readonly T[], n: number, salt = 0): T {
  return items[(n + salt * 17) % items.length]
}

function money(value: number, currency = "AUD"): string {
  return `${currency} ${value.toLocaleString("en-AU", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

function pad(prefix: string, n: number): string {
  return `${prefix}-${String(n % 1_000_000).padStart(6, "0")}`
}

function displayDate(value: string): string {
  const raw = value.slice(0, 10)
  const date = new Date(`${raw}T00:00:00`)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

function aedt(invoiceDate: string, dayOffset: number, hour: number, minute: number): string {
  const raw = /^\d{4}-\d{2}-\d{2}/.exec(invoiceDate)?.[0] ?? "2026-03-01"
  const [year, month, day] = raw.split("-").map(Number)
  const utc = Date.UTC(year, month - 1, day) + dayOffset * 86_400_000
  const next = new Date(utc)
  const yyyy = next.getUTCFullYear()
  const mm = String(next.getUTCMonth() + 1).padStart(2, "0")
  const dd = String(next.getUTCDate()).padStart(2, "0")
  return `${yyyy}-${mm}-${dd}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00+11:00`
}

function vendorKey(vendor: string): string {
  return vendor.replace(/[\s_-]/g, "").toLowerCase()
}

function carrierDesk(vendor: string): CarrierDesk {
  const key = vendorKey(vendor)
  if (key.includes("fedex")) return CARRIER_DESKS.fedex
  if (key.includes("dhl")) return CARRIER_DESKS.dhl
  if (key.includes("auspost") || key.includes("australiapost")) {
    return CARRIER_DESKS.australiapost
  }
  const slug = vendor.toLowerCase().replace(/[^a-z0-9]+/g, "") || "carrier"
  return {
    label: `${vendor} Billing`,
    greeting: `${vendor} Rating Desk & Accounts Team`,
    inbox: `billing@${slug}.com.au`,
    specialists: [
      {
        name: "Alex Moretti",
        email: `accounts@${slug}.com.au`,
        title: `Revenue Assurance | ${vendor}`,
      },
    ],
  }
}

function recoverableTotal(issues: InvoiceIssue[] | undefined): number {
  return (issues ?? [])
    .filter((issue) => issue.recoverable !== false)
    .reduce((sum, issue) => sum + issue.amount, 0)
}

function issueLine(issue: InvoiceIssue): string {
  return `${issue.type} (${money(issue.amount)})`
}

function truncateWords(text: string, max = 72): string {
  if (text.length <= max) return text
  const cut = text.slice(0, max)
  const stop = cut.lastIndexOf(" ")
  return `${(stop > 40 ? cut.slice(0, stop) : cut).trim()}…`
}

function headline(invoice: Invoice): string {
  if (invoice.issues?.[0]?.type) return invoice.issues[0].type
  const blob = `${invoice.reasoning} ${invoice.agentAction ?? ""}`
  if (invoice.status === "amber" && !invoice.issues?.length) {
    if (/rate discrepanc/i.test(blob)) return "Rate discrepancy — clarification"
    if (/missing|cannot|join|evidence/i.test(blob)) return "Missing join evidence"
    return "Clarification needed"
  }
  const action = invoice.agentAction?.replace(/\.$/, "").trim()
  if (action) return truncateWords(action.split(/,(?=\s)/)[0] ?? action)
  if (invoice.status === "green") return "Cleared within tolerance"
  return "Billing review"
}

function excerpt(text: string, max = 280): string {
  const trimmed = text.replace(/\s+/g, " ").trim()
  if (!trimmed) return ""
  if (trimmed.length <= max) return trimmed
  const cut = trimmed.slice(0, max)
  const stop = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf(" "))
  return `${(stop > 80 ? cut.slice(0, stop) : cut).trim()}…`
}

function findRef(sources: string[], prefix: string, fallback: string): string {
  const pattern = new RegExp(`${prefix}-\\d+`, "i")
  for (const source of sources) {
    const match = pattern.exec(source)
    if (match) return match[0].toUpperCase().replace(prefix.toUpperCase(), prefix)
  }
  return fallback
}

function factLines(invoice: Invoice, limit = 3): string[] {
  return (invoice.issues ?? [])
    .flatMap((issue) => issue.facts.map((fact) => fact.text))
    .filter(Boolean)
    .slice(0, limit)
}

function issueSummary(invoice: Invoice): string {
  if (!invoice.issues?.length) return invoice.reasoning
  return invoice.issues.map(issueLine).join("; ")
}

function agentFrom(): string {
  return "RedOwl Agent (audit-agent@redowl.io)"
}

function deskLine(desk: InternalDesk): string {
  return `${desk.name} (${desk.email})`
}

function accountLabel(invoice: Invoice): string {
  const raw = invoice.vendor?.trim() || "this account"
  if (/^[A-Z0-9]+(?:-[A-Z0-9]+)+$/.test(raw)) {
    return raw
      .split("-")
      .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
      .join(" ")
  }
  return raw
}

export function resolveInvoiceConversations(
  demoId: DemoInstanceId,
  invoice: Invoice
): Conversation[] {
  const existing = getConversationsForInvoice(demoId, invoice.id)
  if (existing.length > 0) return existing
  if (invoice.analysisPending) return []
  return [synthesizeInvoiceConversation(demoId, invoice)]
}

export function synthesizeInvoiceConversation(
  demoId: DemoInstanceId,
  invoice: Invoice
): Conversation {
  return demoId === "fashion"
    ? synthesizeFashionConversation(invoice)
    : synthesizeLogisticsConversation(invoice)
}

function synthesizeFashionConversation(invoice: Invoice): Conversation {
  const n = seed(invoice.id)
  const desk = carrierDesk(invoice.vendor)
  const specialist = pick(desk.specialists, n, 1)
  const ops = pick(OPS_CONTACTS, n, 2)
  const leakage = recoverableTotal(invoice.issues)
  const numeric = Number(invoice.id.replace(/\D/g, "") || n)
  const tracking = findRef(
    [invoice.reasoning, invoice.agentAction ?? "", ...factLines(invoice, 6)],
    "TRK",
    pad("TRK", numeric)
  )
  const lineRef = findRef(
    [invoice.reasoning, invoice.agentAction ?? "", ...factLines(invoice, 6)],
    "CIL",
    pad("CIL", numeric)
  )
  const auditRef = `AUDIT-2026-${200 + (n % 800)}`
  const creditRef = `CN-${desk.label.slice(0, 3).toUpperCase()}-${8000 + (n % 900)}`
  const hours = [8, 9, 10, 11]
  const startHour = pick(hours, n, 3)
  const startMin = [1, 7, 14, 22, 36][n % 5]
  const dayShift = n % 3 === 0 ? 0 : 1

  const status: Conversation["status"] =
    invoice.status === "green"
      ? "resolved"
      : invoice.status === "amber"
        ? n % 2 === 0
          ? "awaiting_reply"
          : "open"
        : (["open", "awaiting_reply", "resolved"] as const)[n % 3]

  const t1 = aedt(invoice.invoiceDate, dayShift, startHour, startMin)
  const t2 = aedt(invoice.invoiceDate, dayShift, startHour + 2, (startMin + 11) % 60)
  const t3 = aedt(invoice.invoiceDate, dayShift, startHour + 5, (startMin + 27) % 60)
  const t4 = aedt(invoice.invoiceDate, dayShift + 1, 9, (startMin + 4) % 60)

  const messages: ConversationMessage[] = []
  const prefix = `syn-${invoice.id}`

  if (invoice.status === "green") {
    messages.push({
      id: `${prefix}-m1`,
      from: agentFrom(),
      to: ["ap@redowl.io"],
      sentAt: t1,
      body: [
        `Hi Logistics AP,`,
        ``,
        `Automated audit of carrier invoice ${invoice.id} (${invoice.vendor}, ${displayDate(invoice.invoiceDate)}) cleared within tolerance.`,
        ``,
        `Assessment: ${excerpt(invoice.reasoning, 320) || "No recoverable leakage on the cited lines."}`,
        ``,
        `No dispute opened. Invoice can proceed to settlement.`,
        ``,
        `Kind regards,`,
        `RedOwl Autonomous Claims & Billing Agent`,
        `audit-agent@redowl.io`,
      ].join("\n"),
    })
    messages.push({
      id: `${prefix}-m2`,
      from: "Mei Chen (finance.ap@redowl.io)",
      to: ["audit-agent@redowl.io"],
      sentAt: t2,
      body: [
        `Hi Agent,`,
        ``,
        `Noted — ${invoice.id} released from exception review. Payment run can include this ${invoice.vendor} bill.`,
        ``,
        `Mei Chen`,
        `AP Controller | RedOwl Ops`,
      ].join("\n"),
    })
  } else if (invoice.status === "amber") {
    messages.push({
      id: `${prefix}-m1`,
      from: agentFrom(),
      to: [desk.inbox, "ap@redowl.io"],
      sentAt: t1,
      body: [
        `Hi ${desk.greeting},`,
        ``,
        `RedOwl's billing audit of carrier invoice ${invoice.id} found a variance that is not yet closed as a recoverable finding.`,
        ``,
        `Review summary:`,
        `• Invoice: ${invoice.id} dated ${displayDate(invoice.invoiceDate)} for ${money(invoice.amount, invoice.currency)}`,
        `• Carrier / line: ${invoice.vendor} · ${lineRef} · ${tracking}`,
        `• Open question: ${excerpt(invoice.reasoning, 360)}`,
        ``,
        invoice.agentAction
          ? `Action requested: ${invoice.agentAction}`
          : `Please supply rating support (contract rule + TMS quote) so we can confirm or release the hold.`,
        ``,
        `AP has parked ${invoice.id} in exception review. We will not release payment until the discrepancy is explained or credited.`,
        ``,
        `Kind regards,`,
        `RedOwl Autonomous Claims & Billing Agent`,
        `Logistics Audit Division | RedOwl Ops`,
        `audit-agent@redowl.io`,
      ].join("\n"),
    })
    messages.push({
      id: `${prefix}-m2`,
      from: `${specialist.name} (${specialist.email})`,
      to: ["audit-agent@redowl.io"],
      sentAt: t2,
      body: [
        `Hi RedOwl Audit Team,`,
        ``,
        `We have ${invoice.id} / ${tracking} in our exceptions queue. The billed profile is what our rater produced for that lane.`,
        ``,
        `Can you send the TMS rate-shop record and the contract rule you are holding us to? We will compare and come back with a credit or a rating note.`,
        ``,
        `Regards,`,
        `${specialist.name}`,
        specialist.title,
      ].join("\n"),
    })
    if (n % 2 === 1) {
      messages.push({
        id: `${prefix}-m3`,
        from: "Mei Chen (finance.ap@redowl.io)",
        to: ["audit-agent@redowl.io", specialist.email],
        sentAt: t3,
        body: [
          `Internal note — ${invoice.id} stays on AP hold.`,
          ``,
          `Amber until ${invoice.vendor} answers the rating question. No short-pay until the agent upgrades this to a closed finding.`,
          ``,
          `Mei Chen`,
          `AP Controller | RedOwl Ops`,
        ].join("\n"),
      })
    }
  } else {
    const category = headline(invoice)
    messages.push({
      id: `${prefix}-m1`,
      from: agentFrom(),
      to: [desk.inbox, "ap@redowl.io"],
      sentAt: t1,
      body: [
        `Hi ${desk.greeting},`,
        ``,
        `RedOwl's automated billing audit of carrier invoice ${invoice.id} identified recoverable leakage on line ${lineRef} (tracking ${tracking}).`,
        ``,
        `Discrepancy Summary:`,
        `• Audit Category: ${category}`,
        `• Issues Flagged: ${issueSummary(invoice)}`,
        `• Financial Variance: ${money(leakage || invoice.amount * 0.08, invoice.currency)} recoverable on ${invoice.id}`,
        `• Invoice total: ${money(invoice.amount, invoice.currency)} dated ${displayDate(invoice.invoiceDate)}`,
        ``,
        excerpt(invoice.reasoning, 340),
        ``,
        invoice.agentAction
          ? `Action taken: ${invoice.agentAction}`
          : `We have placed the cited lines on payment hold pending credit.`,
        ``,
        `Please place ${lineRef} on hold and issue a credit note for the variance. Pack-bench / POD evidence is attached to this audit record.`,
        ``,
        `Kind regards,`,
        `RedOwl Autonomous Claims & Billing Agent`,
        `Logistics Audit Division | RedOwl Ops`,
        `audit-agent@redowl.io`,
      ].join("\n"),
    })

    const vendorReply: ConversationMessage = {
      id: `${prefix}-m2`,
      from: `${specialist.name} (${specialist.email})`,
      to: ["audit-agent@redowl.io"],
      sentAt: t2,
      body: [
        `Hi RedOwl Audit Team,`,
        ``,
        `Thank you for raising this dispute on ${invoice.id}, line ${lineRef}.`,
        ``,
        `Our rater logged ${tracking} against the billed profile. We can adjust if you send pack-bench weight / POD / void-label proof for the lines you named.`,
        ``,
        `Regards,`,
        `${specialist.name}`,
        specialist.title,
        specialist.email,
      ].join("\n"),
    }

    const facts = factLines(invoice, 3)
    const opsReply: ConversationMessage = {
      id: `${prefix}-m3`,
      from: `${ops.name} (${ops.email})`,
      to: [specialist.email, "audit-agent@redowl.io"],
      sentAt: t3,
      body: [
        `Hi ${specialist.name},`,
        ``,
        `Ops confirming the warehouse file for ${invoice.id} / ${tracking}:`,
        ...(facts.length > 0
          ? facts.map((fact) => `• ${fact}`)
          : [
              `• Pack-bench and manifest for this consignment do not support the billed profile.`,
              `• Camera / scale log uploaded against ${pad("WMS-PK", numeric)}.`,
            ]),
        ``,
        `Happy to jump on a short call if billing needs the raw frames.`,
        ``,
        `Thanks,`,
        `${ops.name}`,
        ops.title,
      ].join("\n"),
    }

    const closeCredit: ConversationMessage = {
      id: `${prefix}-m4`,
      from: `${specialist.name} (${specialist.email})`,
      to: ["audit-agent@redowl.io", "ap@redowl.io"],
      sentAt: t4,
      body: [
        `Hi RedOwl Team,`,
        ``,
        `Evidence accepted on ${invoice.id}. We have adjusted ${tracking} and issued credit note ${creditRef} for ${money(leakage || 0, invoice.currency)}.`,
        ``,
        `Best regards,`,
        `${specialist.name}`,
        specialist.title,
      ].join("\n"),
    }

    const holdNote: ConversationMessage = {
      id: `${prefix}-m2`,
      from: "Mei Chen (finance.ap@redowl.io)",
      to: ["audit-agent@redowl.io"],
      sentAt: t2,
      body: [
        `Internal AP note`,
        ``,
        `${invoice.id} is on payment hold. Agent opened the ${invoice.vendor} dispute; we will not release until a credit posts or the finding is withdrawn.`,
        ``,
        `Mei Chen`,
        `AP Controller | RedOwl Ops`,
      ].join("\n"),
    }

    if (status === "resolved") {
      messages.push(vendorReply, opsReply, closeCredit)
    } else if (status === "awaiting_reply") {
      messages.push(vendorReply)
      if (n % 2 === 0) messages.push(opsReply)
    } else if (n % 2 === 0) {
      messages.push(vendorReply)
    } else {
      messages.push(holdNote)
    }
  }

  const updatedAt = messages[messages.length - 1]?.sentAt ?? t1
  const subjectPrefix = invoice.status === "green" ? "CLEARED" : invoice.status === "amber" ? "REVIEW" : "DISPUTE"

  return {
    id: `syn-fashion-${invoice.id}`,
    invoiceId: invoice.id,
    subject: `${subjectPrefix} [${invoice.id}]: ${headline(invoice)} — ${invoice.vendor} [Ref: ${auditRef}]`,
    status,
    parties:
      invoice.status === "green"
        ? ["RedOwl Agent", "Logistics AP"]
        : ["RedOwl Agent", desk.label, "Melbourne DC Ops", "Logistics AP"],
    issue: excerpt(issueSummary(invoice), 160),
    updatedAt,
    messages,
  }
}

function synthesizeLogisticsConversation(invoice: Invoice): Conversation {
  const n = seed(invoice.id)
  const ops = pick(FREIGHT_OPS_DESKS, n, 2)
  const commercial = pick(COMMERCIAL_DESKS, n, 3)
  const kam = pick(KAM_DESKS, n, 4)
  const finance = pick(FINANCE_AP_DESKS, n, 5)
  const teamTo = [...pick(LOGISTICS_TEAM_INBOXES, n, 6)]
  const greeting = pick(LOGISTICS_GREETINGS, n, 7)
  const account = accountLabel(invoice)
  const leakage = recoverableTotal(invoice.issues)
  const numeric = Number(invoice.id.replace(/\D/g, "") || n)
  const sources = [invoice.reasoning, invoice.agentAction ?? "", ...factLines(invoice, 8)]
  const job = findRef(sources, "JOB", pad("JOB", numeric))
  const shipment = findRef(sources, "SHP", pad("SHP", numeric))
  const subInvoice = findRef(sources, "SINV", pad("SINV", numeric))
  const booking = findRef(sources, "BKG", pad("BKG", 10_000 + Math.max(numeric - 1, 0)))
  const draftRecovery = `HOLD-${String(3000 + (n % 6000)).padStart(4, "0")}`
  const auditRef = `LOG-AUDIT-2026-${300 + (n % 800)}`
  const startHour = pick([8, 9, 10], n, 4)
  const startMin = [2, 9, 18, 27, 41][n % 5]
  const dayShift = n % 4 === 0 ? 0 : 1

  const status: Conversation["status"] =
    invoice.status === "green"
      ? "resolved"
      : invoice.status === "amber"
        ? "awaiting_reply"
        : (["open", "awaiting_reply", "resolved"] as const)[n % 3]

  const t1 = aedt(invoice.invoiceDate, dayShift, startHour, startMin)
  const t2 = aedt(invoice.invoiceDate, dayShift, startHour + 2, (startMin + 13) % 60)
  const t3 = aedt(invoice.invoiceDate, dayShift, startHour + 5, (startMin + 31) % 60)
  const t4 = aedt(invoice.invoiceDate, dayShift + 1, 10, (startMin + 6) % 60)

  const messages: ConversationMessage[] = []
  const prefix = `syn-${invoice.id}`
  const recovery = money(leakage || invoice.amount * 0.09, invoice.currency)
  const commercialOrKam = n % 2 === 0 ? commercial : kam

  if (invoice.status === "green") {
    messages.push({
      id: `${prefix}-m1`,
      from: agentFrom(),
      to: ["operations@redowl.io", "finance.ap@redowl.io", "billing@redowl.io"],
      sentAt: t1,
      body: [
        `Hi Freight Ops & Finance AP,`,
        ``,
        `Internal cross-match on ${invoice.id} (${account} account, ${displayDate(invoice.invoiceDate)}) reconciled. Receivables cover the tagged costs on ${job} / ${shipment}.`,
        ``,
        excerpt(invoice.reasoning, 300) || "No unrecovered pass-through on this statement.",
        ``,
        `No customer contact. No outbound recovery. Subcontractor approval can proceed.`,
        ``,
        `Kind regards,`,
        `RedOwl Autonomous Revenue Audit Agent`,
        `audit-agent@redowl.io`,
      ].join("\n"),
    })
    messages.push({
      id: `${prefix}-m2`,
      from: deskLine(finance),
      to: ["audit-agent@redowl.io", ops.email],
      sentAt: t2,
      body: [
        `Hi Agent,`,
        ``,
        `${invoice.id} marked matched on the internal AP book. Nothing to post and nothing sent outside RedOwl.`,
        ``,
        finance.name,
        finance.title,
      ].join("\n"),
    })
  } else if (invoice.status === "amber") {
    messages.push({
      id: `${prefix}-m1`,
      from: agentFrom(),
      to: teamTo,
      sentAt: t1,
      body: [
        greeting,
        ``,
        `Internal audit of ${invoice.id} on the ${account} account cannot close until the operational join is complete. Keep this thread RedOwl-only — do not email customer AP.`,
        ``,
        `Open gap: ${excerpt(invoice.reasoning, 360)}`,
        ``,
        `Refs on file: ${job} · ${shipment} · ${booking} · ${subInvoice}`,
        ``,
        `Ops: need dispatch / manifest / tag identifiers on ${shipment} before Commercial can read the rate card.`,
        ``,
        `Finance AP: leave ${subInvoice || invoice.id} visible in the amber queue. No customer-facing recovery.`,
        ``,
        `Kind regards,`,
        `RedOwl Autonomous Revenue Audit Agent`,
        `Freight Leakage Control | RedOwl Logistics`,
        `audit-agent@redowl.io`,
      ].join("\n"),
    })
    messages.push({
      id: `${prefix}-m2`,
      from: deskLine(ops),
      to: ["audit-agent@redowl.io", commercial.email, finance.email],
      sentAt: t2,
      body: [
        `Hi Team,`,
        ``,
        `Freight Ops / Control Tower is pulling telematics and the dispatch file for ${shipment} on ${job}.`,
        ``,
        `Will not raise anything with the ${account} account. Commercial, stand by on the rate card until the join is clean.`,
        ``,
        ops.name,
        ops.title,
      ].join("\n"),
    })
    if (n % 3 === 0) {
      messages.push({
        id: `${prefix}-m3`,
        from: deskLine(finance),
        to: [ops.email, "audit-agent@redowl.io"],
        sentAt: t3,
        body: [
          `AP hold note: ${invoice.id} / ${subInvoice} stays in the internal amber queue.`,
          ``,
          `Pass-through checklist still applies on the next ${account} booking. Nothing posted outbound until the agent upgrades this finding.`,
          ``,
          finance.name,
          finance.title,
        ].join("\n"),
      })
    }
  } else {
    messages.push({
      id: `${prefix}-m1`,
      from: agentFrom(),
      to: teamTo,
      sentAt: t1,
      body: [
        greeting,
        ``,
        `Internal pass-through gap on ${invoice.id} / ${shipment} (job ${job}, ${account} account). Investigate in-house — ops, commercial, KAM, finance AP only. Do not email customer billing.`,
        ``,
        `Audit findings:`,
        `• Category: ${headline(invoice)}`,
        `• Issues: ${issueSummary(invoice)}`,
        `• Recoverable if we post internally: ${recovery}`,
        `• Related payable: ${subInvoice} · Booking ${booking}`,
        `• Invoice dated ${displayDate(invoice.invoiceDate)} for ${money(invoice.amount, invoice.currency)}`,
        ``,
        excerpt(invoice.reasoning, 340),
        ``,
        `Please untangle before anything is posted:`,
        `1. Ops — telematics / gantry / dwell / WMS against ${shipment}.`,
        `2. Commercial — rate card pass-through / accessorial clause.`,
        `3. KAM — account implication only; no customer outreach.`,
        `4. Finance AP — hold ${subInvoice} and park draft recovery ${draftRecovery}. Do not release a customer invoice.`,
        ``,
        `Kind regards,`,
        `RedOwl Autonomous Revenue Audit Agent`,
        `Freight Leakage Control | RedOwl Logistics`,
        `audit-agent@redowl.io`,
      ].join("\n"),
    })

    const facts = factLines(invoice, 3)
    const opsReply: ConversationMessage = {
      id: `${prefix}-m2`,
      from: deskLine(ops),
      to: ["audit-agent@redowl.io", commercial.email, kam.email, finance.email],
      sentAt: t2,
      body: [
        `Hi Team,`,
        ``,
        `Ops / Control Tower checked telematics and the operational file for ${shipment} on ${job}.`,
        ``,
        ...(facts.length > 0
          ? facts.map((fact) => `• ${fact}`)
          : [
              `• GPS / gantry / dwell on this run supports the tagged cost.`,
              `• TMS still shows the ${account} receivable as freight-only — pass-through codes were not applied.`,
            ]),
        ``,
        `Charge looks operationally real. Commercial, please confirm the rate card before Finance posts an internal recovery. No customer contact from this desk.`,
        ``,
        `Thanks,`,
        ops.name,
        ops.title,
        ops.email,
      ].join("\n"),
    }

    const commercialReply: ConversationMessage = {
      id: `${prefix}-m3`,
      from: deskLine(commercialOrKam),
      to: [ops.email, finance.email, "audit-agent@redowl.io"],
      sentAt: t3,
      body: [
        `Hi ${ops.name.split(" ")[0]} & Team,`,
        ``,
        `Reviewed the ${account} rate card against ${invoice.id} / ${shipment}.`,
        ``,
        `Commercial / KAM:`,
        `• Pass-through / accessorial language covers this class of cost if Ops evidence holds.`,
        `• Account implication: absorbing ${recovery} is a margin leak on ${job}.`,
        `• We will not raise it with customer AP. Keep recovery on the internal ledger until this thread closes.`,
        ``,
        `Finance AP, park ${draftRecovery} (${recovery}) against ${invoice.id} and keep ${subInvoice} on hold.`,
        ``,
        commercialOrKam.name,
        commercialOrKam.title,
        commercialOrKam.email,
      ].join("\n"),
    }

    const financeClose: ConversationMessage = {
      id: `${prefix}-m4`,
      from: deskLine(finance),
      to: ["audit-agent@redowl.io", ops.email, commercial.email, kam.email],
      sentAt: t4,
      body: [
        `Hi Team,`,
        ``,
        `Finance AP: recovery ${recovery} for ${invoice.id} / ${shipment} is posted to the internal hold (${draftRecovery}). Customer billing has not been contacted and nothing has been released outbound.`,
        ``,
        `${subInvoice} stays matched on the payable side. We will only lift the hold after this internal thread closes.`,
        ``,
        finance.name,
        finance.title,
        finance.email,
      ].join("\n"),
    }

    if (status === "resolved") {
      messages.push(opsReply, commercialReply, financeClose)
    } else if (status === "awaiting_reply") {
      messages.push(opsReply)
      if (n % 2 === 1) messages.push(commercialReply)
    } else {
      messages.push(n % 2 === 0 ? opsReply : commercialReply)
    }
  }

  const updatedAt = messages[messages.length - 1]?.sentAt ?? t1
  const gap =
    invoice.status === "green"
      ? `cleared match on ${invoice.id} / ${shipment}`
      : invoice.status === "amber"
        ? `join gap on ${invoice.id} / ${shipment}`
        : `pass-through gap on ${invoice.id} / ${shipment}`
  const subjectPrefix =
    invoice.status === "green"
      ? "INTERNAL MATCH"
      : invoice.status === "amber"
        ? "INTERNAL REVIEW"
        : "INTERNAL RECOVERY"

  return {
    id: `syn-logistics-${invoice.id}`,
    invoiceId: invoice.id,
    subject: `${subjectPrefix} [${invoice.id}]: ${gap} [Ref: ${auditRef}]`,
    status,
    parties: [...LOGISTICS_INTERNAL_PARTIES],
    issue: excerpt(issueSummary(invoice), 160),
    updatedAt,
    messages,
  }
}
