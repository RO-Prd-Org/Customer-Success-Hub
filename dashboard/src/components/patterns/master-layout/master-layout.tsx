import * as React from "react"
import { cn } from "@/lib/utils"
import {
  Sidebar,
  SidebarInset,
  SidebarProvider,
  SidebarRail,
} from "@/components/ui/sidebar"
import { CollapsiblePanel } from "./collapsible-panel"
import {
  MasterLayoutProvider,
  useMasterLayout,
} from "./master-layout-context"

type MasterLayoutProps = {
  children: React.ReactNode
  className?: string
  defaultChatbotOpen?: boolean
  chatbotOpen?: boolean
  onChatbotOpenChange?: (open: boolean) => void
  storageKey?: string
  chatbotWidth?: string
  defaultSidebarOpen?: boolean
  sidebarOpen?: boolean
  onSidebarOpenChange?: (open: boolean) => void
}

function MasterLayoutFrame({
  children,
  className,
  chatbotWidth = "20rem",
  defaultSidebarOpen,
  sidebarOpen,
  onSidebarOpenChange,
}: Pick<
  MasterLayoutProps,
  | "children"
  | "className"
  | "chatbotWidth"
  | "defaultSidebarOpen"
  | "sidebarOpen"
  | "onSidebarOpenChange"
>) {
  const { chatbotOpen, toggleChatbot } = useMasterLayout()

  let sidebar: React.ReactNode = null
  let main: React.ReactNode = null
  let chatbot: React.ReactNode = null

  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) return

    switch (child.type) {
      case MasterLayoutSidebar:
        sidebar = child
        break
      case MasterLayoutMain:
        main = child
        break
      case MasterLayoutChatbot:
        chatbot = child
        break
    }
  })

  return (
    <SidebarProvider
      defaultOpen={defaultSidebarOpen}
      open={sidebarOpen}
      onOpenChange={onSidebarOpenChange}
      className={cn("h-svh overflow-hidden", className)}
    >
      {sidebar ? (
        <Sidebar collapsible="icon">
          {sidebar}
          <SidebarRail />
        </Sidebar>
      ) : null}

      <SidebarInset className="flex min-h-0 min-w-0 flex-row overflow-hidden">
        <div
          data-slot="master-layout-main"
          className="relative flex min-w-0 flex-1 flex-col overflow-hidden"
        >
          {main}
        </div>

        <CollapsiblePanel
          side="right"
          open={chatbotOpen}
          onToggle={toggleChatbot}
          label="chatbot"
          width={chatbotWidth}
          toggleVariant="logo"
        >
          {chatbot}
        </CollapsiblePanel>
      </SidebarInset>
    </SidebarProvider>
  )
}

type MasterLayoutSidebarProps = {
  children: React.ReactNode
}

function MasterLayoutSidebar({ children }: MasterLayoutSidebarProps) {
  return <>{children}</>
}

type MasterLayoutMainProps = {
  children: React.ReactNode
  className?: string
}

function MasterLayoutMain({ children, className }: MasterLayoutMainProps) {
  return (
    <div
      data-slot="master-layout-main-content"
      className={cn("flex flex-1 flex-col overflow-auto p-6", className)}
    >
      {children}
    </div>
  )
}

type MasterLayoutChatbotProps = {
  children: React.ReactNode
  className?: string
}

function MasterLayoutChatbot({ children, className }: MasterLayoutChatbotProps) {
  return (
    <div
      data-slot="master-layout-chatbot"
      className={cn("flex h-full flex-col", className)}
    >
      {children}
    </div>
  )
}

function MasterLayout({
  children,
  className,
  defaultChatbotOpen,
  chatbotOpen,
  onChatbotOpenChange,
  storageKey = "redowl-master-layout",
  chatbotWidth,
  defaultSidebarOpen = true,
  sidebarOpen,
  onSidebarOpenChange,
}: MasterLayoutProps) {
  return (
    <MasterLayoutProvider
      defaultChatbotOpen={defaultChatbotOpen}
      chatbotOpen={chatbotOpen}
      onChatbotOpenChange={onChatbotOpenChange}
      storageKey={storageKey}
    >
      <MasterLayoutFrame
        className={className}
        chatbotWidth={chatbotWidth}
        defaultSidebarOpen={defaultSidebarOpen}
        sidebarOpen={sidebarOpen}
        onSidebarOpenChange={onSidebarOpenChange}
      >
        {children}
      </MasterLayoutFrame>
    </MasterLayoutProvider>
  )
}

MasterLayout.Sidebar = MasterLayoutSidebar
MasterLayout.Main = MasterLayoutMain
MasterLayout.Chatbot = MasterLayoutChatbot

export {
  MasterLayout,
  MasterLayoutSidebar,
  MasterLayoutMain,
  MasterLayoutChatbot,
  useMasterLayout,
}
