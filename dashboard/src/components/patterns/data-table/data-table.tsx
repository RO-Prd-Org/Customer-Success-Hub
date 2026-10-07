"use client"

import * as React from "react"
import {
  useTable,
  type ColumnDef,
  type RowData,
} from "@tanstack/react-table"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ChevronRightIcon } from "lucide-react"
import {
  dataTableFeatures,
  type DataTableFeatures,
} from "./data-table-features"
import type { DataTableRowVariant } from "./types"

type TalonDataTableProps<TData extends RowData> = {
  columns: ColumnDef<DataTableFeatures, TData>[]
  data: TData[]
  rowVariant: DataTableRowVariant
  onRowDrillIn: (row: TData) => void
  renderRowActions?: (row: TData) => React.ReactNode
  drillInLabel?: string
  className?: string
  emptyMessage?: string
}

function stopRowActivation(event: React.SyntheticEvent) {
  event.stopPropagation()
}

export function TalonDataTable<TData extends RowData>({
  columns,
  data,
  rowVariant,
  onRowDrillIn,
  renderRowActions,
  drillInLabel = "View",
  className,
  emptyMessage = "No results.",
}: TalonDataTableProps<TData>) {
  const table = useTable({
    features: dataTableFeatures,
    data,
    columns,
  })

  const handleRowClick = React.useCallback(
    (row: TData) => {
      if (rowVariant !== "clickable") return
      onRowDrillIn(row)
    },
    [onRowDrillIn, rowVariant]
  )

  const handleRowKeyDown = React.useCallback(
    (event: React.KeyboardEvent, row: TData) => {
      if (rowVariant !== "clickable") return
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault()
        onRowDrillIn(row)
      }
    },
    [onRowDrillIn, rowVariant]
  )

  return (
    <div
      className={cn("overflow-hidden rounded-lg border border-border", className)}
    >
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
              {rowVariant === "action" ? (
                <TableHead className="w-[1%] text-right">Actions</TableHead>
              ) : null}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-variant={rowVariant}
                tabIndex={rowVariant === "clickable" ? 0 : undefined}
                className={cn(
                  rowVariant === "clickable" &&
                    "cursor-pointer focus-visible:bg-muted/50 focus-visible:outline-none"
                )}
                onClick={() => handleRowClick(row.original)}
                onKeyDown={(event) => handleRowKeyDown(event, row.original)}
              >
                {row.getAllCells().map((cell) => (
                  <TableCell key={cell.id}>
                    <table.FlexRender cell={cell} />
                  </TableCell>
                ))}
                {rowVariant === "action" ? (
                  <TableCell className="text-right">
                    <div
                      className="flex items-center justify-end gap-1"
                      onClick={stopRowActivation}
                      onKeyDown={stopRowActivation}
                    >
                      {renderRowActions?.(row.original)}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRowDrillIn(row.original)}
                      >
                        {drillInLabel}
                        <ChevronRightIcon data-icon="inline-end" />
                      </Button>
                    </div>
                  </TableCell>
                ) : null}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length + (rowVariant === "action" ? 1 : 0)}
                className="h-24 text-center text-muted-foreground"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
