"use client"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { ChevronRightIcon } from "lucide-react"
import type { SidebarNavItem, SidebarNavSection } from "./types"

type SidebarNavTabsProps = {
  sections: SidebarNavSection[]
}

function SidebarNavItemRow({ item }: { item: SidebarNavItem }) {
  if (item.items?.length) {
    const isChildActive = item.items.some((subItem) => subItem.isActive)

    return (
      <Collapsible
        defaultOpen={item.isActive || isChildActive}
        className="group/collapsible"
      >
        <SidebarMenuItem>
          <CollapsibleTrigger
            render={
              <SidebarMenuButton tooltip={item.label} isActive={item.isActive} />
            }
          >
            {item.icon}
            <span>{item.label}</span>
            <ChevronRightIcon className="ml-auto transition-transform duration-200 group-data-open/collapsible:rotate-90" />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
              {item.items.map((subItem) => (
                <SidebarMenuSubItem key={subItem.id}>
                  <SidebarMenuSubButton
                    isActive={subItem.isActive}
                    onClick={subItem.onSelect}
                    render={
                      subItem.href && !subItem.onSelect ? (
                        <a href={subItem.href} />
                      ) : undefined
                    }
                  >
                    <span>{subItem.label}</span>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    )
  }

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        isActive={item.isActive}
        tooltip={item.label}
        onClick={item.onSelect}
        render={item.href && !item.onSelect ? <a href={item.href} /> : undefined}
      >
        {item.icon}
        <span>{item.label}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

export function SidebarNavTabs({ sections }: SidebarNavTabsProps) {
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        {sections.map((section) => (
          <SidebarGroup key={section.id} className="p-0">
            <SidebarMenu>
              {section.items.map((item) => (
                <SidebarNavItemRow key={item.id} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
