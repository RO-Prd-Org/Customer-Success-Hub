"use client";

import { useState, type CSSProperties, type ReactNode } from "react";
import { canvasTokens as t, HealthResultTable, H2, Stack, Text } from "@/components/canvas-ui";
import { useHealth } from "@/components/health-store";
import {
  ENGAGEMENT,
  EXPANSION,
  formatRisk,
  LEAD_STAKEHOLDERS,
  SENTIMENTS,
  STAGE_BINARY,
  STAGE_READINESS,
  STATUS_METHODS,
  TIERS,
  YES_NO,
  type HealthInput,
} from "@/lib/health-score";

const fieldStyle: CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  border: `1px solid ${t.strokeSecondary}`,
  borderRadius: 8,
  background: t.bg,
  color: t.text,
  font: "inherit",
  fontSize: 14,
  lineHeight: "20px",
  padding: "8px 10px",
};

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <span style={{ fontSize: 12, lineHeight: "16px", fontWeight: 700, color: t.textTertiary }}>
        {label}
      </span>
      {children}
    </label>
  );
}

function Select({
  value,
  options,
  onChange,
  allowEmpty = true,
  emptyLabel = "—",
}: {
  value: string;
  options: string[];
  onChange: (value: string) => void;
  allowEmpty?: boolean;
  emptyLabel?: string;
}) {
  const choices = value && !options.includes(value) ? [value, ...options] : options;
  return (
    <select value={value} onChange={(event) => onChange(event.target.value)} style={fieldStyle}>
      {allowEmpty ? <option value="">{emptyLabel}</option> : null}
      {choices.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

function ScoreChip({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        border: `1px solid ${t.strokeTertiary}`,
        borderRadius: 8,
        padding: "10px 12px",
        background: t.bg,
      }}
    >
      <div style={{ fontSize: 12, fontWeight: 700, color: t.textTertiary }}>{label}</div>
      <div style={{ marginTop: 4, fontSize: 20, fontWeight: 590 }}>{value}</div>
    </div>
  );
}

export function CustomerHealthBlock() {
  const { customers, scores } = useHealth();
  const rows = customers
    .filter((customer) => customer.name.trim())
    .map((customer) => {
      const score = scores.get(customer.id)!;
      return {
        name: customer.name,
        tier: customer.tier || "—",
        risk: formatRisk(score.total),
        health: `${score.healthPct}%`,
        band: score.band,
      };
    });

  return (
    <Stack gap={10}>
      <H2>Customer health</H2>
      <Text tone="tertiary" size="small">
        Source: RedOwl Customer Health Matrix · edits on the Customer health tab update this table
      </Text>
      <HealthResultTable rows={rows} />
    </Stack>
  );
}

export function HealthEditor() {
  const { customers, scores, updateCustomer, reset } = useHealth();
  const [selectedId, setSelectedId] = useState(customers[0]?.id ?? "");
  const selected = customers.find((customer) => customer.id === selectedId) ?? customers[0];
  const score = selected ? scores.get(selected.id) : undefined;

  function set<K extends keyof HealthInput>(key: K, value: HealthInput[K]) {
    if (!selected) return;
    updateCustomer(selected.id, { [key]: value });
  }

  return (
    <Stack gap={16}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 16, alignItems: "flex-end" }}>
        <Stack gap={6}>
          <H2>Customer health</H2>
          <Text tone="tertiary" size="small">
            Inputs from RedOwl_Customer_Health_Matrix (Health Matrix). Scores recalculate as you edit and show on the dashboard.
          </Text>
        </Stack>
        <button
          type="button"
          onClick={reset}
          style={{
            ...fieldStyle,
            width: "auto",
            cursor: "pointer",
            fontWeight: 700,
          }}
        >
          Reset to matrix
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(220px, 280px) minmax(0, 1fr)",
          gap: 16,
          alignItems: "start",
        }}
      >
        <div
          style={{
            border: `1px solid ${t.strokeTertiary}`,
            borderRadius: 8,
            overflow: "auto",
            maxHeight: 760,
          }}
        >
          {customers.map((customer) => {
            const rowScore = scores.get(customer.id)!;
            const active = customer.id === selected?.id;
            return (
              <button
                key={customer.id}
                type="button"
                onClick={() => setSelectedId(customer.id)}
                style={{
                  display: "block",
                  width: "100%",
                  textAlign: "left",
                  border: "none",
                  borderBottom: `1px solid ${t.strokeTertiary}`,
                  background: active ? t.fillQuaternary : "transparent",
                  boxShadow: active ? `inset 3px 0 0 ${t.accent}` : undefined,
                  padding: "10px 12px",
                  cursor: "pointer",
                  font: "inherit",
                  color: t.text,
                }}
              >
                <div style={{ fontSize: 14, fontWeight: 590 }}>{customer.name || "Untitled customer"}</div>
                <div style={{ marginTop: 2, fontSize: 12, color: t.textTertiary }}>
                  {customer.tier || "No tier"} · {rowScore.healthPct}% · {rowScore.band}
                </div>
              </button>
            );
          })}
        </div>

        {selected && score ? (
          <Stack gap={16}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 12 }}>
              <ScoreChip label="Total risk" value={`${formatRisk(score.total)} / 24`} />
              <ScoreChip label="Health" value={`${score.healthPct}%`} />
              <ScoreChip label="Band" value={score.band} />
            </div>
            <Text tone="tertiary" size="small">
              {score.statusBasis}. Higher risk is worse health. Health % is (24 − risk) / 24. Healthy is 75% and above, Watch is 50–74%, At Risk is below 50%.
            </Text>

            <Section title="Customer" columns={4}>
              <Field label="Customer name">
                <input value={selected.name} onChange={(event) => set("name", event.target.value)} style={fieldStyle} />
              </Field>
              <Field label="Customer tier">
                <Select value={selected.tier} options={TIERS} onChange={(value) => set("tier", value)} />
              </Field>
              <Field label="Solution sold / purchased">
                <input value={selected.solution} onChange={(event) => set("solution", event.target.value)} style={fieldStyle} />
              </Field>
              <Field label="Complex solution">
                <input
                  value={selected.complexSolution}
                  onChange={(event) => set("complexSolution", event.target.value)}
                  style={fieldStyle}
                />
              </Field>
            </Section>

            <Section title="Compliance and delivery">
              <Field label="MSA compliant">
                <Select value={selected.msaCompliant} options={YES_NO} onChange={(value) => set("msaCompliant", value)} />
              </Field>
              <Field label="SOW compliant">
                <Select value={selected.sowCompliant} options={YES_NO} onChange={(value) => set("sowCompliant", value)} />
              </Field>
              <div
                style={{
                  gridColumn: "1 / -1",
                  display: "grid",
                  gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                  gap: 12,
                }}
              >
                <Field label="Stage 1 signoff">
                  <Select value={selected.stage1} options={STAGE_BINARY} onChange={(value) => set("stage1", value)} />
                </Field>
                <Field label="Stage 2 data readiness">
                  <Select value={selected.stage2} options={STAGE_READINESS} onChange={(value) => set("stage2", value)} />
                </Field>
                <Field label="Stage 3 configuration">
                  <Select value={selected.stage3} options={STAGE_BINARY} onChange={(value) => set("stage3", value)} />
                </Field>
                <Field label="Stage 4 findings and reporting">
                  <Select value={selected.stage4} options={STAGE_BINARY} onChange={(value) => set("stage4", value)} />
                </Field>
              </div>
            </Section>

            <Section title="Engagement">
              <Field label="Customer success story">
                <Select value={selected.successStory} options={YES_NO} onChange={(value) => set("successStory", value)} />
              </Field>
              <Field label="EBR progress">
                <Select value={selected.ebr} options={YES_NO} onChange={(value) => set("ebr", value)} />
              </Field>
              <Field label="QBR progress">
                <Select value={selected.qbr} options={YES_NO} onChange={(value) => set("qbr", value)} />
              </Field>
              <Field label="Customer engagement">
                <Select value={selected.engagement} options={ENGAGEMENT} onChange={(value) => set("engagement", value)} />
              </Field>
            </Section>

            <Section title="Stakeholders">
              <Field label="Financial sponsor (CFO)">
                <Select value={selected.cfo} options={SENTIMENTS} onChange={(value) => set("cfo", value)} />
              </Field>
              <Field label="Commercial analyst">
                <Select
                  value={selected.commercialAnalyst}
                  options={SENTIMENTS}
                  onChange={(value) => set("commercialAnalyst", value)}
                />
              </Field>
              <Field label="Operational stakeholder 1">
                <Select value={selected.ops1} options={SENTIMENTS} onChange={(value) => set("ops1", value)} />
              </Field>
              <Field label="Operational stakeholder 2">
                <Select value={selected.ops2} options={SENTIMENTS} onChange={(value) => set("ops2", value)} />
              </Field>
              <Field label="Procurement sponsor">
                <Select value={selected.procurement} options={SENTIMENTS} onChange={(value) => set("procurement", value)} />
              </Field>
              <Field label="Status method">
                <Select
                  value={selected.statusMethod}
                  options={STATUS_METHODS}
                  emptyLabel="Highest (default)"
                  onChange={(value) => set("statusMethod", value)}
                />
              </Field>
              <Field label="Lead stakeholder">
                <Select
                  value={selected.leadStakeholder}
                  options={LEAD_STAKEHOLDERS}
                  onChange={(value) => set("leadStakeholder", value)}
                />
              </Field>
            </Section>

            <Section title="Expansion, tickets, and SLA">
              <Field label="Expansion: SOW $25K">
                <Select value={selected.expansion25} options={EXPANSION} onChange={(value) => set("expansion25", value)} />
              </Field>
              <Field label="Expansion: SOW $60K">
                <Select value={selected.expansion60} options={EXPANSION} onChange={(value) => set("expansion60", value)} />
              </Field>
              <Field label="Open tickets">
                <input
                  inputMode="numeric"
                  value={selected.openTickets}
                  onChange={(event) => set("openTickets", event.target.value.replace(/[^\d]/g, ""))}
                  style={fieldStyle}
                />
              </Field>
              <Field label="SLA breaches">
                <input
                  inputMode="numeric"
                  value={selected.slaBreaches}
                  onChange={(event) => set("slaBreaches", event.target.value.replace(/[^\d]/g, ""))}
                  style={fieldStyle}
                />
              </Field>
            </Section>
          </Stack>
        ) : null}
      </div>
    </Stack>
  );
}

function Section({
  title,
  columns = 2,
  children,
}: {
  title: string;
  columns?: number;
  children: ReactNode;
}) {
  return (
    <section
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
        padding: 16,
        borderRadius: 10,
        background: t.fillQuaternary,
        border: `1px solid ${t.strokeTertiary}`,
      }}
    >
      <h3 style={{ margin: 0, fontSize: 16, lineHeight: "22px", fontWeight: 590 }}>{title}</h3>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
          gap: 12,
        }}
      >
        {children}
      </div>
    </section>
  );
}
