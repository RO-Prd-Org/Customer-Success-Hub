export type FileProcessingStatus = "uploading" | "processing" | "indexed"

export type FileKind =
  | "folder"
  | "plaintext"
  | "markdown"
  | "csv"
  | "parquet"
  | "binary"

export type FileNode = {
  id: string
  name: string
  kind: FileKind
  parentId: string | null
  status?: FileProcessingStatus
  sizeBytes?: number
  updatedAt: string
  favourite?: boolean
  mimeType?: string
}

export type IndexedTextContent = {
  type: "text"
  body: string
}

export type IndexedTableContent = {
  type: "table"
  columns: string[]
  rows: string[][]
}

export type IndexedBinaryContent = {
  type: "binary"
  description: string
}

export type IndexedFileContent =
  | IndexedTextContent
  | IndexedTableContent
  | IndexedBinaryContent

export type OriginalFileContent =
  | IndexedTextContent
  | IndexedTableContent
  | IndexedBinaryContent

export type FileContentBundle = {
  indexed: IndexedFileContent | null
  original: OriginalFileContent | null
}
