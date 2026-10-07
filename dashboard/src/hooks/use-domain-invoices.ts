import * as React from "react"

import type { DemoInstanceId } from "@/lib/demo-instances"
import type { Invoice } from "@/lib/demo-invoices"
import { loadDomainInvoices } from "@/lib/domain-invoices"

type UseDomainInvoicesResult = {
  invoices: Invoice[]
  loading: boolean
  error: string | null
  analyzedCount: number
}

export function useDomainInvoices(demoId: DemoInstanceId): UseDomainInvoicesResult {
  const [invoices, setInvoices] = React.useState<Invoice[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    loadDomainInvoices(demoId)
      .then((data) => {
        if (cancelled) return
        setInvoices(data)
      })
      .catch((cause: unknown) => {
        if (cancelled) return
        setInvoices([])
        setError(
          cause instanceof Error
            ? cause.message
            : "Failed to load agent domain objects"
        )
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [demoId])

  const analyzedCount = React.useMemo(
    () => invoices.filter((invoice) => !invoice.analysisPending).length,
    [invoices]
  )

  return { invoices, loading, error, analyzedCount }
}
