import { CheckIcon, CircleIcon, LoaderCircleIcon, XIcon } from "lucide-react"

import { Progress } from "@/components/ui/progress"
import type { TalonPlanStep } from "./types"

type AiChatPlanProps = {
  steps: TalonPlanStep[]
}

function StepIcon({ state }: { state: TalonPlanStep["state"] }) {
  switch (state) {
    case "complete":
      return <CheckIcon className="size-3.5 text-primary" />
    case "active":
      return <LoaderCircleIcon className="size-3.5 animate-spin text-primary" />
    case "failed":
    case "blocked":
      return <XIcon className="size-3.5 text-destructive" />
    default:
      return <CircleIcon className="size-3.5 text-muted-foreground" />
  }
}

export function AiChatPlan({ steps }: AiChatPlanProps) {
  const completed = steps.filter((step) => step.state === "complete").length
  const progress = Math.round((completed / steps.length) * 100)

  return (
    <div className="rounded-lg border border-border bg-card p-3">
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="text-sm font-medium">Execution plan</p>
        <span className="text-xs text-muted-foreground tabular-nums">
          {completed}/{steps.length}
        </span>
      </div>

      <Progress value={progress} className="mb-3 h-1.5" />

      <ol className="space-y-2">
        {steps.map((step) => (
          <li key={step.id} className="flex items-start gap-2 text-sm">
            <StepIcon state={step.state} />
            <span className="min-w-0 flex-1">{step.label}</span>
            {step.durationMs ? (
              <span className="text-xs text-muted-foreground tabular-nums">
                {Math.round(step.durationMs / 1000)}s
              </span>
            ) : null}
          </li>
        ))}
      </ol>
    </div>
  )
}
