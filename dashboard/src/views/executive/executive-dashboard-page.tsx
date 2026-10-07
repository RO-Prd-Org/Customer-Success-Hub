import { TrendingUpIcon } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

import { AiChatMetricDisplay } from "@/components/patterns/ai-chat/ai-chat-metric-card"
import { PageTopBar } from "@/components/patterns/page-shell"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatRisk, bandSurface } from "@/lib/executive-health"
import { HealthProvider, useHealth } from "@/views/executive/health-store"
import { implementations, pipelineByMonth } from "@/views/executive/executive-data"
import { HealthEditor } from "@/views/executive/health-editor"
import { SlaLogView } from "@/views/executive/sla-log-view"

const pipelineChartConfig = {
  rolling: { label: "Rolling pipeline", color: "var(--brand)" },
}

function money(value: number) {
  return value.toLocaleString("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 0,
  })
}

function PercentPill({ value }: { value: number }) {
  const clamped = Math.min(100, Math.max(0, value))

  return (
    <div
      className="flex h-7 w-40 items-center gap-2 rounded-full bg-muted px-1.5"
      role="meter"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`${clamped}% complete`}
    >
      <div className="h-3.5 flex-1 overflow-hidden rounded-full bg-background">
        <div className="h-full rounded-full bg-brand" style={{ width: `${clamped}%` }} />
      </div>
      <span className="pr-1 text-xs font-medium tabular-nums">{clamped}%</span>
    </div>
  )
}

function CustomerHealthTable() {
  const { customers, scores } = useHealth()

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>Customer health</CardTitle>
        <CardDescription>
          Source: RedOwl Customer Health Matrix. Edits on the Customer health tab update this table.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer name</TableHead>
              <TableHead>Customer tier</TableHead>
              <TableHead className="text-right">Total risk score</TableHead>
              <TableHead className="text-right">Health %</TableHead>
              <TableHead>Health band</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers
              .filter((customer) => customer.name.trim())
              .map((customer) => {
                const score = scores.get(customer.id)
                if (!score) return null
                return (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">{customer.name}</TableCell>
                    <TableCell>{customer.tier || "—"}</TableCell>
                    <TableCell className="text-right tabular-nums">
                      {formatRisk(score.total)} / {score.max}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">{score.healthPct}%</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={bandSurface(score.band)}>
                        {score.band}
                      </Badge>
                    </TableCell>
                  </TableRow>
                )
              })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

function DashboardView() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="font-heading text-2xl font-semibold">
          Executive Dashboard — Business Performance — 7 October 2026
        </h1>
      </div>
      <Alert>
        <AlertTitle>Board snapshot</AlertTitle>
        <AlertDescription>
          YTD ARR is $109,001, from deals in Closed. Gross pipeline is $4,608,008. The active
          opportunity base is 86, counting every deal that is not Closed. Six deals are in
          Demo/POV. 14 implementations are active.
        </AlertDescription>
      </Alert>
      <section className="grid gap-4 md:grid-cols-3">
        <Card className="gap-0 bg-amber-50 py-0 shadow-none">
          <CardContent className="px-4 py-4">
            <AiChatMetricDisplay
              metric={{ id: "ytd", label: "YTD ARR", value: "$109,001" }}
            />
          </CardContent>
        </Card>
        <Card className="gap-0 bg-muted/50 py-0 shadow-none">
          <CardContent className="px-4 py-4">
            <AiChatMetricDisplay
              metric={{
                id: "gross",
                label: "Gross pipeline",
                value: "$4,608,008",
              }}
            />
          </CardContent>
        </Card>
        <Card className="gap-0 bg-muted/50 py-0 shadow-none">
          <CardContent className="px-4 py-4">
            <AiChatMetricDisplay
              metric={{
                id: "weighted",
                label: "Weighted pipeline",
                value: "$874,420",
                change: "14.6% vs last week",
                trend: "up",
              }}
            />
          </CardContent>
        </Card>
      </section>
      <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
        <div className="grid gap-4 sm:grid-cols-2">
          <Card className="h-full gap-0 bg-muted/50 py-0 shadow-none">
            <CardContent className="flex h-full flex-1 px-4 py-4">
              <AiChatMetricDisplay
                centered
                className="w-full"
                metric={{ id: "demos", label: "New demos", value: "6" }}
              />
            </CardContent>
          </Card>
          <Card className="h-full gap-0 bg-muted/50 py-0 shadow-none">
            <CardContent className="flex h-full flex-1 px-4 py-4">
              <AiChatMetricDisplay
                centered
                className="w-full"
                metric={{ id: "opps", label: "New opportunities", value: "9" }}
              />
            </CardContent>
          </Card>
          <Card className="h-full gap-0 bg-muted/50 py-0 shadow-none">
            <CardContent className="flex h-full flex-1 px-4 py-4">
              <AiChatMetricDisplay
                centered
                className="w-full"
                metric={{
                  id: "four",
                  label: "Total 4RQ opportunities",
                  value: "86",
                }}
              />
            </CardContent>
          </Card>
          <Card className="h-full gap-0 bg-muted/50 py-0 shadow-none">
            <CardContent className="flex h-full flex-1 px-4 py-4">
              <AiChatMetricDisplay
                centered
                className="w-full"
                metric={{ id: "impl", label: "Implementations for 2026", value: "14" }}
              />
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader className="border-b">
            <CardTitle>Rolling pipeline by close month</CardTitle>
            <CardDescription>Source: Pipedrive deal export · expected close date</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <ChartContainer config={pipelineChartConfig} className="h-[280px] w-full">
              <LineChart data={pipelineByMonth} margin={{ left: 8, right: 8, bottom: 8 }}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} interval={1} />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  width={48}
                  tickFormatter={(value) => `$${(Number(value) / 1_000_000).toFixed(1)}M`}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="rolling"
                  stroke="var(--color-rolling)"
                  strokeWidth={2}
                  dot={{ r: 3, fill: "var(--color-rolling)" }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </section>
      <Card>
        <CardHeader className="border-b">
          <CardTitle>Build progress by customer</CardTitle>
          <CardDescription>
            Live as at 17 Sep 2026 · Source: Implementation Tracker
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 pt-4">
          <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-6">
            {[
              ["15", "In implementation"],
              ["1", "Sandbox live"],
              ["48%", "Avg build progress"],
              ["4", "With customer"],
              ["14", "At risk"],
              ["$1,390,000", "ARR in implementation"],
            ].map(([value, label]) => (
              <div key={label} className="rounded-lg border border-border bg-muted/30 px-3 py-3">
                <p className="font-heading text-xl font-semibold tabular-nums">{value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>% complete</TableHead>
                <TableHead className="text-right">Stage no.</TableHead>
                <TableHead>Sandbox development stage</TableHead>
                <TableHead className="text-right">Days in stage</TableHead>
                <TableHead>RAG</TableHead>
                <TableHead className="text-right">ARR</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {implementations.map((row) => (
                <TableRow key={row.customer}>
                  <TableCell className="font-medium">{row.customer}</TableCell>
                  <TableCell>
                    <PercentPill value={row.percent} />
                  </TableCell>
                  <TableCell className="text-right tabular-nums">{row.stageNo}</TableCell>
                  <TableCell>{row.stage}</TableCell>
                  <TableCell className="text-right tabular-nums">{row.days}</TableCell>
                  <TableCell>
                    <Badge
                      variant={row.rag === "Red" ? "destructive" : "outline"}
                      className={
                        row.rag === "Complete"
                          ? "border-transparent bg-emerald-50 text-emerald-700"
                          : undefined
                      }
                    >
                      {row.rag}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">{money(row.arr)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <p className="text-xs text-muted-foreground">
            Kane dropped out. Source: RedOwl Pipeline Analysis · Implementation Dashboard · Live as
            at 17 Sep 2026
          </p>
        </CardContent>
      </Card>
      <CustomerHealthTable />
    </div>
  )
}

export function ExecutiveDashboardPage() {
  return (
    <HealthProvider>
      <div className="flex flex-col gap-4">
        <PageTopBar
          showSidebarTrigger={false}
          breadcrumbs={[
            { label: "Executive" },
            { label: "Business performance" },
          ]}
        />
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <TrendingUpIcon className="size-4 text-brand" />
          FY26 · Live view
        </div>
        <Tabs defaultValue="dashboard">
          <TabsList>
            <TabsTrigger value="dashboard">Executive</TabsTrigger>
            <TabsTrigger value="health">Customer health</TabsTrigger>
            <TabsTrigger value="sla">SLA log</TabsTrigger>
          </TabsList>
          <TabsContent value="dashboard" className="pt-2">
            <DashboardView />
          </TabsContent>
          <TabsContent value="health" className="pt-2">
            <HealthEditor />
          </TabsContent>
          <TabsContent value="sla" className="pt-2">
            <SlaLogView />
          </TabsContent>
        </Tabs>
      </div>
    </HealthProvider>
  )
}
