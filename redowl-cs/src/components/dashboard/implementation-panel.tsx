import { dashboard } from "@/lib/dashboard";
import { formatDate, formatMoney, formatPercent } from "@/lib/format";

function ragTone(rag: string) {
  if (rag === "Complete" || rag === "Green") {
    return "bg-emerald-50 text-emerald-800";
  }
  if (rag === "Amber") {
    return "bg-amber-50 text-amber-800";
  }
  return "bg-red-50 text-brand";
}

export function ImplementationPanel() {
  const { implementations } = dashboard;
  const rows = [...implementations].sort(
    (a, b) => a.sandboxStageNo - b.sandboxStageNo || b.arr - a.arr,
  );

  return (
    <section id="implementation" className="mx-auto max-w-[1280px] px-5">
      <div className="overflow-hidden rounded-3xl bg-white shadow-[0_12px_40px_rgba(22,28,22,0.06)] ring-1 ring-black/4">
        <h2 className="px-5 pt-5 font-heading text-xl font-medium">
          Implementation
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-sm">
            <thead>
              <tr className="border-b bg-cream/70 text-left text-xs tracking-[0.12em] text-muted-foreground uppercase">
                <th className="px-5 py-4 font-medium">Customer</th>
                <th className="px-3 py-4 font-medium">Stage</th>
                <th className="px-3 py-4 font-medium">Sandbox</th>
                <th className="px-3 py-4 font-medium">Progress</th>
                <th className="px-3 py-4 font-medium">RAG</th>
                <th className="px-3 py-4 font-medium">Owner</th>
                <th className="px-3 py-4 font-medium">Target</th>
                <th className="px-3 py-4 text-right font-medium">ARR</th>
                <th className="px-5 py-4 font-medium">Next action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.customer} className="border-b border-border/70 last:border-0">
                  <td className="px-5 py-4 font-medium">{row.customer}</td>
                  <td className="px-3 py-4">{row.salesStage}</td>
                  <td className="max-w-52 px-3 py-4 text-muted-foreground">
                    {row.sandboxStageNo}. {row.sandboxStage}
                  </td>
                  <td className="px-3 py-4">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-brand"
                          style={{ width: `${row.pctComplete * 100}%` }}
                        />
                      </div>
                      <span className="font-mono text-xs">
                        {formatPercent(row.pctComplete, 0)}
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      {row.daysInStage}d in stage
                    </p>
                  </td>
                  <td className="px-3 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${ragTone(row.rag)}`}
                    >
                      {row.rag}
                    </span>
                  </td>
                  <td className="px-3 py-4">{row.owner}</td>
                  <td className="px-3 py-4">
                    <p>{formatDate(row.targetLive)}</p>
                    {row.daysToTarget !== null ? (
                      <p className="text-[11px] text-muted-foreground">
                        {row.daysToTarget < 0
                          ? `${Math.abs(row.daysToTarget)}d overdue`
                          : `${row.daysToTarget}d to target`}
                      </p>
                    ) : null}
                  </td>
                  <td className="px-3 py-4 text-right font-mono">
                    {formatMoney(row.arr)}
                  </td>
                  <td className="max-w-64 px-5 py-4 text-muted-foreground">
                    {row.blocker || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
