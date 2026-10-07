import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { Invoice } from "@/lib/demo-invoices"
import { getInvoiceLogisticsFinancials } from "@/lib/invoice-logistics-financials"

type InvoiceLogisticsFinancialsProps = {
  invoice: Invoice
}

function formatMoney(amount: number) {
  return amount.toLocaleString("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

export function InvoiceLogisticsFinancials({ invoice }: InvoiceLogisticsFinancialsProps) {
  const financials = getInvoiceLogisticsFinancials(invoice)

  return (
    <section className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-red-200 shadow-sm dark:border-red-900/50">
          <CardHeader className="border-b bg-red-50/30 pb-3 dark:bg-red-950/20">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold text-red-600 dark:text-red-400">
                  Job costs
                </CardTitle>
                <CardDescription>Subcontractor, fuel, toll, and 3PL on this job</CardDescription>
              </div>
              <div className="text-right">
                <span className="block text-xs text-muted-foreground">Total Costs</span>
                <span className="font-mono text-xl font-bold text-red-600 dark:text-red-400">
                  {formatMoney(financials.costs)}
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-4">Cost</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead className="pr-4 text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {financials.costLines.map((line) => (
                  <TableRow key={line.id}>
                    <TableCell className="pl-4 text-xs font-medium">{line.description}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{line.supplier}</TableCell>
                    <TableCell className="pr-4 text-right font-mono text-xs font-semibold tabular-nums text-red-600 dark:text-red-400">
                      {formatMoney(line.amount)}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="border-t-2 bg-muted/40 font-semibold">
                  <TableCell className="pl-4 text-xs" colSpan={2}>
                    Total costs
                  </TableCell>
                  <TableCell className="pr-4 text-right font-mono text-sm font-bold tabular-nums text-red-600 dark:text-red-400">
                    {formatMoney(financials.costs)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm">
          <CardHeader className="border-b bg-muted/20 pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold text-foreground">
                  Customer billing
                </CardTitle>
                <CardDescription>Freight and accessorial revenue on this invoice</CardDescription>
              </div>
              <div className="text-right">
                <span className="block text-xs text-muted-foreground">Total Billing</span>
                <span className="font-mono text-xl font-bold text-foreground">
                  {formatMoney(financials.billing)}
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="pl-4">Revenue line</TableHead>
                  <TableHead>CRM ref</TableHead>
                  <TableHead className="pr-4 text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {financials.billingLines.map((line) => (
                  <TableRow key={line.id}>
                    <TableCell className="pl-4 text-xs font-medium">{line.description}</TableCell>
                    <TableCell>
                      <div className="font-mono text-xs">{line.costCenter}</div>
                      <div className="text-xs text-muted-foreground">{line.costCenterName}</div>
                    </TableCell>
                    <TableCell className="pr-4 text-right font-mono text-xs font-semibold tabular-nums text-foreground">
                      {formatMoney(line.amount)}
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow className="border-t-2 bg-muted/40 font-semibold">
                  <TableCell className="pl-4 text-xs" colSpan={2}>
                    Total customer billing
                  </TableCell>
                  <TableCell className="pr-4 text-right font-mono text-sm font-bold tabular-nums text-foreground">
                    {formatMoney(financials.billing)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Card className="border-border bg-card p-4 shadow-sm">
          <div className="flex flex-col">
            <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              Gross (Actual profit)
            </span>
            <span className="mt-1 font-mono text-2xl font-bold text-foreground">
              {formatMoney(financials.gross)}
            </span>
            <span className="mt-1 text-xs text-muted-foreground">
              Customer Billing ({formatMoney(financials.billing)}) − Costs (
              {formatMoney(financials.costs)})
            </span>
          </div>
        </Card>

        <Card className="border-red-200 bg-red-50/50 p-4 shadow-sm dark:border-red-900/50 dark:bg-red-950/20">
          <div className="flex flex-col">
            <span className="text-xs font-semibold tracking-wider text-red-600 uppercase dark:text-red-400">
              Leakage
            </span>
            <span className="mt-1 font-mono text-2xl font-bold text-red-600 dark:text-red-400">
              {formatMoney(financials.leakage)}
            </span>
            <span className="mt-1 text-xs text-red-600/80 dark:text-red-400/80">
              Unrecovered pass-throughs and recovery gaps
            </span>
          </div>
        </Card>

        <Card className="border-emerald-200 bg-emerald-50/50 p-4 shadow-sm dark:border-emerald-900/50 dark:bg-emerald-950/20">
          <div className="flex flex-col">
            <span className="text-xs font-semibold tracking-wider text-emerald-600 uppercase dark:text-emerald-400">
              Potential Profit
            </span>
            <span className="mt-1 font-mono text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {formatMoney(financials.potentialProfit)}
            </span>
            <span className="mt-1 text-xs text-emerald-700/80 dark:text-emerald-400/80">
              Gross Profit ({formatMoney(financials.gross)}) + Leakage (
              {formatMoney(financials.leakage)})
            </span>
          </div>
        </Card>
      </div>
    </section>
  )
}
