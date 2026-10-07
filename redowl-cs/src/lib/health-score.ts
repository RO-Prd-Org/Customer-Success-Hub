import seed from "@/data/health-matrix.json";

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
  sla: number;
  total: number;
  max: 24;
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
export const STATUS_METHODS = ["Highest", "Lead stakeholder"];
export const SENTIMENTS = [
  "Champion",
  "Advocate",
  "Supporter",
  "Champion Neutral",
  "Neutral",
  "Advocate Neutral",
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
  "Detractor Neutral": 4,
  Detractor: 5,
};

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

function ticketScore(raw: string) {
  if (!raw.trim()) return 0;
  const count = Number(raw);
  if (!Number.isFinite(count) || count < 0) return 0;
  if (count <= 7) return 1;
  if (count <= 15) return 2;
  if (count <= 23) return 3;
  return 4;
}

function slaScore(raw: string) {
  if (!raw.trim()) return 0;
  const count = Number(raw);
  if (!Number.isFinite(count) || count <= 0) return 0;
  if (count === 1) return 1;
  if (count === 2) return 2;
  return 3;
}

export function scoreHealth(input: HealthInput): HealthScore {
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
  let statusScore = 0;
  let statusBasis = "No stakeholders rated";

  if (rated.length === 0) {
    statusScore = 0;
    statusBasis = "No stakeholders rated";
  } else if (method === "Lead stakeholder") {
    const lead = stakeholders.find((row) => row.role === input.leadStakeholder);
    statusScore = lead?.score ?? 0;
    statusBasis = input.leadStakeholder
      ? `Lead: ${input.leadStakeholder}${lead?.score == null ? " (not rated)" : ""}`
      : "Lead stakeholder not set";
  } else {
    statusScore = Math.max(...rated.map((row) => row.score ?? 0));
    statusBasis = `Highest of ${rated.length} rated`;
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
  const tickets = ticketScore(input.openTickets);
  const sla = slaScore(input.slaBreaches);
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
  const healthPct = Math.round((1 - total / 24) * 100);
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
    sla,
    total,
    max: 24,
    healthPct,
    band,
  };
}

export function formatRisk(value: number) {
  const rounded = Math.round(value * 100) / 100;
  if (Number.isInteger(rounded)) return String(rounded);
  return rounded.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
}
