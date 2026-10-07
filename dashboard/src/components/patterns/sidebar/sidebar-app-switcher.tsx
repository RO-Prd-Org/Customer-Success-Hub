"use client"

import * as React from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { ChevronsUpDownIcon } from "lucide-react"
import type { SidebarApp } from "./types"

type SidebarAppSwitcherProps = {
  apps: SidebarApp[]
  activeAppId?: string
  onAppChange?: (app: SidebarApp) => void
}

export function SidebarAppSwitcher({
  apps,
  activeAppId,
  onAppChange,
}: SidebarAppSwitcherProps) {
  const { isMobile } = useSidebar()
  const [internalActiveId, setInternalActiveId] = React.useState(
    activeAppId ?? apps[0]?.id
  )

  const activeId = activeAppId ?? internalActiveId
  const activeApp = apps.find((app) => app.id === activeId) ?? apps[0]

  if (!activeApp) {
    return null
  }

  const handleSelect = (app: SidebarApp) => {
    if (!activeAppId) {
      setInternalActiveId(app.id)
    }
    onAppChange?.(app)
  }

  const renderAppItem = (app: SidebarApp) => {
    const useLink = Boolean(app.href && app.href !== "#" && !onAppChange)
    return (
      <DropdownMenuItem
        key={app.id}
        className="gap-2 p-2"
        onClick={() => handleSelect(app)}
        render={useLink ? <a href={app.href} /> : undefined}
      >
        <div className="flex size-6 items-center justify-center rounded-md border [&_svg]:size-3.5">
          {app.icon}
        </div>
        <div className="flex flex-col gap-0.5">
          <span>{app.name}</span>
          {app.description ? (
            <span className="text-xs text-muted-foreground">{app.description}</span>
          ) : null}
        </div>
      </DropdownMenuItem>
    )
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                className="data-open:bg-sidebar-accent data-open:text-sidebar-accent-foreground"
              />
            }
          >
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg border border-border bg-background text-brand [&_svg]:size-4">
              {activeApp.icon}
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{activeApp.name}</span>
              {activeApp.description ? (
                <span className="truncate text-xs text-muted-foreground">
                  {activeApp.description}
                </span>
              ) : null}
            </div>
            <ChevronsUpDownIcon className="ml-auto text-brand" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--anchor-width) min-w-56"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel>Apps</DropdownMenuLabel>
              {apps.map(renderAppItem)}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem className="gap-2 p-2">
                <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                  <span className="text-xs font-medium">+</span>
                </div>
                Browse all apps
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
