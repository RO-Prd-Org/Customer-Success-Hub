import type { FileContentBundle, FileNode } from "./types"

export const INITIAL_FILES: FileNode[] = [
  {
    id: "root",
    name: "Files",
    kind: "folder",
    parentId: null,
    updatedAt: "2026-03-10T08:00:00Z",
  },
  {
    id: "folder-reports",
    name: "Reports",
    kind: "folder",
    parentId: "root",
    updatedAt: "2026-03-09T14:20:00Z",
    favourite: true,
  },
  {
    id: "folder-uploads",
    name: "Uploads",
    kind: "folder",
    parentId: "root",
    updatedAt: "2026-03-10T11:05:00Z",
  },
  {
    id: "file-readme",
    name: "workspace-notes.md",
    kind: "markdown",
    parentId: "root",
    status: "indexed",
    sizeBytes: 2048,
    updatedAt: "2026-03-08T09:15:00Z",
    favourite: true,
  },
  {
    id: "file-policy",
    name: "data-policy.txt",
    kind: "plaintext",
    parentId: "root",
    status: "indexed",
    sizeBytes: 890,
    updatedAt: "2026-03-07T16:40:00Z",
  },
  {
    id: "file-vendors",
    name: "vendors-q1.csv",
    kind: "csv",
    parentId: "folder-reports",
    status: "indexed",
    sizeBytes: 12400,
    updatedAt: "2026-03-09T14:20:00Z",
    favourite: true,
  },
  {
    id: "file-events",
    name: "audit-events.parquet",
    kind: "parquet",
    parentId: "folder-reports",
    status: "indexed",
    sizeBytes: 482000,
    updatedAt: "2026-03-09T12:00:00Z",
  },
  {
    id: "file-contract",
    name: "vendor-contract.pdf",
    kind: "binary",
    parentId: "folder-uploads",
    status: "processing",
    sizeBytes: 2400000,
    updatedAt: "2026-03-10T10:55:00Z",
    mimeType: "application/pdf",
  },
  {
    id: "file-export",
    name: "raw-export.bin",
    kind: "binary",
    parentId: "folder-uploads",
    status: "uploading",
    sizeBytes: 890000,
    updatedAt: "2026-03-10T11:05:00Z",
    mimeType: "application/octet-stream",
  },
]

export const FILE_CONTENT: Record<string, FileContentBundle> = {
  "file-readme": {
    indexed: {
      type: "text",
      body: `# Workspace notes

Indexed markdown preview — parsed and chunked for the assistant.

- Vendor onboarding checklist updated
- Export automation runs nightly
- Security review due Friday`,
    },
    original: {
      type: "text",
      body: `# Workspace notes (original upload)

Raw markdown file as stored in object storage.`,
    },
  },
  "file-policy": {
    indexed: {
      type: "text",
      body: `Data retention policy (indexed extract)

Records are retained for 7 years. PII fields are masked before indexing.
External exports require approval from Legal.`,
    },
    original: {
      type: "text",
      body: `DATA RETENTION POLICY v2.1
Full plaintext source document...`,
    },
  },
  "file-vendors": {
    indexed: {
      type: "table",
      columns: ["vendor", "region", "spend_usd", "status"],
      rows: [
        ["Acme Corp", "APAC", "420000", "active"],
        ["Northwind", "EMEA", "310000", "active"],
        ["Globex", "AMER", "180000", "review"],
        ["Initech", "APAC", "95000", "archived"],
      ],
    },
    original: {
      type: "table",
      columns: ["vendor", "region", "spend_usd", "status", "internal_id"],
      rows: [
        ["Acme Corp", "APAC", "420000", "active", "V-1001"],
        ["Northwind", "EMEA", "310000", "active", "V-1002"],
        ["Globex", "AMER", "180000", "review", "V-1003"],
        ["Initech", "APAC", "95000", "archived", "V-1004"],
      ],
    },
  },
  "file-events": {
    indexed: {
      type: "table",
      columns: ["event_id", "actor", "action", "timestamp"],
      rows: [
        ["E-001", "alex@redowl.io", "export.approved", "2026-03-09T08:12:00Z"],
        ["E-002", "sam@redowl.io", "policy.updated", "2026-03-09T09:44:00Z"],
        ["E-003", "jamie@redowl.io", "vendor.created", "2026-03-09T11:01:00Z"],
      ],
    },
    original: {
      type: "binary",
      description: "Parquet columnar file — 482 KB on disk. Open in an analytics tool for the raw schema.",
    },
  },
  "file-contract": {
    indexed: null,
    original: {
      type: "binary",
      description: "PDF binary — vendor-contract.pdf (2.4 MB). Still processing for LLM indexing.",
    },
  },
  "file-export": {
    indexed: null,
    original: {
      type: "binary",
      description: "Binary upload in progress — raw-export.bin (890 KB).",
    },
  },
}

export function formatFileSize(bytes?: number) {
  if (bytes == null) return "—"
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function kindLabel(kind: FileNode["kind"]) {
  switch (kind) {
    case "folder":
      return "Folder"
    case "plaintext":
      return "Plain text"
    case "markdown":
      return "Markdown"
    case "csv":
      return "CSV"
    case "parquet":
      return "Parquet"
    case "binary":
      return "Binary"
  }
}
