import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Invoice } from "@/lib/demo-invoices"
import { InvoiceIssueFlagged } from "@/views/invoices/invoice-issue-flagged"

type InvoiceInsightTabProps = {
  invoice: Invoice
}

export function InvoiceInsightTab({ invoice }: InvoiceInsightTabProps) {
  const hasIssues = invoice.issues && invoice.issues.length > 0

  if (invoice.analysisPending) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Awaiting analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed text-muted-foreground">
            This invoice is in the domain object file but has not been replayed by the EVE
            agent yet. Run replay to populate issues, reasoning, and agent action.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {hasIssues ? (
        <div className="flex flex-col gap-3">
          <h2 className="text-sm font-medium">Issues flagged</h2>
          <div className="flex flex-col gap-2">
            {invoice.issues!.map((issue) => (
              <InvoiceIssueFlagged
                key={issue.id}
                issue={issue}
                currency={invoice.currency}
              />
            ))}
          </div>
        </div>
      ) : (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Assessment</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-muted-foreground">{invoice.reasoning}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Agent action</CardTitle>
        </CardHeader>
        <CardContent>
          {invoice.agentAction ? (
            <p className="text-sm leading-relaxed">{invoice.agentAction}</p>
          ) : invoice.status === "amber" ? (
            <p className="text-sm leading-relaxed text-muted-foreground">
              Waiting for your decision before the agent can proceed.
            </p>
          ) : (
            <p className="text-sm leading-relaxed text-muted-foreground">
              No agent action required — invoice cleared within tolerance.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
