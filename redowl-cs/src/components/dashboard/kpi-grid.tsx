import {
  dashboard,
  demoToOpp,
  newOppValue,
  pipelineCoverage,
  ytdAttainment,
} from "@/lib/dashboard";
import { formatMoney, formatPercent } from "@/lib/format";

const kpis = dashboard.kpis;

const heroStats = [
  {
    label: "FY26 ARR target",
    value: formatMoney(kpis.fy26ArrTarget, true),
    hint: `${kpis.targetIcpCustomers} ICP · ${kpis.newLogosTarget} logos`,
  },
  {
    label: "YTD ARR",
    value: formatMoney(kpis.ytdArr),
    hint: `${formatPercent(ytdAttainment)} of target`,
  },
  {
    label: "Gross pipeline",
    value: formatMoney(kpis.grossPipeline, true),
    hint: `${pipelineCoverage.toFixed(1)}x coverage`,
  },
  {
    label: "New demos",
    value: String(kpis.newDemos),
    hint: `${formatPercent(demoToOpp, 0)} convert to opps`,
  },
  {
    label: "New opportunities",
    value: String(kpis.newOpportunities),
    hint: `${formatMoney(newOppValue, true)} created`,
  },
];

export function KpiGrid() {
  return (
    <section id="overview" className="bg-brand px-5 py-10 md:px-8 md:py-12">
      <div className="mx-auto max-w-[1280px]">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {heroStats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl bg-white px-5 py-6 text-ink"
            >
              <p className="text-xs font-medium tracking-[0.16em] text-muted-foreground uppercase">
                {stat.label}
              </p>
              <p className="mt-3 font-heading text-4xl font-medium tracking-tight">
                {stat.value}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">{stat.hint}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
