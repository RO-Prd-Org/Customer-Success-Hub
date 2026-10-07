import seed from "@/data/health-matrix.json";
import slaLogData from "@/data/sla-log.json";
import slaTargetData from "@/data/sla-targets.json";

export type HealthBand = "Healthy" | "Watch" | "At Risk";

export type HealthInput = {
  id: string;
  name: string;
  tier: string;
  solution: string;
  complexSolution: string;
  msaCompliant: string;
  sowCompliant: string;
  stage1: string;
  stage2: string;
  stage3: string;
  stage4: string;
  successStory: string;
  ebr: string;
  qbr: string;
  engagement: string;
  cfo: string;
  commercialAnalyst: string;
  ops1: string;
  ops2: string;
  procurement: string;
  statusMethod: string;
  leadStakeholder: string;
  expansion25: string;
  expansion60: string;
  openTickets: string;
  slaBreaches: string;
};

export type StakeholderScore = {
  role: string;
  value: string;
  score: number | null;
};

export type HealthScore = {
  msa: number;
  sow: number;
  sowImpl: number;
  successStory: number;
  ebr: number;
  qbr: number;
  engagement: number;
  stakeholders: StakeholderScore[];
  stakeholdersRated: number;
  statusBasis: string;
  statusScore: number;
  expansion: number;
  tickets: number;
  openTicketCount: number;
  sla: number;
  breachCount: number;
  total: number;
  max: number;
  healthPct: number;
  band: HealthBand;
};

export const healthSeed = seed as HealthInput[];

export const TIERS = ["Enterprise", "SMB"];
export const YES_NO = ["Yes", "No"];
export const STAGE_BINARY = ["Complete", "Not complete"];
export const STAGE_READINESS = ["Not Started", "In Progress", "Complete"];
export const ENGAGEMENT = ["Engaged", "Not engaged"];
export const EXPANSION = ["Achieved", "Not achieved"];
export const STATUS_METHODS = ["Highest", "Lead stakeholder", "Average", "Sum"];
export const SENTIMENTS = [
  "Champion",
  "Advocate",
  "Supporter",
  "Champion Neutral",
  "Neutral",
  "Advocate Neutral",
  "Supporter Neutral",
  "Detractor Neutral",
  "Detractor",
];

const SENTIMENT_SCORE: Record<string, number> = {
  Champion: 0,
  Advocate: 0,
  Supporter: 0,
  "Champion Neutral": 1,
  Neutral: 1,
  "Advocate Neutral": 2,
  "Supporter Neutral": 3,
  "Detractor Neutral": 4,
  Detractor: 5,
};

const TICKET_BANDS = [
  { from: 0, score: 1 },
  { from: 6, score: 2 },
  { from: 11, score: 3 },
  { from: 21, score: 4 },
];

const SLA_BANDS = [
  { from: 0, score: 0 },
  { from: 1, score: 1 },
  { from: 3, score: 2 },
  { from: 6, score: 3 },
];

type SlaTarget = {
  tier: string;
  severity: string;
  responseHours: number;
  resolutionHours: number;
};

export type SlaTicket = {
  rowId: string;
  id: string;
  customer: string;
  tier: string;
  severity: string;
  loggedDate: string;
  actualResponse: string;
  actualResolution: string;
  responseTarget: string;
  resolutionTarget: string;
  responseBreach: string;
  resolutionBreach: string;
  outcome: string;
  notes: string;
};

type SlaLogSeed = {
  id: string;
  customer: string;
  loggedTier: string;
  severity: string;
  loggedDate: string;
  actualResponse: number | null;
  actualResolution: number | null;
  notes: string;
};

const slaTargets = slaTargetData as SlaTarget[];

export const slaLogSeed: SlaTicket[] = (slaLogData as SlaLogSeed[]).map((ticket) => ({
  rowId: ticket.id,
  id: ticket.id,
  customer: ticket.customer,
  tier: ticket.loggedTier,
  severity: ticket.severity,
  loggedDate: ticket.loggedDate,
  actualResponse: ticket.actualResponse == null ? "" : String(ticket.actualResponse),
  actualResolution: ticket.actualResolution == null ? "" : String(ticket.actualResolution),
  responseTarget: "",
  resolutionTarget: "",
  responseBreach: "",
  resolutionBreach: "",
  outcome: ticket.loggedTier === "Enterprise" || ticket.loggedTier === "SMB" ? "" : "No tier",
  notes: ticket.notes,
}));

const LEAD_ROLES = [
  "Financial Sponsor (CFO)",
  "Commercial Analyst",
  "Operational Stakeholder 1",
  "Operational Stakeholder 2",
  "Procurement Sponsor",
] as const;

export const LEAD_STAKEHOLDERS = [...LEAD_ROLES];

function yesNoGap(value: string) {
  return value === "No" ? 1 : 0;
}

function stageBinary(value: string) {
  return value === "Not complete" ? 1 : 0;
}

function stageReadiness(value: string) {
  if (value === "Not Started") return 1;
  if (value === "In Progress") return 0.5;
  return 0;
}

function sentiment(value: string): number | null {
  if (!value) return null;
  return value in SENTIMENT_SCORE ? SENTIMENT_SCORE[value] : null;
}

function lowerBound(count: number, bands: { from: number; score: number }[]) {
  let score = bands[0]?.score ?? 0;
  for (const band of bands) {
    if (count >= band.from) score = band.score;
  }
  return score;
}

function ticketScore(raw: string) {
  if (!raw.trim()) return 0;
  const count = Number(raw);
  if (!Number.isFinite(count) || count < 0) return 0;
  return lowerBound(count, TICKET_BANDS);
}

function slaScore(count: number) {
  if (!Number.isFinite(count) || count <= 0) return 0;
  return lowerBound(count, SLA_BANDS);
}

function lookupTarget(ticket: SlaTicket) {
  return slaTargets.find((row) => row.tier === ticket.tier && row.severity === ticket.severity);
}

export const SLA_TIERS = ["Enterprise", "SMB"] as const;

export function severitiesForTier(tier: string) {
  return slaTargets.filter((row) => row.tier === tier).map((row) => row.severity);
}

export function deriveSlaTicket(ticket: SlaTicket, changed?: keyof SlaTicket): SlaTicket {
  const refreshTargets =
    !changed || changed === "tier" || changed === "severity" || changed === "actualResponse" || changed === "actualResolution";
  const refreshBreaches = refreshTargets || changed === "responseTarget" || changed === "resolutionTarget";
  const next = { ...ticket };
  if (changed === "tier" && !severitiesForTier(next.tier).includes(next.severity)) {
    next.severity = "";
  }
  if (refreshTargets) {
    const lookedUp = lookupTarget(next);
    if (lookedUp) {
      next.responseTarget = String(lookedUp.responseHours);
      next.resolutionTarget = String(lookedUp.resolutionHours);
    } else if (changed === "tier" || changed === "severity") {
      next.responseTarget = "";
      next.resolutionTarget = "";
      next.responseBreach = "";
      next.resolutionBreach = "";
    }
  }
  if (refreshBreaches) {
    const responseTarget = Number(next.responseTarget);
    const resolutionTarget = Number(next.resolutionTarget);
    if (next.actualResponse.trim() && Number.isFinite(responseTarget)) {
      next.responseBreach = Number(next.actualResponse) > responseTarget ? "Yes" : "No";
    }
    if (next.actualResolution.trim() && Number.isFinite(resolutionTarget)) {
      next.resolutionBreach = Number(next.actualResolution) > resolutionTarget ? "Yes" : "No";
    }
  }
  if (refreshBreaches || changed === "responseBreach" || changed === "resolutionBreach") {
    if (next.responseBreach === "Yes" || next.resolutionBreach === "Yes") next.outcome = "Breached";
    else if (next.responseBreach === "No" && next.resolutionBreach === "No") next.outcome = "Within target";
    else if (!next.tier.trim() || next.tier === "NOT ON MATRIX") next.outcome = "No tier";
  }
  return next;
}

function ticketCountsAsBreach(ticket: SlaTicket) {
  if (ticket.responseBreach === "Yes" || ticket.resolutionBreach === "Yes") return true;
  if (ticket.responseBreach === "No" && ticket.resolutionBreach === "No") return false;
  const derived = deriveSlaTicket(ticket);
  return derived.responseBreach === "Yes" || derived.resolutionBreach === "Yes";
}

function ticketsForCustomer(customerName: string, tickets: SlaTicket[]) {
  const name = customerName.trim().toLowerCase();
  if (!name) return [];
  return tickets.filter((ticket) => ticket.customer.trim().toLowerCase() === name);
}

function countSlaBreaches(customerName: string, tickets: SlaTicket[]) {
  return ticketsForCustomer(customerName, tickets).filter(ticketCountsAsBreach).length;
}

function countOpenTickets(customerName: string, tickets: SlaTicket[]) {
  return ticketsForCustomer(customerName, tickets).length;
}

export function blankSlaTicket(existing: SlaTicket[]): SlaTicket {
  const numbers = existing
    .map((ticket) => Number(ticket.id.replace(/\D/g, "")))
    .filter((value) => Number.isFinite(value));
  const next = Math.max(1000, ...numbers, 1000) + 1;
  return {
    rowId: `row-${next}`,
    id: `TKT-${next}`,
    customer: "",
    tier: "",
    severity: "",
    loggedDate: "",
    actualResponse: "",
    actualResolution: "",
    responseTarget: "",
    resolutionTarget: "",
    responseBreach: "",
    resolutionBreach: "",
    outcome: "",
    notes: "",
  };
}

export function scoreHealth(input: HealthInput, slaTickets: SlaTicket[] = slaLogSeed): HealthScore {
  const stakeholders: StakeholderScore[] = [
    { role: LEAD_ROLES[0], value: input.cfo, score: sentiment(input.cfo) },
    {
      role: LEAD_ROLES[1],
      value: input.commercialAnalyst,
      score: sentiment(input.commercialAnalyst),
    },
    { role: LEAD_ROLES[2], value: input.ops1, score: sentiment(input.ops1) },
    { role: LEAD_ROLES[3], value: input.ops2, score: sentiment(input.ops2) },
    {
      role: LEAD_ROLES[4],
      value: input.procurement,
      score: sentiment(input.procurement),
    },
  ];
  const rated = stakeholders.filter((row) => row.score !== null);
  const method = input.statusMethod || "Highest";
  const max = method === "Sum" ? 44 : 24;
  let statusScore = 0;
  let statusBasis = "No stakeholders rated";
  const highest = () => ({
    statusScore: Math.max(...rated.map((row) => row.score ?? 0)),
    statusBasis: `Highest of ${rated.length} rated`,
  });

  if (rated.length === 0) {
    statusScore = 0;
    statusBasis = "No stakeholders rated";
  } else if (method === "Lead stakeholder") {
    const lead = stakeholders.find((row) => row.role === input.leadStakeholder);
    if (lead?.score == null) {
      const fallback = highest();
      statusScore = fallback.statusScore;
      statusBasis = `${fallback.statusBasis} (no valid lead)`;
    } else {
      statusScore = lead.score;
      statusBasis = `Lead: ${input.leadStakeholder}`;
    }
  } else if (method === "Average") {
    statusScore = rated.reduce((sum, row) => sum + (row.score ?? 0), 0) / rated.length;
    statusBasis = `Average of ${rated.length} rated`;
  } else if (method === "Sum") {
    statusScore = rated.reduce((sum, row) => sum + (row.score ?? 0), 0);
    statusBasis = `Sum of ${rated.length} rated`;
  } else {
    const result = highest();
    statusScore = result.statusScore;
    statusBasis = result.statusBasis;
  }

  const msa = input.msaCompliant === "No" ? 1 : 0;
  const sow = yesNoGap(input.sowCompliant);
  const sowImpl =
    stageBinary(input.stage1) +
    stageReadiness(input.stage2) +
    stageBinary(input.stage3) +
    stageBinary(input.stage4);
  const successStory = input.successStory === "Yes" ? 1 : 0;
  const ebr = yesNoGap(input.ebr);
  const qbr = yesNoGap(input.qbr);
  const engagement = input.engagement === "Not engaged" ? 1 : 0;
  const expansion = [input.expansion25, input.expansion60].filter(
    (value) => value === "Not achieved",
  ).length;
  const openTicketCount = countOpenTickets(input.name, slaTickets);
  const tickets = ticketScore(String(openTicketCount));
  const breachCount = countSlaBreaches(input.name, slaTickets);
  const sla = slaScore(breachCount);
  const total =
    msa +
    sow +
    sowImpl +
    successStory +
    ebr +
    qbr +
    engagement +
    statusScore +
    expansion +
    tickets +
    sla;
  const healthPct = Math.round((1 - total / max) * 100);
  const band: HealthBand =
    healthPct >= 75 ? "Healthy" : healthPct >= 50 ? "Watch" : "At Risk";

  return {
    msa,
    sow,
    sowImpl,
    successStory,
    ebr,
    qbr,
    engagement,
    stakeholders,
    stakeholdersRated: rated.length,
    statusBasis,
    statusScore,
    expansion,
    tickets,
    openTicketCount,
    sla,
    breachCount,
    total,
    max,
    healthPct,
    band,
  };
}

export function formatRisk(value: number) {
  const rounded = Math.round(value * 100) / 100;
  if (Number.isInteger(rounded)) return String(rounded);
  return rounded.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
}

export function bandSurface(band: string) {
  if (band === "Healthy") return "border-transparent bg-emerald-50 text-emerald-700";
  if (band === "Watch") return "border-transparent bg-amber-50 text-amber-800";
  return "border-transparent bg-destructive/10 text-destructive";
}
