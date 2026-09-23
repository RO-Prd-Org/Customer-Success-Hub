"use client";

import { useMemo, useState } from "react";
import { dashboard, stages } from "@/lib/dashboard";
import { formatMoney, formatMonth } from "@/lib/format";

export function ActivityPanels() {
  const [stage, setStage] = useState("All");

  const pipeline = useMemo(() => {
    return dashboard.pipeline
      .filter((deal) => stage === "All" || deal.stage === stage)
      .sort((a, b) => b.value - a.value);
  }, [stage]);

  const stageCounts = useMemo(() => {
    return stages.map((name) => ({
      name,
      count: dashboard.pipeline.filter((deal) => deal.stage === name).length,
      value: dashboard.pipeline
        .filter((deal) => deal.stage === name)
        .reduce((sum, deal) => sum + deal.value, 0),
    }));
  }, []);

  return (
    <section id="pipeline" className="mx-auto max-w-[1280px] px-5">
      <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-3xl bg-white p-6 shadow-[0_12px_40px_rgba(22,28,22,0.06)] ring-1 ring-black/4">
          <h3 className="font-heading text-xl font-medium">New opportunities</h3>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs tracking-[0.12em] text-muted-foreground uppercase">
                  <th className="py-3 font-medium">Opportunity</th>
                  <th className="py-3 font-medium">Use case</th>
                  <th className="py-3 text-right font-medium">ARR</th>
                </tr>
              </thead>
              <tbody>
                {dashboard.newOpportunitiesAug.map((deal) => (
                  <tr key={deal.opportunity} className="border-b border-border/70">
                    <td className="py-3">
                      <p className="font-medium">{deal.opportunity}</p>
                      <p className="text-xs text-muted-foreground">
                        {deal.icp} · {deal.closeMonth}
                      </p>
                    </td>
                    <td className="py-3">{deal.useCase}</td>
                    <td className="py-3 text-right font-mono">
                      {formatMoney(deal.grossArr)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-[0_12px_40px_rgba(22,28,22,0.06)] ring-1 ring-black/4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <h3 className="font-heading text-xl font-medium">Gross pipeline</h3>
            <div className="flex flex-wrap gap-1.5">
              {["All", ...stages].map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => setStage(name)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                    stage === name
                      ? "bg-brand text-white"
                      : "bg-cream text-ink hover:bg-[#ebebe0]"
                  }`}
                >
                  {name}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-3">
            {stageCounts.map((item) => (
              <div key={item.name} className="rounded-2xl bg-cream px-3 py-2.5">
                <p className="text-[11px] text-muted-foreground">{item.name}</p>
                <p className="font-medium">
                  {item.count}{" "}
                  <span className="font-mono text-xs text-muted-foreground">
                    {formatMoney(item.value, true)}
                  </span>
                </p>
              </div>
            ))}
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs tracking-[0.12em] text-muted-foreground uppercase">
                  <th className="py-3 font-medium">Opportunity</th>
                  <th className="py-3 font-medium">Stage</th>
                  <th className="py-3 font-medium">Close</th>
                  <th className="py-3 text-right font-medium">Value</th>
                </tr>
              </thead>
              <tbody>
                {pipeline.map((deal) => (
                  <tr
                    key={`${deal.opportunity}-${deal.closeMonth}-${deal.value}`}
                    className="border-b border-border/70"
                  >
                    <td className="py-3">
                      <p className="font-medium">{deal.opportunity}</p>
                      <p className="max-w-72 truncate text-xs text-muted-foreground">
                        {deal.statusComments || deal.useCase || "—"}
                      </p>
                    </td>
                    <td className="py-3">
                      <span className="rounded-full bg-cream px-2.5 py-1 text-xs font-medium">
                        {deal.stage}
                      </span>
                    </td>
                    <td className="py-3">{formatMonth(deal.closeMonth)}</td>
                    <td className="py-3 text-right font-mono">
                      {formatMoney(deal.value)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
