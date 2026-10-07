import { ArrowDownIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import type { InvoiceIssue } from "@/lib/demo-invoices"
import { cn } from "@/lib/utils"
import { DataSourceCitation } from "@/views/invoices/data-source-citation"

type InvoiceLeakageChainProps = {
  issue: InvoiceIssue
  currency: string
  className?: string
}

export function InvoiceLeakageChain({
  issue,
  currency,
  className,
}: InvoiceLeakageChainProps) {
  return (
    <div className={cn("flex flex-col", className)}>
      <div className="flex flex-col">
        {issue.facts.map((fact, index) => (
          <div key={index} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-background text-sm font-medium">
                {index + 1}
              </div>
              {index < issue.facts.length - 1 ? (
                <div className="my-1 w-px flex-1 bg-border" />
              ) : (
                <ArrowDownIcon className="my-2 size-4 text-muted-foreground" />
              )}
            </div>
            <div className="min-w-0 flex-1 pb-6 pt-1">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Fact {index + 1}
              </p>
              <p className="mt-1 text-sm leading-relaxed">{fact.text}</p>
              <DataSourceCitation source={fact.source} />
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-brand bg-accent p-5">
        <p className="text-xs font-medium uppercase tracking-wide text-accent-foreground">
          Therefore, this is leakage
        </p>
        <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
          <p className="font-medium">{issue.type}</p>
          <Badge variant="outline" className="font-mono tabular-nums text-base">
            {currency}{" "}
            {issue.amount.toLocaleString("en-AU", { minimumFractionDigits: 2 })}
          </Badge>
        </div>
      </div>
    </div>
  )
}
