import { useState, type ReactNode } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useHealth } from "@/views/executive/health-store"
import {
  ENGAGEMENT,
  EXPANSION,
  formatRisk,
  bandSurface,
  LEAD_STAKEHOLDERS,
  SENTIMENTS,
  STAGE_BINARY,
  STAGE_READINESS,
  STATUS_METHODS,
  TIERS,
  YES_NO,
  type HealthInput,
} from "@/lib/executive-health"

const EMPTY = "__empty__"

function Choice({
  label,
  value,
  options,
  onChange,
  emptyLabel = "—",
}: {
  label: string
  value: string
  options: string[]
  onChange: (value: string) => void
  emptyLabel?: string
}) {
  const choices = value && !options.includes(value) ? [value, ...options] : options
  return (
    <label className="flex min-w-0 flex-col gap-1.5">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <Select
        value={value || EMPTY}
        onValueChange={(next) => onChange(!next || next === EMPTY ? "" : next)}
      >
        <SelectTrigger className="w-full">
          <SelectValue>
            {(selected) => (!selected || selected === EMPTY ? "—" : selected)}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={EMPTY}>{emptyLabel}</SelectItem>
          {choices.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </label>
  )
}

function TextField({
  label,
  value,
  onChange,
  numeric = false,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  numeric?: boolean
}) {
  return (
    <label className="flex min-w-0 flex-col gap-1.5">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <Input
        value={value}
        inputMode={numeric ? "numeric" : undefined}
        onChange={(event) =>
          onChange(numeric ? event.target.value.replace(/[^\d]/g, "") : event.target.value)
        }
      />
    </label>
  )
}

function Section({
  title,
  columns = 2,
  children,
}: {
  title: string
  columns?: number
  children: ReactNode
}) {
  return (
    <section className="flex flex-col gap-3 rounded-xl border border-border bg-muted/70 p-4">
      <h3 className="font-heading text-sm font-medium">{title}</h3>
      <div
        className="grid gap-3"
        style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
      >
        {children}
      </div>
    </section>
  )
}

export function HealthEditor() {
  const { customers, scores, updateCustomer, reset } = useHealth()
  const [selectedId, setSelectedId] = useState(customers[0]?.id ?? "")
  const selected = customers.find((customer) => customer.id === selectedId) ?? customers[0]
  const score = selected ? scores.get(selected.id) : undefined

  function set<K extends keyof HealthInput>(key: K, value: HealthInput[K]) {
    if (!selected) return
    updateCustomer(selected.id, { [key]: value })
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-end justify-between gap-4">
        <p className="max-w-2xl text-sm text-muted-foreground">
          Inputs from the customer health matrix. Scores update on the dashboard tab.
        </p>
        <Button variant="outline" onClick={reset}>
          Reset to matrix
        </Button>
      </div>
      <div className="grid items-start gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
        {customers.length > 0 ? (
          <Tabs
            orientation="vertical"
            value={selected?.id}
            onValueChange={(id) => id && setSelectedId(id)}
            className="w-full"
          >
            <TabsList className="h-auto w-full flex-col items-stretch justify-start p-1 group-data-vertical/tabs:h-auto">
              {customers.map((customer) => (
                <TabsTrigger
                  key={customer.id}
                  value={customer.id}
                  className="h-auto w-full flex-none justify-start whitespace-normal px-3 py-2 text-left"
                >
                  {customer.name || "Untitled customer"}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        ) : (
          <div />
        )}
        <div className="flex min-w-0 flex-col gap-4">
      {selected ? (
        <h2 className="font-heading text-2xl font-semibold">
          {selected.name || "Untitled customer"}
        </h2>
      ) : null}
      {selected && score ? (
        <div className="flex flex-col gap-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <Score label="Total risk" value={`${formatRisk(score.total)} / ${score.max}`} />
            <Score label="Health" value={`${score.healthPct}%`} />
            <Score label="Band" value={score.band} className={bandSurface(score.band)} />
          </div>
          <p className="text-xs text-muted-foreground">
            {score.statusBasis}. Higher risk is worse health. Healthy is 75% and above, Watch is 50–74%, At Risk is below 50%.
          </p>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            <div className="rounded-xl border border-border bg-muted/70 p-3">
              <Choice label="Customer tier" value={selected.tier} options={TIERS} onChange={(value) => set("tier", value)} />
            </div>
            <div className="rounded-xl border border-border bg-muted/70 p-3">
              <TextField label="Solution sold / purchased" value={selected.solution} onChange={(value) => set("solution", value)} />
            </div>
            <div className="rounded-xl border border-border bg-muted/70 p-3">
              <TextField label="Complex solution" value={selected.complexSolution} onChange={(value) => set("complexSolution", value)} />
            </div>
          </div>
          <Section title="Compliance and delivery" columns={6}>
            <Choice label="MSA compliant" value={selected.msaCompliant} options={YES_NO} onChange={(value) => set("msaCompliant", value)} />
            <Choice label="SOW compliant" value={selected.sowCompliant} options={YES_NO} onChange={(value) => set("sowCompliant", value)} />
            <Choice label="Stage 1 signoff" value={selected.stage1} options={STAGE_BINARY} onChange={(value) => set("stage1", value)} />
            <Choice label="Stage 2 data readiness" value={selected.stage2} options={STAGE_READINESS} onChange={(value) => set("stage2", value)} />
            <Choice label="Stage 3 configuration" value={selected.stage3} options={STAGE_BINARY} onChange={(value) => set("stage3", value)} />
            <Choice label="Stage 4 findings and reporting" value={selected.stage4} options={STAGE_BINARY} onChange={(value) => set("stage4", value)} />
          </Section>
          <Section title="Engagement" columns={4}>
            <Choice label="Customer success story" value={selected.successStory} options={YES_NO} onChange={(value) => set("successStory", value)} />
            <Choice label="EBR progress" value={selected.ebr} options={YES_NO} onChange={(value) => set("ebr", value)} />
            <Choice label="QBR progress" value={selected.qbr} options={YES_NO} onChange={(value) => set("qbr", value)} />
            <Choice label="Customer engagement" value={selected.engagement} options={ENGAGEMENT} onChange={(value) => set("engagement", value)} />
          </Section>
          <Section title="Stakeholders" columns={1}>
            <div className="grid grid-cols-4 gap-3">
              <Choice label="Lead stakeholder" value={selected.leadStakeholder} options={LEAD_STAKEHOLDERS} onChange={(value) => set("leadStakeholder", value)} />
              <Choice label="Financial sponsor (CFO)" value={selected.cfo} options={SENTIMENTS} onChange={(value) => set("cfo", value)} />
              <Choice label="Commercial analyst" value={selected.commercialAnalyst} options={SENTIMENTS} onChange={(value) => set("commercialAnalyst", value)} />
              <Choice label="Operational stakeholder 1" value={selected.ops1} options={SENTIMENTS} onChange={(value) => set("ops1", value)} />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <Choice label="Operational stakeholder 2" value={selected.ops2} options={SENTIMENTS} onChange={(value) => set("ops2", value)} />
              <Choice label="Procurement sponsor" value={selected.procurement} options={SENTIMENTS} onChange={(value) => set("procurement", value)} />
              <Choice label="Status method" value={selected.statusMethod} options={STATUS_METHODS} onChange={(value) => set("statusMethod", value)} />
            </div>
          </Section>
          <Section title="Expansion, tickets, and SLA" columns={4}>
            <Choice label="Expansion: SOW $25K" value={selected.expansion25} options={EXPANSION} onChange={(value) => set("expansion25", value)} />
            <Choice label="Expansion: SOW $60K" value={selected.expansion60} options={EXPANSION} onChange={(value) => set("expansion60", value)} />
            <label className="flex min-w-0 flex-col gap-1.5">
              <span className="text-xs font-medium text-muted-foreground">Open tickets</span>
              <Input readOnly value={String(score.openTicketCount)} />
            </label>
            <label className="flex min-w-0 flex-col gap-1.5">
              <span className="text-xs font-medium text-muted-foreground">SLA breaches</span>
              <Input readOnly value={String(score.breachCount)} />
            </label>
          </Section>
        </div>
      ) : null}
        </div>
      </div>
    </div>
  )
}

function Score({
  label,
  value,
  className,
}: {
  label: string
  value: string
  className?: string
}) {
  return (
    <div
      className={`rounded-xl border px-3 py-3 ${className ?? "border-border bg-card"}`}
    >
      <div className="text-xs font-medium text-muted-foreground">{label}</div>
      <div className="mt-1 font-heading text-xl font-semibold">{value}</div>
    </div>
  )
}
