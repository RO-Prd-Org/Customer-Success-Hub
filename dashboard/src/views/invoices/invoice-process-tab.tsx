import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Invoice } from "@/lib/demo-invoices"
import { getProcessState } from "@/lib/invoice-detail-extras"
import { cn } from "@/lib/utils"

type InvoiceProcessTabProps = {
  invoice: Invoice
}

export function InvoiceProcessTab({ invoice }: InvoiceProcessTabProps) {
  const process = getProcessState(invoice)

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Processing stage</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <ol className="flex items-start">
          {process.nodes.map((node, index) => {
            const complete = index < process.currentIndex
            const current = index === process.currentIndex
            return (
              <li key={node.id} className="flex flex-1 flex-col items-center text-center">
                <div className="flex w-full items-center">
                  <div
                    className={cn(
                      "h-px flex-1",
                      index === 0 ? "bg-transparent" : complete || current ? "bg-brand" : "bg-border"
                    )}
                  />
                  <div
                    className={cn(
                      "flex size-8 shrink-0 items-center justify-center rounded-full border text-xs font-medium",
                      complete && "border-brand bg-brand text-white",
                      current && "border-brand bg-brand/10 text-brand",
                      !complete && !current && "border-border text-muted-foreground"
                    )}
                  >
                    {index + 1}
                  </div>
                  <div
                    className={cn(
                      "h-px flex-1",
                      index === process.nodes.length - 1
                        ? "bg-transparent"
                        : complete
                          ? "bg-brand"
                          : "bg-border"
                    )}
                  />
                </div>
                <p
                  className={cn(
                    "mt-3 text-sm font-medium",
                    current ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {node.label}
                </p>
                <p className="mt-1 max-w-[11rem] text-xs leading-relaxed text-muted-foreground">
                  {node.caption}
                </p>
              </li>
            )
          })}
        </ol>
        <p className="text-sm leading-relaxed text-muted-foreground">{process.summary}</p>
      </CardContent>
    </Card>
  )
}
