"use client"

import * as React from "react"

import { DrillPage } from "@/components/patterns/drill-down"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { resolveInvoiceConversations } from "@/lib/synthesize-invoice-context"
import { getInvoicesNavLabel, type DemoInstance } from "@/lib/demo-instances"
import type { Invoice } from "@/lib/demo-invoices"
import { getAgentChecks } from "@/lib/invoice-detail-extras"
import { InvoiceAgentChecksTab } from "@/views/invoices/invoice-agent-checks-tab"
import { InvoiceContextTab } from "@/views/invoices/invoice-context-tab"
import { InvoiceDetailsHeader } from "@/views/invoices/invoice-details-header"
import { InvoiceInsightTab } from "@/views/invoices/invoice-insight-tab"
import { InvoiceLineItems } from "@/views/invoices/invoice-line-items"
import { InvoiceLogisticsFinancials } from "@/views/invoices/invoice-logistics-financials"
import { InvoiceProcessTab } from "@/views/invoices/invoice-process-tab"

type InvoiceDetailPageProps = {
  demo: DemoInstance
  invoice: Invoice
  onBack: () => void
}

export function InvoiceDetailPage({
  demo,
  invoice,
  onBack,
}: InvoiceDetailPageProps) {
  const conversations = React.useMemo(
    () => resolveInvoiceConversations(demo.id, invoice),
    [demo.id, invoice]
  )
  const failedChecks = React.useMemo(
    () => getAgentChecks(invoice, demo.id).filter((check) => check.status === "fail").length,
    [demo.id, invoice]
  )

  return (
    <DrillPage
      breadcrumbs={[
        { label: demo.name },
        { label: getInvoicesNavLabel(demo.id), onClick: onBack },
        { label: invoice.id },
      ]}
      onBack={onBack}
    >
      <div className="flex w-full min-w-0 flex-col gap-6 pb-12">
        <InvoiceDetailsHeader invoice={invoice} />
        {demo.id === "logistics" ? (
          <InvoiceLogisticsFinancials invoice={invoice} />
        ) : (
          <InvoiceLineItems invoice={invoice} demoId={demo.id} />
        )}

        <Tabs defaultValue="insight" className="w-full">
          <TabsList variant="line" className="h-auto flex-wrap">
            <TabsTrigger value="insight">Insight</TabsTrigger>
            <TabsTrigger value="context">
              Context
              {conversations.length > 0 ? (
                <span className="ml-1 text-muted-foreground">({conversations.length})</span>
              ) : null}
            </TabsTrigger>
            <TabsTrigger value="checks">
              Agent checks
              {failedChecks > 0 ? (
                <span className="ml-1 text-brand">({failedChecks})</span>
              ) : null}
            </TabsTrigger>
            <TabsTrigger value="process">Process</TabsTrigger>
          </TabsList>

          <TabsContent value="insight" className="mt-6">
            <InvoiceInsightTab invoice={invoice} />
          </TabsContent>

          <TabsContent value="context" className="mt-6">
            <InvoiceContextTab invoice={invoice} conversations={conversations} />
          </TabsContent>

          <TabsContent value="checks" className="mt-6">
            <InvoiceAgentChecksTab invoice={invoice} demoId={demo.id} />
          </TabsContent>

          <TabsContent value="process" className="mt-6">
            <InvoiceProcessTab invoice={invoice} />
          </TabsContent>
        </Tabs>
      </div>
    </DrillPage>
  )
}
