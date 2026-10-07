"use client"

import * as React from "react"
import { createColumnHelper, type ColumnDef } from "@tanstack/react-table"
import {
  FolderIcon,
  FolderPlusIcon,
  MoveIcon,
  StarIcon,
  UploadIcon,
} from "lucide-react"

import { TalonDataTable } from "@/components/patterns/data-table"
import type { DataTableFeatures } from "@/components/patterns/data-table"
import { Button } from "@/components/ui/button"
import { formatFileSize, kindLabel } from "../mock-data"
import { useFileManager } from "../file-manager-context"
import type { FileNode } from "../types"
import { FileStatusBadge } from "./file-status-badge"
import { CreateFolderDialog } from "./create-folder-dialog"
import { MoveFileDialog } from "./move-file-dialog"

const columnHelper = createColumnHelper<DataTableFeatures, FileNode>()

function buildColumns(options: {
  onToggleFavourite: (id: string) => void
  onMove: (id: string) => void
}) {
  return columnHelper.columns([
    columnHelper.accessor("name", {
      header: "Name",
      cell: ({ row }) => {
        const file = row.original
        return (
          <div className="flex items-center gap-2">
            {file.kind === "folder" ? (
              <FolderIcon className="size-4 text-muted-foreground" />
            ) : (
              <StarIcon
                className={
                  file.favourite
                    ? "size-4 fill-brand text-brand"
                    : "size-4 text-muted-foreground"
                }
                onClick={(event) => {
                  event.stopPropagation()
                  options.onToggleFavourite(file.id)
                }}
              />
            )}
            <span>{file.name}</span>
          </div>
        )
      },
    }),
    columnHelper.accessor("kind", {
      header: "Type",
      cell: ({ getValue }) => kindLabel(getValue()),
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status
        if (!status || row.original.kind === "folder") return "—"
        return <FileStatusBadge status={status} />
      },
    }),
    columnHelper.accessor("sizeBytes", {
      header: "Size",
      cell: ({ getValue }) => formatFileSize(getValue()),
    }),
    columnHelper.accessor("updatedAt", {
      header: "Updated",
      cell: ({ getValue }) =>
        new Date(getValue()).toLocaleString(undefined, {
          dateStyle: "medium",
          timeStyle: "short",
        }),
    }),
  ]) as ColumnDef<DataTableFeatures, FileNode>[]
}

export function FileListTable() {
  const {
    getChildren,
    currentFolderId,
    openFile,
    openFolder,
    toggleFavourite,
    createFolder,
    moveFile,
    getFolderPath,
  } = useFileManager()

  const [createOpen, setCreateOpen] = React.useState(false)
  const [moveFileId, setMoveFileId] = React.useState<string | null>(null)
  const [moveOpen, setMoveOpen] = React.useState(false)

  const items = getChildren(currentFolderId)
  const path = getFolderPath(currentFolderId)

  const columns = React.useMemo(
    () =>
      buildColumns({
        onToggleFavourite: toggleFavourite,
        onMove: (id) => {
          setMoveFileId(id)
          setMoveOpen(true)
        },
      }),
    [toggleFavourite]
  )

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-xs text-muted-foreground">
            {path.map((segment) => segment.name).join(" / ")}
          </p>
          <h2 className="font-heading text-lg font-semibold">Files</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline">
            <UploadIcon />
            Upload
          </Button>
          <Button variant="outline" onClick={() => setCreateOpen(true)}>
            <FolderPlusIcon />
            New folder
          </Button>
        </div>
      </div>

      <TalonDataTable
        columns={columns}
        data={items}
        rowVariant="action"
        drillInLabel="Open"
        onRowDrillIn={(row) => {
          if (row.kind === "folder") {
            openFolder(row.id)
          } else {
            openFile(row.id)
          }
        }}
        renderRowActions={(row) => (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setMoveFileId(row.id)
              setMoveOpen(true)
            }}
          >
            <MoveIcon />
            Move
          </Button>
        )}
        emptyMessage="This folder is empty."
      />

      <CreateFolderDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreate={createFolder}
      />

      <MoveFileDialog
        open={moveOpen}
        onOpenChange={setMoveOpen}
        fileId={moveFileId}
        onMove={moveFile}
      />
    </div>
  )
}
