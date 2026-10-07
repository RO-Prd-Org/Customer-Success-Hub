"use client"

import { cn } from "@/lib/utils"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

const LOGO_WIDE = "/RedOwl_Logo_Main_Tight.png"
const LOGO_WIDE_DARK = "/RedOwl_Logo_Main_Tight_White.png"
const LOGO_SQUARE = "/Mascot_RedBG_Small.png"

export function SidebarBrand() {
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className={cn(
            "pointer-events-none justify-center group-data-[collapsible=icon]:size-10! group-data-[collapsible=icon]:p-1!",
            !isCollapsed && "h-12 px-2"
          )}
        >
          {isCollapsed ? (
            <img
              src={LOGO_SQUARE}
              alt="RedOwl"
              className="size-8 rounded-lg object-cover"
            />
          ) : (
            <>
              <img
                src={LOGO_WIDE}
                alt="RedOwl"
                className="h-8 w-auto max-w-[calc(var(--sidebar-width)-1rem)] object-contain object-left dark:hidden"
              />
              <img
                src={LOGO_WIDE_DARK}
                alt="RedOwl"
                className="hidden h-8 w-auto max-w-[calc(var(--sidebar-width)-1rem)] object-contain object-left dark:block"
              />
            </>
          )}
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
