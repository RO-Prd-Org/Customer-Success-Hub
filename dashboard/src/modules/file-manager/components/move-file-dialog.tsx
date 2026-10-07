"use client"

import * as React from "react"
import { FolderIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

import { useFileManager } from "../file-manager-context"
import type { FileNode } from "../types"

type MoveFileDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  fileId: string | null
  onMove: (fileId: string, targetFolderId: string) => void
}

function FolderOption({
  folder,
  depth,
  selectedId,
  onSelect,
  disabledId,
}: {
  folder: FileNode
  depth: number
  selectedId: string
  onSelect: (id: string) => void
  disabledId?: string
}) {
  const { getChildren } = useFileManager()
  const childFolders = getChildren(folder.id).filter((item) => item.kind === "folder")
  const isDisabled = folder.id === disabledId

  return (
    <div>
      <button
        type="button"
        disabled={isDisabled}
        onClick={() => onSelect(folder.id)}
        className={cn(
          "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm",
          selectedId === folder.id ? "bg-muted font-medium" : "hover:bg-muted/70",
          isDisabled && "cursor-not-allowed opacity-50"
        )}
        style={{ paddingLeft: `${8 + depth * 12}px` }}
      >
        <FolderIcon className="size-4 shrink-0" />
        <span className="truncate">{folder.name}</span>
      </button>
      {childFolders.map((child) => (
        <FolderOption
          key={child.id}
          folder={child}
          depth={depth + 1}
          selectedId={selectedId}
          onSelect={onSelect}
          disabledId={disabledId}
        />
      ))}
    </div>
  )
}

export function MoveFileDialog({
  open,
  onOpenChange,
  fileId,
  onMove,
}: MoveFileDialogProps) {
  const { getFileById } = useFileManager()
  const [targetFolderId, setTargetFolderId] = React.useState("root")
  const file = fileId ? getFileById(fileId) : undefined
  const root = getFileById("root")

  React.useEffect(() => {
    if (open) setTargetFolderId("root")
  }, [open])

  const handleMove = () => {
    if (!fileId) return
    onMove(fileId, targetFolderId)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Move {file?.name ?? "item"}</DialogTitle>
          <DialogDescription>
            Choose a destination folder.
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-64 overflow-y-auto rounded-md border border-border p-2">
          {root ? (
            <FolderOption
              folder={root}
              depth={0}
              selectedId={targetFolderId}
              onSelect={setTargetFolderId}
              disabledId={file?.kind === "folder" ? file.id : undefined}
            />
          ) : null}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleMove} disabled={!fileId}>
            Move here
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
