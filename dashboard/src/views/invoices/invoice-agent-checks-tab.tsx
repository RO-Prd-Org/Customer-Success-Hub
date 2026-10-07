import { AlertCircleIcon, CheckCircle2Icon, CircleDashedIcon, XCircleIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { DemoInstanceId } from "@/lib/demo-instances"
import type { Invoice } from "@/lib/demo-invoices"
import {
  getAgentChecks,
  type AgentCheck,
  type AgentCheckStatus,
} from "@/lib/invoice-detail-extras"
import { cn } from "@/lib/utils"

type InvoiceAgentChecksTabProps = {
  invoice: Invoice
  demoId: DemoInstanceId
}

const categories = [
  "Invoice validation",
  "Vendor validation",
  "PO validation",
  "Contract validation",
] as const

const statusLabel: Record<AgentCheckStatus, string> = {
  pass: "Pass",
  fail: "Fail",
  review: "Review",
  queued: "Queued",
}

function StatusIcon({ status }: { status: AgentCheckStatus }) {
  if (status === "fail") return <XCircleIcon className="size-4 text-brand" />
  if (status === "review") return <AlertCircleIcon className="size-4 text-chart-3" />
  if (status === "queued") return <CircleDashedIcon className="size-4 text-muted-foreground" />
  return <CheckCircle2Icon className="size-4 text-chart-2" />
}

function CheckRow({ check }: { check: AgentCheck }) {
  return (
    <div className="flex gap-3 border-b border-border px-4 py-3 last:border-b-0">
      <div className="mt-0.5 shrink-0">
        <StatusIcon status={check.status} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-medium">{check.name}</p>
          <Badge
            variant="outline"
            className={cn(
              "font-normal",
              check.status === "fail" && "border-brand/30 text-brand",
              check.status === "review" && "border-chart-3/30 text-chart-3"
            )}
          >
            {statusLabel[check.status]}
          </Badge>
        </div>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{check.detail}</p>
      </div>
    </div>
  )
}

export function InvoiceAgentChecksTab({ invoice, demoId }: InvoiceAgentChecksTabProps) {
  const checks = getAgentChecks(invoice, demoId)
  const failed = checks.filter((check) => check.status === "fail").length
  const review = checks.filter((check) => check.status === "review").length

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">
        {checks.length} mandatory checks on every invoice
        {failed ? ` · ${failed} failed` : ""}
        {review ? ` · ${review} need review` : ""}
        . Contract checks are the same criteria Insight uses to match billed lines to what was
        agreed.
      </p>
      {categories.map((category) => {
        const rows = checks.filter((check) => check.category === category)
        return (
          <Card key={category}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{category}</CardTitle>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              {rows.map((check) => (
                <CheckRow key={check.id} check={check} />
              ))}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
