import * as React from "react"

import { inferColumns, loadParquetFile, type ParquetRow } from "@/lib/parquet"

type UseParquetFileResult = {
  rows: ParquetRow[]
  columns: string[]
  loading: boolean
  error: string | null
}

export function useParquetFile(url: string | null): UseParquetFileResult {
  const [rows, setRows] = React.useState<ParquetRow[]>([])
  const [columns, setColumns] = React.useState<string[]>([])
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (!url) {
      setRows([])
      setColumns([])
      setError(null)
      return
    }

    let cancelled = false
    setLoading(true)
    setError(null)

    loadParquetFile(url)
      .then((data) => {
        if (cancelled) return
        setRows(data)
        setColumns(inferColumns(data))
      })
      .catch((cause: unknown) => {
        if (cancelled) return
        setRows([])
        setColumns([])
        setError(
          cause instanceof Error ? cause.message : "Failed to load parquet file"
        )
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [url])

  return { rows, columns, loading, error }
}
