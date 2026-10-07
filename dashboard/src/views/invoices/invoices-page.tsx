"use client"

import * as React from "react"
import { createColumnHelper, useTable, type ColumnDef } from "@tanstack/react-table"

import { PageTopBar } from "@/components/patterns/page-shell"
import { dataTableFeatures, type DataTableFeatures } from "@/components/patterns/data-table"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useDomainInvoices } from "@/hooks/use-domain-invoices"
import { exportRowsToCsv } from "@/lib/export-csv"
import { getInvoicesNavLabel, type DemoInstance } from "@/lib/demo-instances"
import type { Invoice, InvoiceStatus } from "@/lib/demo-invoices"
import { getVendorsFromInvoices } from "@/lib/domain-invoices"
import { InvoiceDetailPage } from "@/views/invoices/invoice-detail-page"
import { InvoiceStatusBadge } from "@/views/invoices/invoice-status-badge"
import { VendorCombobox } from "@/views/invoices/vendor-combobox"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { DownloadIcon } from "lucide-react"

type InvoicesPageProps = {
  demo: DemoInstance
}

type StatusFilter = InvoiceStatus | "all" | "pending"

type Filters = {
  vendor: string
  status: StatusFilter
  search: string
  dateFrom: string
  dateTo: string
}

type StatusCounts = {
  red: number
  amber: number
  green: number
  pending: number
}

function countStatuses(invoices: Invoice[]): StatusCounts {
  return invoices.reduce<StatusCounts>(
    (counts, invoice) => {
      if (invoice.analysisPending) {
        counts.pending += 1
      } else {
        counts[invoice.status] += 1
      }
      return counts
    },
    { red: 0, amber: 0, green: 0, pending: 0 }
  )
}

function matchesStatusFilter(invoice: Invoice, status: StatusFilter): boolean {
  if (status === "all") return true
  if (status === "pending") return Boolean(invoice.analysisPending)
  return !invoice.analysisPending && invoice.status === status
}

function filterInvoices(invoices: Invoice[], filters: Filters): Invoice[] {
  return invoices.filter((invoice) => {
    if (filters.vendor !== "all" && invoice.vendor !== filters.vendor) return false
    if (!matchesStatusFilter(invoice, filters.status)) return false
    if (filters.dateFrom && invoice.invoiceDate < filters.dateFrom) return false
    if (filters.dateTo && invoice.invoiceDate > filters.dateTo) return false
    if (filters.search) {
      const query = filters.search.toLowerCase()
      if (
        !invoice.id.toLowerCase().includes(query) &&
        !invoice.name.toLowerCase().includes(query)
      ) {
        return false
      }
    }
    return true
  })
}

const PAGE_SIZE = 100

const columnHelper = createColumnHelper<DataTableFeatures, Invoice>()

export function InvoicesPage({ demo }: InvoicesPageProps) {
  const { invoices: allInvoices, loading, error, analyzedCount } =
    useDomainInvoices(demo.id)
  const vendors = React.useMemo(
    () => getVendorsFromInvoices(allInvoices),
    [allInvoices]
  )
  const statusCounts = React.useMemo(
    () => countStatuses(allInvoices),
    [allInvoices]
  )

  const [filters, setFilters] = React.useState<Filters>({
    vendor: "all",
    status: "all",
    search: "",
    dateFrom: "",
    dateTo: "",
  })
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set())
  const [selectedInvoice, setSelectedInvoice] = React.useState<Invoice | null>(null)
  const [page, setPage] = React.useState(1)

  const filteredInvoices = React.useMemo(() => {
    return filterInvoices(allInvoices, filters).sort(
      (a, b) => b.invoiceDate.localeCompare(a.invoiceDate)
    )
  }, [allInvoices, filters])

  const pageCount = Math.max(1, Math.ceil(filteredInvoices.length / PAGE_SIZE))

  const paginatedInvoices = React.useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return filteredInvoices.slice(start, start + PAGE_SIZE)
  }, [filteredInvoices, page])

  React.useEffect(() => {
    setSelectedIds(new Set())
    setSelectedInvoice(null)
    setPage(1)
  }, [demo.id])

  React.useEffect(() => {
    setPage(1)
  }, [filters])

  React.useEffect(() => {
    setPage((current) => Math.min(current, pageCount))
  }, [pageCount])

  const toggleAll = (checked: boolean) => {
    setSelectedIds((current) => {
      const next = new Set(current)
      for (const invoice of paginatedInvoices) {
        if (checked) next.add(invoice.id)
        else next.delete(invoice.id)
      }
      return next
    })
  }

  const toggleOne = (invoiceId: string, checked: boolean) => {
    setSelectedIds((current) => {
      const next = new Set(current)
      if (checked) next.add(invoiceId)
      else next.delete(invoiceId)
      return next
    })
  }

  const allSelected =
    paginatedInvoices.length > 0 &&
    paginatedInvoices.every((invoice) => selectedIds.has(invoice.id))

  const rangeStart =
    filteredInvoices.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1
  const rangeEnd = Math.min(page * PAGE_SIZE, filteredInvoices.length)

  const columns = React.useMemo(
    () =>
      columnHelper.columns([
        columnHelper.display({
          id: "select",
          header: () => (
            <Checkbox
              checked={allSelected}
              onCheckedChange={(checked) => toggleAll(checked === true)}
              aria-label="Select all invoices"
              onClick={(event) => event.stopPropagation()}
            />
          ),
          cell: ({ row }) => (
            <Checkbox
              checked={selectedIds.has(row.original.id)}
              onCheckedChange={(checked) =>
                toggleOne(row.original.id, checked === true)
              }
              aria-label={`Select ${row.original.id}`}
              onClick={(event) => event.stopPropagation()}
            />
          ),
        }),
        columnHelper.accessor("id", { header: "Invoice ID" }),
        columnHelper.accessor("name", { header: "Name" }),
        columnHelper.accessor("vendor", { header: "Vendor" }),
        columnHelper.accessor("invoiceDate", { header: "Date" }),
        columnHelper.accessor("amount", {
          header: "Amount",
          cell: ({ row }) => (
            <span className="font-mono tabular-nums">
              {row.original.currency}{" "}
              {row.original.amount.toLocaleString("en-AU", {
                minimumFractionDigits: 2,
              })}
            </span>
          ),
        }),
        columnHelper.accessor("status", {
          header: "Status",
          cell: ({ row }) =>
            row.original.analysisPending ? (
              <span className="text-xs text-muted-foreground">Pending analysis</span>
            ) : (
              <InvoiceStatusBadge status={row.original.status} />
            ),
        }),
      ]) as ColumnDef<DataTableFeatures, Invoice>[],
    [allSelected, paginatedInvoices, selectedIds]
  )

  const table = useTable({
    features: dataTableFeatures,
    data: paginatedInvoices,
    columns,
  })

  if (selectedInvoice) {
    return (
      <InvoiceDetailPage
        demo={demo}
        invoice={selectedInvoice}
        onBack={() => setSelectedInvoice(null)}
      />
    )
  }

  const handleExport = () => {
    const rowsToExport =
      selectedIds.size > 0
        ? filteredInvoices.filter((invoice) => selectedIds.has(invoice.id))
        : filteredInvoices

    exportRowsToCsv(
      rowsToExport.map((invoice) => ({
        invoice_id: invoice.id,
        name: invoice.name,
        vendor: invoice.vendor,
        invoice_date: invoice.invoiceDate,
        due_date: invoice.dueDate,
        amount: invoice.amount,
        currency: invoice.currency,
        status: invoice.status,
        issues: invoice.issues?.map((issue) => issue.findingId).join("; ") ?? "",
        leakage_amount:
          invoice.issues?.reduce((total, issue) => total + issue.amount, 0) ?? "",
      })),
      [
        { key: "invoice_id", label: "Invoice ID" },
        { key: "name", label: "Name" },
        { key: "vendor", label: "Vendor" },
        { key: "invoice_date", label: "Invoice Date" },
        { key: "due_date", label: "Due Date" },
        { key: "amount", label: "Amount" },
        { key: "currency", label: "Currency" },
        { key: "status", label: "Status" },
        { key: "issues", label: "Findings" },
        { key: "leakage_amount", label: "Total Leakage" },
      ],
      `${demo.id}-invoices-export.csv`
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <PageTopBar
        breadcrumbs={[
          { label: demo.name },
          { label: getInvoicesNavLabel(demo.id) },
        ]}
      />

      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="font-heading text-2xl font-semibold">
              {getInvoicesNavLabel(demo.id)}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Loaded from agent domain objects — {analyzedCount} of {allInvoices.length}{" "}
              invoices analyzed.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={handleExport}
            disabled={filteredInvoices.length === 0}
          >
            <DownloadIcon data-icon="inline-start" />
            Export CSV
            {selectedIds.size > 0 ? ` (${selectedIds.size})` : ""}
          </Button>
        </div>

        <div className="flex flex-wrap items-end gap-3 rounded-lg border border-border bg-muted/30 p-3">
          <div className="flex flex-col gap-1.5">
            <span className="text-xs text-muted-foreground">Vendor</span>
            <VendorCombobox
              vendors={vendors}
              value={filters.vendor}
              onChange={(vendor) => setFilters((current) => ({ ...current, vendor }))}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-xs text-muted-foreground">Status</span>
            <Select
              value={filters.status}
              onValueChange={(status) =>
                setFilters((current) => ({
                  ...current,
                  status: status as StatusFilter,
                }))
              }
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  All statuses ({allInvoices.length})
                </SelectItem>
                <SelectItem value="red">
                  Agent acted ({statusCounts.red})
                </SelectItem>
                <SelectItem value="amber">
                  Needs input ({statusCounts.amber})
                </SelectItem>
                <SelectItem value="green">
                  All clear ({statusCounts.green})
                </SelectItem>
                <SelectItem value="pending">
                  Pending analysis ({statusCounts.pending})
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-xs text-muted-foreground">From</span>
            <Input
              type="date"
              className="w-[160px]"
              value={filters.dateFrom}
              onChange={(event) =>
                setFilters((current) => ({ ...current, dateFrom: event.target.value }))
              }
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-xs text-muted-foreground">To</span>
            <Input
              type="date"
              className="w-[160px]"
              value={filters.dateTo}
              onChange={(event) =>
                setFilters((current) => ({ ...current, dateTo: event.target.value }))
              }
            />
          </div>
          <div className="flex min-w-[220px] flex-1 flex-col gap-1.5">
            <span className="text-xs text-muted-foreground">Search</span>
            <Input
              placeholder="Invoice ID or name…"
              value={filters.search}
              onChange={(event) =>
                setFilters((current) => ({ ...current, search: event.target.value }))
              }
            />
          </div>
        </div>

        {error ? (
          <Alert variant="destructive">
            <AlertTitle>Could not load agent output</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}

        <div className="overflow-hidden rounded-lg border border-border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : (
                        <table.FlexRender header={header} />
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 8 }).map((_, index) => (
                  <TableRow key={`invoice-skeleton-${index}`}>
                    {columns.map((column) => (
                      <TableCell key={`invoice-skeleton-${index}-${column.id ?? "col"}`}>
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.original.id}
                    tabIndex={0}
                    className="cursor-pointer focus-visible:bg-muted/50 focus-visible:outline-none"
                    onClick={() => setSelectedInvoice(row.original)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault()
                        setSelectedInvoice(row.original)
                      }
                    }}
                  >
                    {row.getAllCells().map((cell) => (
                      <TableCell key={cell.id}>
                        <table.FlexRender cell={cell} />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No invoices match your filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {!loading && filteredInvoices.length > 0 ? (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              Showing {rangeStart}–{rangeEnd} of {filteredInvoices.length}
              {filters.status !== "all" || filters.vendor !== "all" || filters.search
                ? ` (filtered from ${allInvoices.length})`
                : null}
            </p>
            {filteredInvoices.length > PAGE_SIZE ? (
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(event) => {
                        event.preventDefault()
                        setPage((current) => Math.max(1, current - 1))
                      }}
                      aria-disabled={page <= 1}
                      className={page <= 1 ? "pointer-events-none opacity-50" : undefined}
                    />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#" isActive>
                      {page} / {pageCount}
                    </PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(event) => {
                        event.preventDefault()
                        setPage((current) => Math.min(pageCount, current + 1))
                      }}
                      aria-disabled={page >= pageCount}
                      className={
                        page >= pageCount ? "pointer-events-none opacity-50" : undefined
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  )
}
