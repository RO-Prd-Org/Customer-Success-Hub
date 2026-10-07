"use client"

import * as React from "react"
import { CircleAlertIcon, SparklesIcon, TrendingDownIcon } from "lucide-react"
import {
  Area,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts"

import { AiChatMetricDisplay } from "@/components/patterns/ai-chat/ai-chat-metric-card"
import { PageTopBar } from "@/components/patterns/page-shell"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Progress, ProgressIndicator, ProgressLabel, ProgressValue } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useDomainInvoices } from "@/hooks/use-domain-invoices"
import { buildDashboardStats } from "@/lib/dashboard-stats"
import { DEMO_INSTANCES, type DemoInstance } from "@/lib/demo-instances"
import type { TalonMetric } from "@/components/patterns/ai-chat/types"
import { InvoiceStatusBadge } from "@/views/invoices/invoice-status-badge"
import {
  getFindingLabels,
  getScenarioConfig,
} from "@/views/dashboard/scenario-config"

type DashboardPageProps = {
  demo?: DemoInstance
}

const trendChartConfig = {
  spend: { label: "Spend", color: "var(--chart-2)" },
  leakage: { label: "Leakage", color: "var(--brand)" },
}

const statusChartConfig = {
  red: { label: "Dispute / hold", color: "var(--brand)" },
  amber: { label: "Awaiting approval", color: "var(--chart-3)" },
  green: { label: "Cleared", color: "var(--chart-2)" },
  pending: { label: "In queue", color: "var(--chart-4)" },
}

function formatCurrency(amount: number, compact = false) {
  if (compact && amount >= 1_000_000) {
    return `$${(amount / 1_000_000).toFixed(1)}M`
  }
  if (compact && amount >= 1_000) {
    return `$${(amount / 1_000).toFixed(0)}K`
  }
  return amount.toLocaleString("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
}

function formatPct(value: number) {
  return `${value.toFixed(1)}%`
}

export function DashboardPage({ demo = DEMO_INSTANCES[0] }: DashboardPageProps) {
  const { invoices, loading, error } = useDomainInvoices(demo.id)
  const scenario = getScenarioConfig(demo.id)
  const findingLabels = getFindingLabels(demo.id)

  const stats = React.useMemo(
    () => buildDashboardStats(invoices, findingLabels),
    [invoices, findingLabels]
  )

  const reviewProgress =
    stats.totalInvoices === 0
      ? 0
      : Math.round((stats.analyzedCount / stats.totalInvoices) * 100)

  const metrics: TalonMetric[] = [
    {
      id: "spend",
      label: scenario.spendLabel,
      value: formatCurrency(stats.totalSpend, true),
      helperText: `${stats.totalInvoices.toLocaleString("en-AU")} ${scenario.invoiceLabel.toLowerCase()}`,
    },
    {
      id: "reviewed",
      label: "Invoices reviewed",
      value: stats.analyzedCount.toLocaleString("en-AU"),
      change: `${reviewProgress}%`,
      trend: reviewProgress > 50 ? "up" : "neutral",
      helperText: `${stats.pendingCount.toLocaleString("en-AU")} remaining in queue`,
    },
    {
      id: "leakage",
      label: "Leakage identified",
      value: formatCurrency(stats.totalLeakage),
      change: stats.leakageRatePct > 0 ? formatPct(stats.leakageRatePct) : undefined,
      trend: stats.totalLeakage > 0 ? "down" : "neutral",
      helperText: "Of reviewed spend",
    },
    {
      id: "recoverable",
      label: "Recoverable",
      value: formatCurrency(stats.recoverableLeakage),
      change:
        stats.recoverableRatePct > 0 ? formatPct(stats.recoverableRatePct) : undefined,
      trend: stats.recoverableLeakage > 0 ? "up" : "neutral",
      helperText: "Credits, disputes, and rebills",
    },
    {
      id: "exceptions",
      label: "Open exceptions",
      value: (stats.redCount + stats.amberCount).toLocaleString("en-AU"),
      helperText: `${stats.invoicesWithIssues} invoices with findings`,
    },
    {
      id: "cleared",
      label: "Cleared",
      value: stats.greenCount.toLocaleString("en-AU"),
      trend: "up",
      helperText: "Within tolerance after review",
    },
  ]

  const statusBreakdown = [
    { name: "Dispute / hold", value: stats.redCount, fill: "var(--brand)" },
    { name: "Awaiting approval", value: stats.amberCount, fill: "var(--chart-3)" },
    { name: "Cleared", value: stats.greenCount, fill: "var(--chart-2)" },
    { name: "In queue", value: stats.pendingCount, fill: "var(--chart-4)" },
  ].filter((item) => item.value > 0)

  const leakageByCategory = stats.findings
    .map((finding) => ({
      category: finding.findingId,
      shortLabel: finding.label.length > 22 ? `${finding.label.slice(0, 20)}…` : finding.label,
      count: finding.count,
      amount: finding.amount,
    }))
    .sort((a, b) => b.amount - a.amount || b.count - a.count)

  const executiveSummary = scenario.buildExecutiveSummary(stats)
  const attentionLine = scenario.buildAttentionLine(stats)

  return (
    <div className="flex flex-col gap-6 pb-8">
      <PageTopBar breadcrumbs={[{ label: demo.name }, { label: "Dashboard" }]} />

      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-semibold">{scenario.title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{scenario.subtitle}</p>
        </div>
        <Badge variant="outline">{stats.periodLabel}</Badge>
      </div>

      {error ? (
        <Alert variant="destructive">
          <AlertTitle>Unable to load invoice data</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {loading
          ? Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="gap-0 py-0 shadow-none">
                <CardContent className="px-4 py-4">
                  <Skeleton className="h-16 w-full" />
                </CardContent>
              </Card>
            ))
          : metrics.map((metric) => (
              <Card key={metric.id} className="gap-0 py-0 shadow-none">
                <CardContent className="px-4 py-4">
                  <AiChatMetricDisplay metric={metric} />
                </CardContent>
              </Card>
            ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <SparklesIcon className="size-4 text-brand" />
              <CardTitle>Executive summary</CardTitle>
            </div>
            <CardDescription>{stats.periodLabel}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm leading-relaxed text-muted-foreground">{executiveSummary}</p>
            {attentionLine ? (
              <Alert>
                <CircleAlertIcon />
                <AlertTitle>Requires attention</AlertTitle>
                <AlertDescription>{attentionLine}</AlertDescription>
              </Alert>
            ) : null}
          </CardContent>
          <CardFooter className="gap-2">
            <Badge variant="secondary">Updated from live invoice feed</Badge>
            <Badge variant="outline">
              {stats.totalIssues} finding{stats.totalIssues === 1 ? "" : "s"} logged
            </Badge>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Review coverage</CardTitle>
            <CardDescription>
              {stats.analyzedCount.toLocaleString("en-AU")} of{" "}
              {stats.totalInvoices.toLocaleString("en-AU")} invoices reconciled
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <Progress value={reviewProgress}>
              <ProgressLabel>Period close progress</ProgressLabel>
              <ProgressValue />
              <ProgressIndicator />
            </Progress>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-lg border border-border bg-muted/20 p-3">
                <p className="text-xs text-muted-foreground">Reviewed spend</p>
                <p className="mt-1 font-mono font-medium tabular-nums">
                  {formatCurrency(stats.analyzedSpend, true)}
                </p>
              </div>
              <div className="rounded-lg border border-border bg-muted/20 p-3">
                <p className="text-xs text-muted-foreground">Leakage rate</p>
                <p className="mt-1 font-mono font-medium tabular-nums">
                  {formatPct(stats.leakageRatePct)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="border-b">
            <CardTitle>Spend vs leakage</CardTitle>
            <CardDescription>Monthly trend across the billing period</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            {loading ? (
              <Skeleton className="h-[280px] w-full" />
            ) : stats.monthlyTrend.length > 0 ? (
              <ChartContainer config={trendChartConfig} className="h-[280px] w-full">
                <ComposedChart data={stats.monthlyTrend} margin={{ left: 8, right: 8 }}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="label" tickLine={false} axisLine={false} />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    width={48}
                    tickFormatter={(v) => `$${Math.round(v / 1000)}K`}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Area
                    type="monotone"
                    dataKey="spend"
                    stroke="var(--color-spend)"
                    fill="var(--color-spend)"
                    fillOpacity={0.2}
                  />
                  <Line
                    type="monotone"
                    dataKey="leakage"
                    stroke="var(--color-leakage)"
                    strokeWidth={2}
                    dot={{ r: 3, fill: "var(--color-leakage)" }}
                  />
                </ComposedChart>
              </ChartContainer>
            ) : (
              <p className="py-16 text-center text-sm text-muted-foreground">
                No billing period data available.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b">
            <CardTitle>Exception mix</CardTitle>
            <CardDescription>Invoice disposition after reconciliation</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            {loading ? (
              <Skeleton className="mx-auto h-[280px] w-full" />
            ) : statusBreakdown.length > 0 ? (
              <ChartContainer config={statusChartConfig} className="mx-auto h-[280px] w-full">
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                  <Pie
                    data={statusBreakdown}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={60}
                    outerRadius={96}
                    paddingAngle={2}
                  >
                    {statusBreakdown.map((entry) => (
                      <Cell key={entry.name} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>
            ) : (
              <p className="py-16 text-center text-sm text-muted-foreground">
                Reconciliation has not started for this period.
              </p>
            )}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="border-b">
            <CardTitle>Leakage by category</CardTitle>
            <CardDescription>Recoverable amount by exception type</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            {loading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <ChartContainer
                config={{ amount: { label: "Amount", color: "var(--brand)" } }}
                className="h-[300px] w-full"
              >
                <BarChart
                  data={leakageByCategory}
                  layout="vertical"
                  margin={{ left: 8, right: 16 }}
                >
                  <CartesianGrid horizontal={false} />
                  <XAxis
                    type="number"
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => `$${v}`}
                  />
                  <YAxis
                    type="category"
                    dataKey="shortLabel"
                    tickLine={false}
                    axisLine={false}
                    width={140}
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        formatter={(value, _name, item) => {
                          const payload = item.payload as { count?: number; category?: string }
                          return (
                            <span>
                              {formatCurrency(Number(value))}
                              {payload.count
                                ? ` · ${payload.count} occurrence${payload.count === 1 ? "" : "s"}`
                                : null}
                            </span>
                          )
                        }}
                      />
                    }
                  />
                  <Bar dataKey="amount" radius={[0, 4, 4, 0]}>
                    {leakageByCategory.map((entry) => (
                      <Cell
                        key={entry.category}
                        fill={entry.amount > 0 ? "var(--brand)" : "var(--chart-4)"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b">
            <CardTitle>Connected systems</CardTitle>
            <CardDescription>Sources used for reconciliation</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <ul className="space-y-3">
              {scenario.connectedSystems.map((system) => (
                <li
                  key={system.name}
                  className="rounded-lg border border-border px-3 py-2.5"
                >
                  <p className="text-sm font-medium">{system.name}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{system.description}</p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="border-b">
            <CardTitle>
              {demo.id === "fashion" ? "Carrier performance" : "Client performance"}
            </CardTitle>
            <CardDescription>Spend concentration and exception rate</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            {loading ? (
              <Skeleton className="h-56 w-full" />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{demo.id === "fashion" ? "Carrier" : "Client"}</TableHead>
                    <TableHead className="text-right">Invoices</TableHead>
                    <TableHead className="text-right">Spend</TableHead>
                    <TableHead className="text-right">Leakage</TableHead>
                    <TableHead className="text-right">Rate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stats.topVendors.map((vendor) => {
                    const rate =
                      vendor.totalSpend > 0
                        ? (vendor.leakageAmount / vendor.totalSpend) * 100
                        : 0
                    return (
                      <TableRow key={vendor.vendor}>
                        <TableCell className="font-medium">{vendor.vendor}</TableCell>
                        <TableCell className="text-right tabular-nums">
                          {vendor.invoiceCount}
                        </TableCell>
                        <TableCell className="text-right font-mono tabular-nums text-sm">
                          {formatCurrency(vendor.totalSpend, true)}
                        </TableCell>
                        <TableCell className="text-right font-mono tabular-nums text-sm">
                          {vendor.leakageAmount > 0
                            ? formatCurrency(vendor.leakageAmount)
                            : "—"}
                        </TableCell>
                        <TableCell className="text-right tabular-nums text-sm">
                          {rate > 0 ? (
                            <span className="inline-flex items-center gap-1 text-brand">
                              <TrendingDownIcon className="size-3" />
                              {formatPct(rate)}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b">
            <CardTitle>Priority exceptions</CardTitle>
            <CardDescription>Highest-value open findings</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            {loading ? (
              <Skeleton className="h-56 w-full" />
            ) : stats.recentFlagged.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Issue</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stats.recentFlagged.map((invoice) => {
                    const primaryIssue = invoice.issues?.[0]
                    const total =
                      invoice.issues?.reduce((sum, issue) => sum + issue.amount, 0) ?? 0
                    return (
                      <TableRow key={invoice.id}>
                        <TableCell>
                          <p className="font-medium">{invoice.id}</p>
                          <p className="text-xs text-muted-foreground">
                            {invoice.vendor} · {invoice.invoiceDate}
                          </p>
                        </TableCell>
                        <TableCell className="max-w-[200px] text-sm">
                          {primaryIssue?.type ?? "Multiple findings"}
                          {invoice.issues && invoice.issues.length > 1 ? (
                            <p className="text-xs text-muted-foreground">
                              +{invoice.issues.length - 1} more
                            </p>
                          ) : null}
                        </TableCell>
                        <TableCell className="text-right font-mono tabular-nums text-sm">
                          {formatCurrency(total)}
                        </TableCell>
                        <TableCell>
                          {invoice.analysisPending ? (
                            <span className="text-xs text-muted-foreground">In queue</span>
                          ) : (
                            <InvoiceStatusBadge status={invoice.status} />
                          )}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            ) : (
              <p className="py-12 text-center text-sm text-muted-foreground">
                No exceptions logged for the current review window.
              </p>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
