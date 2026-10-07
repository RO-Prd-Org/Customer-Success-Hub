"use client"

import * as React from "react"
import { createColumnHelper, useTable, type ColumnDef } from "@tanstack/react-table"

import { PageTopBar } from "@/components/patterns/page-shell"
import { dataTableFeatures, type DataTableFeatures } from "@/components/patterns/data-table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useParquetFile } from "@/hooks/use-parquet-file"
import {
  formatCellValue,
  formatHeader,
  isBooleanColumn,
  isNumericColumn,
} from "@/lib/format-cell"
import type { DemoDataFile, DemoInstance } from "@/lib/demo-instances"
import type { ParquetRow } from "@/lib/parquet"

const PAGE_SIZE = 25

type FilesPageProps = {
  demo: DemoInstance
  activeFile: DemoDataFile
}

function buildColumns(rows: ParquetRow[], columnKeys: string[]) {
  const helper = createColumnHelper<DataTableFeatures, ParquetRow>()

  return helper.columns(
    columnKeys.map((key) =>
      helper.accessor((row) => row[key], {
        id: key,
        header: formatHeader(key),
        cell: ({ getValue }) => {
          const value = getValue()
          if (isBooleanColumn(rows, key)) {
            return (
              <Badge variant={value ? "outline" : "secondary"}>
                {formatCellValue(value)}
              </Badge>
            )
          }
          const formatted = formatCellValue(value)
          return (
            <span
              className={
                isNumericColumn(rows, key)
                  ? "font-mono tabular-nums"
                  : undefined
              }
              title={typeof formatted === "string" ? formatted : undefined}
            >
              {formatted}
            </span>
          )
        },
      })
    )
  ) as ColumnDef<DataTableFeatures, ParquetRow>[]
}

export function FilesPage({ demo, activeFile }: FilesPageProps) {
  const [page, setPage] = React.useState(1)
  const fileUrl = `${demo.dataPrefix}/${activeFile.path}`
  const { rows, columns, loading, error } = useParquetFile(fileUrl)

  React.useEffect(() => {
    setPage(1)
  }, [fileUrl])

  const pageCount = Math.max(1, Math.ceil(rows.length / PAGE_SIZE))
  const pageRows = rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const tableColumns = React.useMemo(
    () => buildColumns(rows, columns),
    [rows, columns]
  )

  const table = useTable({
    features: dataTableFeatures,
    data: pageRows,
    columns: tableColumns,
  })

  return (
    <div className="flex flex-col gap-6">
      <PageTopBar
        breadcrumbs={[
          { label: demo.name },
          { label: "Files" },
          { label: activeFile.label },
        ]}
      />

      <div className="flex flex-col gap-3">
        <div>
          <h1 className="font-heading text-2xl font-semibold">{activeFile.label}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {activeFile.description}
          </p>
          <p className="mt-1 font-mono text-xs text-muted-foreground">
            {activeFile.path}
          </p>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Dataset preview</CardTitle>
            <CardDescription>
              {loading
                ? "Loading parquet file…"
                : error
                  ? "Failed to load parquet file"
                  : `${rows.length.toLocaleString()} rows · ${columns.length} columns`}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {loading ? (
              <div className="space-y-2">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            ) : error ? (
              <div className="rounded-lg border border-dashed border-border p-6 text-sm text-muted-foreground">
                {error}
              </div>
            ) : (
              <>
                <div className="overflow-x-auto rounded-lg border border-border">
                  <Table>
                    <TableHeader>
                      {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                          {headerGroup.headers.map((header) => (
                            <TableHead key={header.id} className="whitespace-nowrap">
                              {header.isPlaceholder ? null : (
                                <table.FlexRender header={header} />
                              )}
                            </TableHead>
                          ))}
                        </TableRow>
                      ))}
                    </TableHeader>
                    <TableBody>
                      {table.getRowModel().rows.length ? (
                        table.getRowModel().rows.map((row) => (
                          <TableRow key={row.id}>
                            {row.getAllCells().map((cell) => (
                              <TableCell key={cell.id} className="max-w-xs truncate">
                                <table.FlexRender cell={cell} />
                              </TableCell>
                            ))}
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={Math.max(columns.length, 1)}
                            className="h-24 text-center text-muted-foreground"
                          >
                            No rows in this file.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>

                {rows.length > PAGE_SIZE ? (
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
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
