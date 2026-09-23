import { ForecastChart } from "@/components/dashboard/forecast-chart";
import { dashboard } from "@/lib/dashboard";
import { formatMoney, formatPercent } from "@/lib/format";

export function ForecastPanel() {
  const { kpis, monthlyForecast, forecastPathDeals } = dashboard;

  return (
    <section id="forecast" className="mx-auto max-w-[1280px] px-5">
      <div className="grid gap-4 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded-3xl bg-white p-6 shadow-[0_12px_40px_rgba(22,28,22,0.06)] ring-1 ring-black/4">
          <h2 className="mb-2 font-heading text-xl font-medium text-[#5d6c7b]">
            Pipeline Forecast by Close Month
          </h2>
          <ForecastChart data={monthlyForecast} />
        </div>

        <div className="rounded-3xl bg-cream p-6">
          <p className="text-xs font-semibold tracking-[0.18em] text-brand uppercase">
            Path to $1M
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <Stat
              label="Forecast path"
              value={formatMoney(kpis.forecastPath, true)}
              hint={`${formatPercent(kpis.forecastPath / kpis.fy26ArrTarget)} coverage`}
            />
            <Stat
              label="Weighted"
              value={formatMoney(kpis.weightedForecast, true)}
              hint={`${formatPercent(kpis.weightedForecast / kpis.fy26ArrTarget)} of target`}
            />
          </div>
          <div className="mt-5 space-y-3">
            {forecastPathDeals.slice(0, 7).map((deal) => (
              <div
                key={`${deal.opportunity}-${deal.closeMonth}`}
                className="flex items-start justify-between gap-3 border-b border-black/8 pb-3 last:border-0"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium">{deal.opportunity}</p>
                  <p className="text-xs text-muted-foreground">
                    {deal.closeMonth} · {deal.notes}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-sm">
                    {formatMoney(deal.grossArr, true)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatPercent(deal.probability, 0)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="rounded-2xl bg-white px-3 py-3">
      <p className="text-[11px] tracking-[0.12em] text-muted-foreground uppercase">
        {label}
      </p>
      <p className="mt-1 font-heading text-2xl font-medium">{value}</p>
      <p className="text-xs text-muted-foreground">{hint}</p>
    </div>
  );
}
