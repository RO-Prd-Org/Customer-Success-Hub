import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import type { Invoice } from "@/lib/demo-invoices"
import { cn } from "@/lib/utils"
import { InvoiceStatusBadge } from "@/views/invoices/invoice-status-badge"

type InvoiceDetailsHeaderProps = {
  invoice: Invoice
}

function isVarianceField(key: string): boolean {
  return key === "Variance" || key === "Variance %"
}

function isNegativeNumber(value: string): boolean {
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed < 0
}

export function InvoiceDetailsHeader({ invoice }: InvoiceDetailsHeaderProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl font-semibold">{invoice.name}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{invoice.id}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <p className="font-mono text-lg tabular-nums">
              {invoice.currency}{" "}
              {invoice.amount.toLocaleString("en-AU", { minimumFractionDigits: 2 })}
            </p>
            {invoice.analysisPending ? (
              <span className="rounded-md border border-border px-2 py-1 text-xs text-muted-foreground">
                Pending analysis
              </span>
            ) : (
              <InvoiceStatusBadge status={invoice.status} />
            )}
          </div>
        </div>

        <Separator className="my-5" />

        <dl className="grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt className="text-xs text-muted-foreground">Vendor</dt>
            <dd className="mt-1 font-medium">{invoice.vendor}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Invoice date</dt>
            <dd className="mt-1">{invoice.invoiceDate}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Due date</dt>
            <dd className="mt-1">{invoice.dueDate}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Payment status</dt>
            <dd className="mt-1">{invoice.metadata["Payment status"] ?? "—"}</dd>
          </div>
        </dl>

        {Object.keys(invoice.metadata).length > 0 ? (
          <>
            <Separator className="my-5" />
            <dl className="grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2 lg:grid-cols-3">
              {Object.entries(invoice.metadata)
                .filter(([key]) => key !== "Payment status")
                .map(([key, value]) => (
                  <div key={key} className="flex justify-between gap-4 sm:block">
                    <dt className="text-xs text-muted-foreground">{key}</dt>
                    <dd
                      className={cn(
                        "mt-0.5 font-medium sm:mt-1",
                        isVarianceField(key) &&
                          (invoice.status === "red" || isNegativeNumber(value)) &&
                          "text-brand"
                      )}
                    >
                      {value}
                    </dd>
                  </div>
                ))}
            </dl>
          </>
        ) : null}
      </CardContent>
    </Card>
  )
}
