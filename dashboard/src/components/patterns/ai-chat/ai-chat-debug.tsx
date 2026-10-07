import { useAiChatContext } from "@/hooks/use-ai-chat-context"
import type { UseChatHelpers } from "@ai-sdk/react"
import type { UIMessage } from "ai"

type AiChatDebugProps = {
  chat: UseChatHelpers<UIMessage>
}

export function AiChatDebug({ chat }: AiChatDebugProps) {
  const { debugMode, tokenUsage } = useAiChatContext()

  if (!debugMode) return null

  return (
    <div className="mx-3 mb-2 rounded-lg border border-dashed border-border bg-muted/30 p-2 font-mono text-[11px] text-muted-foreground">
      <p>status: {chat.status}</p>
      <p>messages: {chat.messages.length}</p>
      <p>
        tokens: {tokenUsage.used}/{tokenUsage.limit}
      </p>
    </div>
  )
}
