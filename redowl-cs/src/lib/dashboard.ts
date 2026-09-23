import raw from "@/data/dashboard.json";

export type MonthlyForecast = {
  month: string;
  label: string;
  mostLikely: number;
  upside: number;
  total: number;
  weighted: number;
  count: number;
};

export type PipelineDeal = {
  opportunity: string;
  value: number;
  stage: string;
  probability: number;
  createdDate: string | null;
  closeMonth: string | null;
  useCase: string;
  forecastType: string;
  customerType: string;
  statusComments: string;
  dealCycleMonths: number;
  weightedArr: number;
};

export type Implementation = {
  customer: string;
  salesStage: string;
  salesRank: number;
  inImplementation: boolean;
  sandboxStage: string;
  sandboxStageNo: number;
  pctComplete: number;
  owner: string;
  sandboxStart: string | null;
  lastStageChange: string | null;
  targetLive: string | null;
  daysInStage: number;
  daysToTarget: number | null;
  rag: string;
  arr: number;
  blocker: string;
};

export type DashboardData = {
  meta: {
    company: string;
    title: string;
    fiscalYear: string;
    asAt: string;
    source: string;
  };
  kpis: {
    fy26ArrTarget: number;
    ytdArr: number;
    grossPipeline: number;
    weightedPipeline: number;
    forecastPath: number;
    weightedForecast: number;
    newDemos: number;
    newOpportunities: number;
    targetIcpCustomers: number;
    newLogosTarget: number;
    fourRqOpportunities: number;
    fourRqMovement: number;
    implementations: number;
    sandboxLive: number;
    avgBuildProgress: number;
    withCustomer: number;
    implementationsGreen: number;
    implementationsAmber: number;
    implementationsRed: number;
    implementationsComplete: number;
    pipelineWow: number;
    forecastPathWow: number;
    weightedWow: number;
    riskAdjustedGap: number;
    abbDependency: number;
  };
  monthlyForecast: MonthlyForecast[];
  forecastPathDeals: {
    opportunity: string;
    grossArr: number;
    probability: number;
    weightedArr: number;
    closeMonth: string;
    notes: string;
  }[];
  pipeline: PipelineDeal[];
  implementations: Implementation[];
  newOpportunitiesAug: {
    opportunity: string;
    icp: string;
    useCase: string;
    grossArr: number;
    closeMonth: string;
  }[];
  sdrPerformance: {
    name: string;
    role: string;
    calls: number;
    demos: number;
    opportunities: number;
    pipeline: number;
    hours: number;
  }[];
  priorities: string[];
};

export const dashboard = raw as DashboardData;

export const fy26Elapsed =
  (new Date(`${dashboard.meta.asAt}T00:00:00`).getTime() -
    new Date("2026-01-01T00:00:00").getTime()) /
  (new Date("2026-12-31T00:00:00").getTime() -
    new Date("2026-01-01T00:00:00").getTime());

export const ytdAttainment =
  dashboard.kpis.ytdArr / dashboard.kpis.fy26ArrTarget;

export const pipelineCoverage =
  dashboard.kpis.grossPipeline / dashboard.kpis.fy26ArrTarget;

export const remainingToTarget =
  dashboard.kpis.fy26ArrTarget - dashboard.kpis.ytdArr;

export const demoToOpp =
  dashboard.kpis.newOpportunities / dashboard.kpis.newDemos;

export const newOppValue = dashboard.newOpportunitiesAug.reduce(
  (sum, deal) => sum + deal.grossArr,
  0,
);

export const stages = [
  "Prospect",
  "Discovery",
  "Demo",
  "Commercials",
  "Committed",
  "Closed Won / Launched",
] as const;
