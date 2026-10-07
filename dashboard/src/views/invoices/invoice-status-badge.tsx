import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { InvoiceStatus } from "@/lib/demo-invoices"

const statusConfig: Record<
  InvoiceStatus,
  { label: string; dotClass: string; badgeClass: string }
> = {
  red: {
    label: "Agent acted",
    dotClass: "bg-brand",
    badgeClass: "border-brand/30 bg-brand/5 text-foreground",
  },
  amber: {
    label: "Needs input",
    dotClass: "bg-chart-3",
    badgeClass: "border-border bg-muted text-foreground",
  },
  green: {
    label: "All clear",
    dotClass: "bg-chart-2",
    badgeClass: "border-border bg-background text-foreground",
  },
}

export function InvoiceStatusBadge({ status }: { status: InvoiceStatus }) {
  const config = statusConfig[status]

  return (
    <Badge variant="outline" className={cn("gap-1.5 font-normal", config.badgeClass)}>
      <span className={cn("size-2 rounded-full", config.dotClass)} aria-hidden />
      {config.label}
    </Badge>
  )
}
