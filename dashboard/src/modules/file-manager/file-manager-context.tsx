"use client"

import * as React from "react"

import { FILE_CONTENT, INITIAL_FILES } from "./mock-data"
import type { FileContentBundle, FileNode } from "./types"

type FileManagerContextValue = {
  files: FileNode[]
  currentFolderId: string
  selectedFileId: string | null
  previewMode: "indexed" | "original"
  setCurrentFolderId: (id: string) => void
  setSelectedFileId: (id: string | null) => void
  setPreviewMode: (mode: "indexed" | "original") => void
  openFile: (fileId: string) => void
  openFolder: (folderId: string) => void
  goBackToBrowser: () => void
  toggleFavourite: (fileId: string) => void
  createFolder: (name: string) => void
  moveFile: (fileId: string, targetFolderId: string) => void
  getChildren: (folderId: string) => FileNode[]
  getFavourites: () => FileNode[]
  getFileById: (id: string) => FileNode | undefined
  getContent: (fileId: string) => FileContentBundle | undefined
  getFolderPath: (folderId: string) => FileNode[]
}

const FileManagerContext = React.createContext<FileManagerContextValue | null>(
  null
)

function inferKind(name: string): FileNode["kind"] {
  const lower = name.toLowerCase()
  if (lower.endsWith(".md")) return "markdown"
  if (lower.endsWith(".txt")) return "plaintext"
  if (lower.endsWith(".csv")) return "csv"
  if (lower.endsWith(".parquet")) return "parquet"
  return "binary"
}

export function FileManagerProvider({ children }: { children: React.ReactNode }) {
  const [files, setFiles] = React.useState<FileNode[]>(INITIAL_FILES)
  const [currentFolderId, setCurrentFolderId] = React.useState("root")
  const [selectedFileId, setSelectedFileId] = React.useState<string | null>(null)
  const [previewMode, setPreviewMode] = React.useState<"indexed" | "original">(
    "indexed"
  )

  const getFileById = React.useCallback(
    (id: string) => files.find((file) => file.id === id),
    [files]
  )

  const getChildren = React.useCallback(
    (folderId: string) =>
      files.filter((file) => file.parentId === folderId)
        .sort((a, b) => {
          if (a.kind === "folder" && b.kind !== "folder") return -1
          if (b.kind === "folder" && a.kind !== "folder") return 1
          return a.name.localeCompare(b.name)
        }),
    [files]
  )

  const getFavourites = React.useCallback(
    () => files.filter((file) => file.favourite && file.kind !== "folder"),
    [files]
  )

  const getFolderPath = React.useCallback(
    (folderId: string) => {
      const path: FileNode[] = []
      let cursor = getFileById(folderId)
      while (cursor) {
        path.unshift(cursor)
        cursor = cursor.parentId ? getFileById(cursor.parentId) : undefined
      }
      return path
    },
    [getFileById]
  )

  const openFolder = React.useCallback((folderId: string) => {
    setCurrentFolderId(folderId)
    setSelectedFileId(null)
    setPreviewMode("indexed")
  }, [])

  const openFile = React.useCallback((fileId: string) => {
    const file = getFileById(fileId)
    if (!file || file.kind === "folder") return
    setSelectedFileId(fileId)
    setPreviewMode("indexed")
  }, [getFileById])

  const goBackToBrowser = React.useCallback(() => {
    setSelectedFileId(null)
    setPreviewMode("indexed")
  }, [])

  const toggleFavourite = React.useCallback((fileId: string) => {
    setFiles((prev) =>
      prev.map((file) =>
        file.id === fileId ? { ...file, favourite: !file.favourite } : file
      )
    )
  }, [])

  const createFolder = React.useCallback(
    (name: string) => {
      const trimmed = name.trim()
      if (!trimmed) return

      const id = `folder-${Date.now()}`
      setFiles((prev) => [
        ...prev,
        {
          id,
          name: trimmed,
          kind: "folder",
          parentId: currentFolderId,
          updatedAt: new Date().toISOString(),
        },
      ])
    },
    [currentFolderId]
  )

  const moveFile = React.useCallback((fileId: string, targetFolderId: string) => {
    setFiles((prev) =>
      prev.map((file) =>
        file.id === fileId ? { ...file, parentId: targetFolderId } : file
      )
    )
    if (selectedFileId === fileId) {
      setCurrentFolderId(targetFolderId)
    }
  }, [selectedFileId])

  const getContent = React.useCallback(
    (fileId: string) => FILE_CONTENT[fileId],
    []
  )

  const value = React.useMemo(
    () => ({
      files,
      currentFolderId,
      selectedFileId,
      previewMode,
      setCurrentFolderId,
      setSelectedFileId,
      setPreviewMode,
      openFile,
      openFolder,
      goBackToBrowser,
      toggleFavourite,
      createFolder,
      moveFile,
      getChildren,
      getFavourites,
      getFileById,
      getContent,
      getFolderPath,
    }),
    [
      files,
      currentFolderId,
      selectedFileId,
      previewMode,
      openFile,
      openFolder,
      goBackToBrowser,
      toggleFavourite,
      createFolder,
      moveFile,
      getChildren,
      getFavourites,
      getFileById,
      getContent,
      getFolderPath,
    ]
  )

  return (
    <FileManagerContext.Provider value={value}>
      {children}
    </FileManagerContext.Provider>
  )
}

export function useFileManager() {
  const context = React.useContext(FileManagerContext)
  if (!context) {
    throw new Error("useFileManager must be used within FileManagerProvider")
  }
  return context
}

export { inferKind }
