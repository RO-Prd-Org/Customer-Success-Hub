import { cn } from "@/lib/utils"

import { AiChatComposer } from "./ai-chat-composer"
import { AiChatContextBar } from "./ai-chat-context-bar"
import { AiChatFooterSettings } from "./ai-chat-footer-settings"

type AiChatFooterProps = {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  onStop?: () => void
  isBusy?: boolean
  className?: string
}

export function AiChatFooter({
  value,
  onChange,
  onSubmit,
  onStop,
  isBusy,
  className,
}: AiChatFooterProps) {
  return (
    <footer
      data-slot="ai-chat-footer"
      className={cn(
        "flex shrink-0 flex-col border-t border-sidebar-border bg-sidebar",
        className
      )}
    >
      <AiChatContextBar className="border-b border-sidebar-border" />

      <AiChatComposer
        value={value}
        onChange={onChange}
        onSubmit={onSubmit}
        onStop={onStop}
        isBusy={isBusy}
      />

      <AiChatFooterSettings />
    </footer>
  )
}
