import { createColumnHelper, type ColumnDef } from "@tanstack/react-table"

import type { DataTableFeatures } from "@/components/patterns/data-table"
import { Badge } from "@/components/ui/badge"
import type { TalonMetric } from "@/components/patterns/ai-chat/types"

export const dashboardMetrics: TalonMetric[] = [
  {
    id: "m-revenue",
    label: "Monthly revenue",
    value: "$284K",
    change: "+12.4%",
    trend: "up",
    helperText: "vs previous 30 days",
  },
  {
    id: "m-vendors",
    label: "Active vendors",
    value: "1,248",
    change: "+18",
    trend: "up",
    helperText: "Net new this quarter",
  },
  {
    id: "m-exports",
    label: "Exports completed",
    value: "342",
    change: "-4.2%",
    trend: "down",
    helperText: "Awaiting 12 approvals",
  },
  {
    id: "m-sla",
    label: "SLA compliance",
    value: "98.6%",
    change: "+0.3%",
    trend: "up",
    helperText: "Across all workspaces",
  },
]

export const revenueTrend = [
  { month: "Oct", revenue: 186, target: 200 },
  { month: "Nov", revenue: 205, target: 210 },
  { month: "Dec", revenue: 198, target: 215 },
  { month: "Jan", revenue: 224, target: 220 },
  { month: "Feb", revenue: 241, target: 235 },
  { month: "Mar", revenue: 284, target: 260 },
]

export const exportsByWeek = [
  { week: "W1", csv: 42, json: 18 },
  { week: "W2", csv: 58, json: 24 },
  { week: "W3", csv: 51, json: 31 },
  { week: "W4", csv: 72, json: 28 },
  { week: "W5", csv: 64, json: 35 },
  { week: "W6", csv: 81, json: 40 },
]

export const trafficArea = [
  { day: "Mon", internal: 420, external: 180 },
  { day: "Tue", internal: 510, external: 210 },
  { day: "Wed", internal: 480, external: 240 },
  { day: "Thu", internal: 620, external: 280 },
  { day: "Fri", internal: 590, external: 320 },
  { day: "Sat", internal: 210, external: 90 },
  { day: "Sun", internal: 180, external: 70 },
]

export const categoryBreakdown = [
  { name: "Procurement", value: 420, fill: "var(--chart-2)" },
  { name: "Finance", value: 310, fill: "var(--chart-3)" },
  { name: "Legal", value: 180, fill: "var(--chart-4)" },
  { name: "Security", value: 140, fill: "var(--brand)" },
  { name: "Operations", value: 95, fill: "var(--chart-5)" },
]

export const goalProgress = [
  { name: "Onboarding", value: 82, fill: "var(--chart-2)" },
  { name: "Exports", value: 67, fill: "var(--chart-3)" },
  { name: "Reviews", value: 91, fill: "var(--chart-4)" },
  { name: "Training", value: 54, fill: "var(--brand)" },
]

export const capabilityRadar = [
  { subject: "Speed", team: 88, benchmark: 72 },
  { subject: "Quality", team: 92, benchmark: 80 },
  { subject: "Cost", team: 74, benchmark: 78 },
  { subject: "Risk", team: 86, benchmark: 84 },
  { subject: "Scale", team: 79, benchmark: 70 },
  { subject: "Adoption", team: 83, benchmark: 75 },
]

export const funnelStages = [
  { stage: "Leads", count: 1240, fill: "var(--chart-2)" },
  { stage: "Qualified", count: 820, fill: "var(--chart-3)" },
  { stage: "Proposal", count: 540, fill: "var(--chart-4)" },
  { stage: "Negotiation", count: 310, fill: "var(--brand)" },
  { stage: "Closed", count: 186, fill: "var(--chart-5)" },
]

export const spendScatter = [
  { spend: 12, roi: 18, segment: "SMB" },
  { spend: 24, roi: 32, segment: "Mid" },
  { spend: 18, roi: 28, segment: "SMB" },
  { spend: 42, roi: 45, segment: "Enterprise" },
  { spend: 36, roi: 38, segment: "Mid" },
  { spend: 58, roi: 52, segment: "Enterprise" },
  { spend: 15, roi: 22, segment: "SMB" },
  { spend: 48, roi: 41, segment: "Enterprise" },
]

export const topVendors = [
  {
    id: "v-1",
    name: "Northwind Traders",
    status: "active",
    owner: "Alex Morgan",
    updatedAt: "2026-03-10",
  },
  {
    id: "v-2",
    name: "Contoso Supplies",
    status: "active",
    owner: "Jamie Lee",
    updatedAt: "2026-03-09",
  },
  {
    id: "v-3",
    name: "Fabrikam Logistics",
    status: "pending",
    owner: "Sam Patel",
    updatedAt: "2026-03-08",
  },
  {
    id: "v-4",
    name: "Adventure Works",
    status: "active",
    owner: "Taylor Reed",
    updatedAt: "2026-03-07",
  },
  {
    id: "v-5",
    name: "Wide World Importers",
    status: "archived",
    owner: "Jordan Kim",
    updatedAt: "2026-03-05",
  },
]

export type ActivityRow = {
  id: string
  event: string
  actor: string
  workspace: string
  timestamp: string
}

export const activityLog: ActivityRow[] = [
  {
    id: "act-1",
    event: "Export approved",
    actor: "Alex Morgan",
    workspace: "Finance",
    timestamp: "2026-03-10 09:14",
  },
  {
    id: "act-2",
    event: "Vendor record updated",
    actor: "Jamie Lee",
    workspace: "Procurement",
    timestamp: "2026-03-10 08:42",
  },
  {
    id: "act-3",
    event: "Policy review completed",
    actor: "Sam Patel",
    workspace: "Legal",
    timestamp: "2026-03-09 16:20",
  },
  {
    id: "act-4",
    event: "New dashboard shared",
    actor: "Taylor Reed",
    workspace: "Operations",
    timestamp: "2026-03-09 11:05",
  },
]

const vendorColumnHelper = createColumnHelper<
  DataTableFeatures,
  (typeof topVendors)[number]
>()

export const vendorColumnsDef = vendorColumnHelper.columns([
  vendorColumnHelper.accessor("name", { header: "Vendor" }),
  vendorColumnHelper.accessor("status", {
    header: "Status",
    cell: ({ getValue }) => {
      const status = getValue()
      return (
        <Badge
          variant={
            status === "archived"
              ? "secondary"
              : status === "pending"
                ? "outline"
                : "default"
          }
        >
          {status}
        </Badge>
      )
    },
  }),
  vendorColumnHelper.accessor("owner", { header: "Owner" }),
  vendorColumnHelper.accessor("updatedAt", { header: "Updated" }),
]) as ColumnDef<DataTableFeatures, (typeof topVendors)[number]>[]

const activityColumnHelper = createColumnHelper<DataTableFeatures, ActivityRow>()

export const activityColumnsDef = activityColumnHelper.columns([
  activityColumnHelper.accessor("event", { header: "Event" }),
  activityColumnHelper.accessor("actor", { header: "Actor" }),
  activityColumnHelper.accessor("workspace", { header: "Workspace" }),
  activityColumnHelper.accessor("timestamp", { header: "When" }),
]) as ColumnDef<DataTableFeatures, ActivityRow>[]

export const chartConfig = {
  revenue: { label: "Revenue", color: "var(--chart-3)" },
  target: { label: "Target", color: "var(--chart-4)" },
  csv: { label: "CSV", color: "var(--chart-2)" },
  json: { label: "JSON", color: "var(--chart-3)" },
  internal: { label: "Internal", color: "var(--chart-2)" },
  external: { label: "External", color: "var(--chart-4)" },
  team: { label: "Team", color: "var(--chart-3)" },
  benchmark: { label: "Benchmark", color: "var(--chart-5)" },
  roi: { label: "ROI", color: "var(--chart-4)" },
  spend: { label: "Spend", color: "var(--chart-3)" },
} as const
