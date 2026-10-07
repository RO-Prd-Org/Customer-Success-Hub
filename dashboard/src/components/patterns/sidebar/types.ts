import type * as React from "react"

export type SidebarApp = {
  id: string
  name: string
  description?: string
  icon: React.ReactNode
  href?: string
}

export type SidebarNavSubItem = {
  id: string
  label: string
  href?: string
  onSelect?: () => void
  isActive?: boolean
}

export type SidebarNavItem = {
  id: string
  label: string
  icon?: React.ReactNode
  href?: string
  onSelect?: () => void
  isActive?: boolean
  items?: SidebarNavSubItem[]
}

export type SidebarNavSection = {
  id: string
  label: string
  items: SidebarNavItem[]
}

export type SidebarUser = {
  name: string
  email: string
  avatarUrl?: string
}
