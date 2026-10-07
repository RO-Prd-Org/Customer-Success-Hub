"use client"

import { FileIcon, StarIcon } from "lucide-react"

import { PageTopBar } from "@/components/patterns/page-shell"
import { Button } from "@/components/ui/button"
import { formatFileSize, kindLabel } from "../mock-data"
import { useFileManager } from "../file-manager-context"
import { FileContentView } from "./file-content-view"
import { FileStatusBadge } from "./file-status-badge"

export function FilePreviewPanel() {
  const {
    selectedFileId,
    previewMode,
    setPreviewMode,
    goBackToBrowser,
    getFileById,
    getContent,
    toggleFavourite,
    getFolderPath,
  } = useFileManager()

  const file = selectedFileId ? getFileById(selectedFileId) : undefined
  if (!file || file.kind === "folder") return null

  const bundle = getContent(file.id)
  const folderPath = file.parentId ? getFolderPath(file.parentId) : []
  const canShowIndexed = file.status === "indexed" && bundle?.indexed
  const showingOriginal = previewMode === "original"

  const content = showingOriginal
    ? bundle?.original ?? null
    : bundle?.indexed ?? null

  const emptyMessage = showingOriginal
    ? "Original file is not available yet."
    : file.status === "uploading"
      ? "File is still uploading. Indexed preview will appear after processing."
      : file.status === "processing"
        ? "File is being parsed and indexed by the agent."
        : "Indexed preview is not available."

  return (
    <div className="flex flex-col gap-4 pb-8">
      <PageTopBar
        showBack
        onBack={goBackToBrowser}
        breadcrumbs={[
          ...folderPath.map((segment) => ({
            label: segment.name,
            onClick: goBackToBrowser,
          })),
          { label: file.name },
        ]}
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg border border-border bg-muted">
            <FileIcon className="size-5 text-muted-foreground" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-heading text-xl font-semibold">{file.name}</h1>
              {file.status ? <FileStatusBadge status={file.status} /> : null}
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {kindLabel(file.kind)} · {formatFileSize(file.sizeBytes)} ·{" "}
              {showingOriginal ? "Original file" : "Indexed view"}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="ghost"
            onClick={() => toggleFavourite(file.id)}
          >
            <StarIcon
              className={
                file.favourite ? "fill-brand text-brand" : "text-muted-foreground"
              }
            />
            {file.favourite ? "Unfavourite" : "Favourite"}
          </Button>
          {canShowIndexed ? (
            <Button
              variant={showingOriginal ? "default" : "outline"}
              onClick={() =>
                setPreviewMode(showingOriginal ? "indexed" : "original")
              }
            >
              {showingOriginal ? "View indexed" : "View original"}
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={() => setPreviewMode("original")}
              disabled={!bundle?.original}
            >
              View original
            </Button>
          )}
        </div>
      </div>

      {!canShowIndexed && previewMode === "indexed" ? (
        <div className="rounded-lg border border-border bg-muted/40 p-4 text-sm text-muted-foreground">
          {file.status === "uploading"
            ? "Upload in progress — the raw file is stored first, then an AI agent parses and indexes it."
            : "Processing — indexed content will replace this message when ready."}
        </div>
      ) : null}

      <FileContentView content={content} emptyMessage={emptyMessage} />
    </div>
  )
}
