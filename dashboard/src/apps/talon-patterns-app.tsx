"use client"

import * as React from "react"
import {
  BarChart3Icon,
  FileTextIcon,
  LayoutDashboardIcon,
  MessageSquareIcon,
  ShieldIcon,
  TableIcon,
  UsersIcon,
} from "lucide-react"

import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import type { SidebarNavSection } from "@/components/patterns/sidebar"
import { ActionRowTablePage } from "@/views/action-row-table-page"
import { AiChatDemoPage } from "@/views/ai-chat-demo-page"
import { ClickableRowTablePage } from "@/views/clickable-row-table-page"
import { DashboardPage } from "@/views/dashboard-page"

export type TalonPatternView =
  | "master-pattern"
  | "dashboard"
  | "clickable-row"
  | "action-row"
  | "ai-chat"

function MasterPatternPage() {
  return (
    <div className="flex flex-col gap-4">
      <header className="flex h-12 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 px-1">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <span className="text-sm text-muted-foreground">Master pattern</span>
        </div>
      </header>

      <div className="flex max-w-2xl flex-col gap-4">
        <div>
          <h1 className="font-heading text-2xl font-semibold">Master pattern</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Sidebar groups: Switcher (app dropdown), Tabs (section headers,
            items, and collapsible sub-items), and a footer user menu.
          </p>
        </div>
        <Separator />
        <div className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          App area — your feature content goes here
        </div>
      </div>
    </div>
  )
}

export function useTalonPatternNav(
  currentView: TalonPatternView,
  setCurrentView: (view: TalonPatternView) => void
): SidebarNavSection[] {
  const isDataTableView =
    currentView === "clickable-row" || currentView === "action-row"

  return React.useMemo(
    () => [
      {
        id: "patterns",
        label: "Patterns",
        items: [
          {
            id: "master-pattern",
            label: "Master pattern",
            icon: <LayoutDashboardIcon />,
            isActive: currentView === "master-pattern",
            onSelect: () => setCurrentView("master-pattern"),
          },
          {
            id: "dashboard",
            label: "Dashboard",
            icon: <BarChart3Icon />,
            isActive: currentView === "dashboard",
            onSelect: () => setCurrentView("dashboard"),
          },
          {
            id: "data-table",
            label: "Data table",
            icon: <TableIcon />,
            isActive: isDataTableView,
            items: [
              {
                id: "clickable-row",
                label: "Clickable row",
                isActive: currentView === "clickable-row",
                onSelect: () => setCurrentView("clickable-row"),
              },
              {
                id: "action-row",
                label: "Action row",
                isActive: currentView === "action-row",
                onSelect: () => setCurrentView("action-row"),
              },
            ],
          },
          {
            id: "ai-chat",
            label: "AI Chat",
            icon: <MessageSquareIcon />,
            isActive: currentView === "ai-chat",
            onSelect: () => setCurrentView("ai-chat"),
          },
        ],
      },
      {
        id: "workspace",
        label: "Workspace",
        items: [
          {
            id: "reports",
            label: "Reports",
            icon: <FileTextIcon />,
            items: [
              { id: "weekly", label: "Weekly summary", href: "#" },
              { id: "monthly", label: "Monthly rollup", href: "#" },
              { id: "exports", label: "Exports", href: "#" },
            ],
          },
        ],
      },
      {
        id: "administration",
        label: "Administration",
        items: [
          {
            id: "team",
            label: "Team",
            href: "#",
            icon: <UsersIcon />,
          },
          {
            id: "security",
            label: "Security",
            icon: <ShieldIcon />,
            items: [
              { id: "roles", label: "Roles", href: "#" },
              { id: "audit", label: "Audit log", href: "#" },
            ],
          },
        ],
      },
    ],
    [currentView, isDataTableView, setCurrentView]
  )
}

export function TalonPatternsMain({ currentView }: { currentView: TalonPatternView }) {
  if (currentView === "dashboard") return <DashboardPage />
  if (currentView === "clickable-row") return <ClickableRowTablePage />
  if (currentView === "action-row") return <ActionRowTablePage />
  if (currentView === "ai-chat") return <AiChatDemoPage />
  return <MasterPatternPage />
}
