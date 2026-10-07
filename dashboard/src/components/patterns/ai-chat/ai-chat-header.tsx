import {
  ExpandIcon,
  Minimize2Icon,
  MoreHorizontalIcon,
  PlusIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAiChatContext } from "@/hooks/use-ai-chat-context"

import { AiChatHistory, type AiChatHistoryProps } from "./ai-chat-history"

type AiChatHeaderProps = {
  title?: string
  subtitle?: string
  onNewChat?: () => void
  history?: AiChatHistoryProps
}

export function AiChatHeader({
  title = "Assistant",
  subtitle = "Mock agent",
  onNewChat,
  history,
}: AiChatHeaderProps) {
  const { fullscreen, setFullscreen, debugMode, setDebugMode } = useAiChatContext()

  return (
    <div className="flex h-14 shrink-0 items-center gap-2 border-b border-sidebar-border px-4">
      <div className="min-w-0 flex-1">
        <p className="truncate font-heading text-sm font-medium">{title}</p>
        <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
      </div>

      {history ? <AiChatHistory {...history} /> : null}

      <Button
        variant="ghost"
        size="icon-sm"
        aria-label={fullscreen ? "Exit full screen" : "Open full screen"}
        onClick={() => setFullscreen(!fullscreen)}
      >
        {fullscreen ? <Minimize2Icon /> : <ExpandIcon />}
      </Button>

      <Button
        variant="ghost"
        size="icon-sm"
        aria-label="New chat"
        onClick={onNewChat}
      >
        <PlusIcon />
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="ghost" size="icon-sm" aria-label="Chat settings">
              <MoreHorizontalIcon />
            </Button>
          }
        />
        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuLabel>Assistant</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={onNewChat}>New chat</DropdownMenuItem>
          <DropdownMenuCheckboxItem
            checked={debugMode}
            onCheckedChange={setDebugMode}
          >
            Debug mode
          </DropdownMenuCheckboxItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem disabled>Model: Mock agent</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
