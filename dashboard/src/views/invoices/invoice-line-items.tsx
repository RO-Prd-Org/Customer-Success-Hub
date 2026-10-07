import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { DemoInstanceId } from "@/lib/demo-instances"
import type { Invoice } from "@/lib/demo-invoices"
import { getInvoiceLineItems } from "@/lib/invoice-detail-extras"

type InvoiceLineItemsProps = {
  invoice: Invoice
  demoId: DemoInstanceId
}

function formatMoney(currency: string, amount: number) {
  return `${currency} ${amount.toLocaleString("en-AU", { minimumFractionDigits: 2 })}`
}

export function InvoiceLineItems({ invoice, demoId }: InvoiceLineItemsProps) {
  const lines = getInvoiceLineItems(invoice, demoId)
  const total = lines.reduce((sum, line) => sum + line.amount, 0)
  const refLabel = demoId === "logistics" ? "CRM ref" : "Cost center"

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Line items</CardTitle>
      </CardHeader>
      <CardContent className="px-0 pb-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="px-4">Line</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Qty</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>GL</TableHead>
              <TableHead className="px-4">{refLabel}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lines.map((line, index) => (
              <TableRow key={line.id}>
                <TableCell className="px-4 font-mono text-xs text-muted-foreground">
                  {String(index + 1).padStart(2, "0")}
                </TableCell>
                <TableCell className="max-w-[220px] whitespace-normal font-medium">
                  {line.description}
                </TableCell>
                <TableCell className="text-right font-mono tabular-nums">{line.quantity}</TableCell>
                <TableCell className="text-right font-mono tabular-nums">
                  {formatMoney(invoice.currency, line.amount)}
                </TableCell>
                <TableCell>
                  <div className="font-mono text-xs">{line.glCode}</div>
                  <div className="text-xs text-muted-foreground">{line.glName}</div>
                </TableCell>
                <TableCell className="px-4">
                  <div className="font-mono text-xs">{line.costCenter}</div>
                  <div className="text-xs text-muted-foreground">{line.costCenterName}</div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3} className="px-4">
                Total
              </TableCell>
              <TableCell className="text-right font-mono tabular-nums">
                {formatMoney(invoice.currency, total)}
              </TableCell>
              <TableCell colSpan={2} />
            </TableRow>
          </TableFooter>
        </Table>
      </CardContent>
    </Card>
  )
}
