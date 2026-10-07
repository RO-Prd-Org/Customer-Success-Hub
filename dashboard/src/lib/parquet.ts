import { parquetReadObjects } from "hyparquet"

export type ParquetRow = Record<string, unknown>

type AsyncBuffer = {
  byteLength: number
  slice: (start: number, end?: number) => ArrayBuffer
}

function bufferFromArrayBuffer(data: ArrayBuffer): AsyncBuffer {
  return {
    byteLength: data.byteLength,
    slice(start: number, end?: number) {
      return data.slice(start, end)
    },
  }
}

function assertValidParquetBuffer(data: ArrayBuffer, url: string) {
  if (data.byteLength < 8) {
    throw new Error(
      `Agent output at ${url} is missing or empty. Re-seed it from the agents folder: npm run seed:domain -- --domain fashion`
    )
  }

  const bytes = new Uint8Array(data)
  const magic = String.fromCharCode(bytes[0], bytes[1], bytes[2], bytes[3])
  const footer = String.fromCharCode(
    bytes[bytes.length - 4],
    bytes[bytes.length - 3],
    bytes[bytes.length - 2],
    bytes[bytes.length - 1]
  )

  if (magic !== "PAR1" || footer !== "PAR1") {
    throw new Error(
      `Agent output at ${url} is corrupted. Remove any stale domain_objects.parquet.lock file, then run: npm run seed:domain -- --domain fashion`
    )
  }
}

export async function loadParquetFile(url: string): Promise<ParquetRow[]> {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(
      response.status === 404
        ? `Agent output not found at ${url}. Run npm run seed:domain in the agents folder first.`
        : `Failed to fetch ${url} (${response.status})`
    )
  }

  const data = await response.arrayBuffer()
  assertValidParquetBuffer(data, url)
  const rows = await parquetReadObjects({ file: bufferFromArrayBuffer(data) })
  return rows as ParquetRow[]
}

export function inferColumns(rows: ParquetRow[]): string[] {
  if (!rows.length) return []
  const keys = new Set<string>()
  for (const row of rows.slice(0, 50)) {
    for (const key of Object.keys(row)) {
      keys.add(key)
    }
  }
  return Array.from(keys)
}
