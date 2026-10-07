"use client"

import {
  ChevronRightIcon,
  FolderIcon,
  StarIcon,
} from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

import { useFileManager } from "../file-manager-context"
import type { FileNode } from "../types"

function FolderTreeItems({
  folderId,
  depth = 0,
}: {
  folderId: string
  depth?: number
}) {
  const { getChildren } = useFileManager()
  const folders = getChildren(folderId).filter((item) => item.kind === "folder")

  if (folders.length === 0) return null

  return (
    <>
      {folders.map((folder) => (
        <FolderTreeNode key={folder.id} folder={folder} depth={depth} />
      ))}
    </>
  )
}

function FolderTreeNode({
  folder,
  depth,
}: {
  folder: FileNode
  depth: number
}) {
  const { getChildren, openFolder, currentFolderId } = useFileManager()
  const childFolders = getChildren(folder.id).filter((item) => item.kind === "folder")
  const isActive = currentFolderId === folder.id

  if (childFolders.length === 0) {
    return (
      <SidebarMenuSubItem>
        <SidebarMenuSubButton
          isActive={isActive}
          onClick={() => openFolder(folder.id)}
          className={cn(depth > 0 && "pl-4")}
        >
          <FolderIcon />
          <span>{folder.name}</span>
        </SidebarMenuSubButton>
      </SidebarMenuSubItem>
    )
  }

  return (
    <Collapsible defaultOpen className="group/collapsible">
      <SidebarMenuSubItem>
        <CollapsibleTrigger
          render={
            <SidebarMenuSubButton
              isActive={isActive}
              onClick={() => openFolder(folder.id)}
            />
          }
        >
          <ChevronRightIcon className="transition-transform group-data-open/collapsible:rotate-90" />
          <FolderIcon />
          <span>{folder.name}</span>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            <FolderTreeItems folderId={folder.id} depth={depth + 1} />
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuSubItem>
    </Collapsible>
  )
}

export function FileTreeNav() {
  const { getFavourites, openFile, openFolder, selectedFileId } = useFileManager()
  const favourites = getFavourites()

  return (
    <>
      <SidebarGroup>
        <SidebarGroupLabel>Favourites</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {favourites.length === 0 ? (
              <SidebarMenuItem>
                <SidebarMenuButton disabled className="text-muted-foreground">
                  <StarIcon />
                  <span>No favourites yet</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ) : (
              favourites.map((file) => (
                <SidebarMenuItem key={file.id}>
                  <SidebarMenuButton
                    isActive={selectedFileId === file.id}
                    onClick={() => openFile(file.id)}
                  >
                    <StarIcon className="text-brand" />
                    <span className="truncate">{file.name}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))
            )}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <SidebarGroup>
        <SidebarGroupLabel>Files</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={() => openFolder("root")}>
                <FolderIcon />
                <span>All files</span>
              </SidebarMenuButton>
              <SidebarMenuSub>
                <FolderTreeItems folderId="root" />
              </SidebarMenuSub>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </>
  )
}
