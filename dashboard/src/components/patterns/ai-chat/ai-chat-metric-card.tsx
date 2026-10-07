import { MinusIcon, TrendingDownIcon, TrendingUpIcon } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

import type { TalonMetric } from "./types"

type AiChatMetricDisplayProps = {
  metric: TalonMetric
  className?: string
  centered?: boolean
}

function TrendIcon({ trend }: { trend: TalonMetric["trend"] }) {
  if (trend === "up") {
    return <TrendingUpIcon className="size-3.5 text-emerald-600 dark:text-emerald-400" />
  }

  if (trend === "down") {
    return <TrendingDownIcon className="size-3.5 text-destructive" />
  }

  return <MinusIcon className="size-3.5 text-muted-foreground" />
}

export function AiChatMetricDisplay({
  metric,
  className,
  centered = false,
}: AiChatMetricDisplayProps) {
  const change = metric.change ? (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-sm font-medium",
        metric.trend === "up" && "text-emerald-600 dark:text-emerald-400",
        metric.trend === "down" && "text-destructive",
        metric.trend === "neutral" && "text-muted-foreground"
      )}
    >
      <TrendIcon trend={metric.trend} />
      {metric.change}
    </span>
  ) : null

  if (centered) {
    return (
      <div className={cn("flex h-full flex-col items-center justify-center text-center", className)}>
        <p className="font-heading text-3xl font-semibold tracking-tight">{metric.value}</p>
        <div className="mt-1 flex items-center justify-center gap-2">
          <p className="text-xs font-medium text-muted-foreground">{metric.label}</p>
          {change}
        </div>
        {metric.helperText ? (
          <p className="mt-1 text-xs text-muted-foreground">{metric.helperText}</p>
        ) : null}
      </div>
    )
  }

  return (
    <div className={cn("space-y-1", className)}>
      <p className="text-xs font-medium text-muted-foreground">{metric.label}</p>
      <div className="flex items-end justify-between gap-3">
        <p className="font-heading text-3xl font-semibold tracking-tight">
          {metric.value}
        </p>
        {change}
      </div>
      {metric.helperText ? (
        <p className="text-xs text-muted-foreground">{metric.helperText}</p>
      ) : null}
    </div>
  )
}

type AiChatMetricCardProps = {
  metric: TalonMetric
}

export function AiChatMetricCard({ metric }: AiChatMetricCardProps) {
  return (
    <Card className="gap-0 py-0 shadow-none">
      <CardContent className="px-3 py-3">
        <AiChatMetricDisplay metric={metric} />
      </CardContent>
    </Card>
  )
}
