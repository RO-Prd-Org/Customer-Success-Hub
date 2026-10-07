import type { UseChatHelpers } from "@ai-sdk/react"
import type { UIMessage } from "ai"
import * as React from "react"

import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
  useMessageScroller,
} from "@/components/ui/message-scroller"

import { AiChatFollowUps } from "./ai-chat-follow-ups"
import { AiChatMessage } from "./ai-chat-message"
import { AiChatSuggestions } from "./ai-chat-suggestions"
import { getTalonExtensions } from "./types"

type AiChatConversationProps = {
  chat: UseChatHelpers<UIMessage>
  suggestions: string[]
  onSuggestionSelect: (suggestion: string) => void
}

function AiChatConversationBody({
  chat,
  suggestions,
  onSuggestionSelect,
}: AiChatConversationProps) {
  const { scrollToEnd } = useMessageScroller()
  const { messages, status } = chat
  const isBusy = status === "submitted" || status === "streaming"
  const lastMessage = messages.at(-1)
  const streamingMessageId =
    status === "streaming" && lastMessage?.role === "assistant"
      ? lastMessage.id
      : undefined

  const followUps =
    lastMessage?.role === "assistant"
      ? getTalonExtensions(lastMessage)?.followUps ?? []
      : []

  React.useEffect(() => {
    if (isBusy) return

    requestAnimationFrame(() => {
      scrollToEnd({ behavior: "auto" })
    })
  }, [isBusy, messages.length, scrollToEnd])

  return (
    <MessageScroller className="min-h-0 flex-1">
      <MessageScrollerViewport aria-live="polite">
        <MessageScrollerContent className="gap-4 px-4 py-4">
          {messages.length === 0 ? (
            <AiChatSuggestions
              suggestions={suggestions}
              onSelect={onSuggestionSelect}
            />
          ) : (
            messages.map((message) => (
              <MessageScrollerItem key={message.id} messageId={message.id}>
                <AiChatMessage
                  message={message}
                  chat={chat}
                  isStreaming={message.id === streamingMessageId}
                />
              </MessageScrollerItem>
            ))
          )}

          {status === "submitted" && !streamingMessageId ? (
            <MessageScrollerItem messageId="pending-assistant">
              <AiChatMessage
                message={{
                  id: "pending-assistant",
                  role: "assistant",
                  parts: [{ type: "text", text: "" }],
                }}
                chat={chat}
                isStreaming
              />
            </MessageScrollerItem>
          ) : null}

          {messages.length > 0 && followUps.length > 0 && !isBusy ? (
            <MessageScrollerItem messageId="follow-ups">
              <AiChatFollowUps
                suggestions={followUps}
                onSelect={onSuggestionSelect}
              />
            </MessageScrollerItem>
          ) : null}
        </MessageScrollerContent>
      </MessageScrollerViewport>

      {messages.length > 0 ? (
        <MessageScrollerButton direction="end" disabled={isBusy} />
      ) : null}
    </MessageScroller>
  )
}

export function AiChatConversation(props: AiChatConversationProps) {
  return (
    <MessageScrollerProvider autoScroll>
      <AiChatConversationBody {...props} />
    </MessageScrollerProvider>
  )
}
