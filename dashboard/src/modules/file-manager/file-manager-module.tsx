"use client"

import { FileManagerProvider, useFileManager } from "./file-manager-context"
import { FileListTable } from "./components/file-list-table"
import { FilePreviewPanel } from "./components/file-preview-panel"

function FileManagerMain() {
  const { selectedFileId } = useFileManager()

  if (selectedFileId) {
    return <FilePreviewPanel />
  }

  return (
    <div className="flex flex-col gap-4 pb-8">
      <div>
        <h1 className="font-heading text-2xl font-semibold">File Manager</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Browse, upload, and organise workspace files. Indexed previews are
          generated after the AI agent parses each upload.
        </p>
      </div>
      <FileListTable />
    </div>
  )
}

export function FileManagerModule() {
  return <FileManagerMain />
}

export function FileManagerModuleWithProvider() {
  return (
    <FileManagerProvider>
      <FileManagerMain />
    </FileManagerProvider>
  )
}

export { FileTreeNav } from "./components/file-tree-nav"
