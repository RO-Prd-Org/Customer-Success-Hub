"use client"

import { ChevronRightIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import type { InvoiceIssue } from "@/lib/demo-invoices"
import { InvoiceLeakageChain } from "@/views/invoices/invoice-leakage-chain"
import { cn } from "@/lib/utils"

type InvoiceIssueFlaggedProps = {
  issue: InvoiceIssue
  currency: string
}

export function InvoiceIssueFlagged({ issue, currency }: InvoiceIssueFlaggedProps) {
  return (
    <Collapsible defaultOpen={false} className="group/issue rounded-lg border border-border">
      <CollapsibleTrigger className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/40">
        <ChevronRightIcon className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-data-open/issue:rotate-90" />
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-3 gap-y-1">
          <span className="text-sm font-medium">{issue.findingId}</span>
          <span className="text-sm">{issue.type}</span>
          <span className="text-xs text-muted-foreground">
            {issue.recoverable ? "Recoverable" : "Operational"}
          </span>
        </div>
        <Badge variant="outline" className="ml-auto shrink-0 font-mono tabular-nums">
          {currency}{" "}
          {issue.amount.toLocaleString("en-AU", { minimumFractionDigits: 2 })}
        </Badge>
      </CollapsibleTrigger>
      <CollapsibleContent
        className={cn(
          "border-t border-border px-4 pb-4 pt-2",
          "data-open:animate-in data-open:fade-in-0 data-open:slide-in-from-top-1"
        )}
      >
        <InvoiceLeakageChain issue={issue} currency={currency} />
      </CollapsibleContent>
    </Collapsible>
  )
}
