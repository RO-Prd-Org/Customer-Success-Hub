import { createColumnHelper, type ColumnDef } from "@tanstack/react-table"
import { BarChart3Icon, DownloadIcon, FileTextIcon } from "lucide-react"

import {
  type DataTableFeatures,
  TalonDataTable,
} from "@/components/patterns/data-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { AiChatMetricDisplay } from "./ai-chat-metric-card"
import type { TalonArtifact, TalonArtifactTableRow } from "./types"
import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

type AiChatArtifactProps = {
  artifact: TalonArtifact
}

const columnHelper = createColumnHelper<DataTableFeatures, TalonArtifactTableRow>()

const artifactColumns = columnHelper.columns([
  columnHelper.accessor("name", { header: "Name" }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: ({ getValue }) => <Badge variant="outline">{getValue()}</Badge>,
  }),
  columnHelper.accessor("owner", { header: "Owner" }),
  columnHelper.accessor("updatedAt", { header: "Updated" }),
])

const artifactColumnsDef =
  artifactColumns as ColumnDef<DataTableFeatures, TalonArtifactTableRow>[]

export function AiChatArtifact({ artifact }: AiChatArtifactProps) {
  return (
    <Card className="overflow-hidden py-0">
      <CardHeader className="flex flex-row items-start justify-between gap-2 border-b px-3 py-2">
        <div>
          <CardTitle className="text-sm">{artifact.title}</CardTitle>
          {artifact.description ? (
            <p className="text-xs text-muted-foreground">{artifact.description}</p>
          ) : null}
        </div>
        <Badge variant="secondary">{artifact.kind}</Badge>
      </CardHeader>

      <CardContent className="space-y-3 px-3 py-3">
        {artifact.kind === "metrics" ? (
          <AiChatMetricDisplay metric={artifact.metric} />
        ) : null}

        {artifact.kind === "table" ? (
          <TalonDataTable
            columns={artifactColumnsDef}
            data={artifact.rows}
            rowVariant="clickable"
            onRowDrillIn={() => undefined}
            emptyMessage="No rows."
          />
        ) : null}

        {artifact.kind === "chart" ? (
          <ChartContainer
            config={{
              value: { label: "Value", color: "var(--chart-3)" },
            }}
            className="h-48 w-full"
          >
            {artifact.chartType === "line" ? (
              <LineChart data={artifact.data}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="label" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} width={28} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="var(--chart-3)"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            ) : (
              <BarChart data={artifact.data}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="label" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} width={28} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="value" fill="var(--chart-3)" radius={4} />
              </BarChart>
            )}
          </ChartContainer>
        ) : null}

        {artifact.kind === "file" ? (
          <div className="flex items-center gap-3 rounded-lg border border-dashed border-border p-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
              <FileTextIcon className="size-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{artifact.filename}</p>
              <p className="text-xs text-muted-foreground">
                {artifact.mediaType} · {artifact.sizeLabel}
              </p>
            </div>
            <Button size="sm" variant="outline">
              <DownloadIcon />
              Download
            </Button>
          </div>
        ) : null}

        {artifact.kind === "document" ? (
          <div className="rounded-lg bg-muted/40 p-3 text-sm whitespace-pre-wrap">
            {artifact.preview}
          </div>
        ) : null}

        <div className="flex gap-2">
          <Button size="sm" variant="outline">
            <BarChart3Icon />
            Open artefact
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
