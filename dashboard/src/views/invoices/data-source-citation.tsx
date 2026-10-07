import { TableIcon } from "lucide-react"

import type { LeakageFactSource } from "@/lib/demo-invoices"

type DataSourceCitationProps = {
  source: LeakageFactSource
}

function formatDatasetName(dataset: string) {
  return dataset.replace(/\.parquet$/, "").replace(/_/g, " ")
}

export function DataSourceCitation({ source }: DataSourceCitationProps) {
  return (
    <div className="mt-2 inline-flex items-center gap-1.5 rounded-md border border-border bg-muted/40 px-2 py-1 text-xs text-muted-foreground">
      <TableIcon className="size-3 shrink-0" />
      <span className="font-medium text-foreground">{formatDatasetName(source.dataset)}</span>
      <span>·</span>
      <span className="font-mono">{source.rowId}</span>
    </div>
  )
}
