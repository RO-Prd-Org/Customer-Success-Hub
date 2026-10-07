"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { FileIcon } from "lucide-react"

import type { IndexedFileContent, OriginalFileContent } from "../types"

type FileContentViewProps = {
  content: IndexedFileContent | OriginalFileContent | null
  emptyMessage?: string
}

export function FileContentView({
  content,
  emptyMessage = "No preview available yet.",
}: FileContentViewProps) {
  if (!content) {
    return (
      <div className="flex min-h-48 items-center justify-center rounded-lg border border-dashed border-border p-8 text-sm text-muted-foreground">
        {emptyMessage}
      </div>
    )
  }

  if (content.type === "text") {
    return (
      <pre className="max-h-[calc(100vh-16rem)] overflow-auto rounded-lg border border-border bg-muted/30 p-4 text-sm leading-relaxed whitespace-pre-wrap">
        {content.body}
      </pre>
    )
  }

  if (content.type === "table") {
    return (
      <div className="overflow-hidden rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12 text-muted-foreground">#</TableHead>
              {content.columns.map((column) => (
                <TableHead key={column}>{column}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {content.rows.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                <TableCell className="text-muted-foreground tabular-nums">
                  {rowIndex + 1}
                </TableCell>
                {row.map((cell, cellIndex) => (
                  <TableCell key={cellIndex}>{cell}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }

  return (
    <div className="flex min-h-48 flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border bg-muted/20 p-8 text-center">
      <FileIcon className="size-10 text-muted-foreground" />
      <p className="max-w-md text-sm text-muted-foreground">{content.description}</p>
    </div>
  )
}
