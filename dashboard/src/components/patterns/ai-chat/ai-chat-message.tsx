import type { DynamicToolUIPart, UIMessage } from "ai"

import { Bubble, BubbleContent } from "@/components/ui/bubble"
import { Message, MessageContent, MessageHeader } from "@/components/ui/message"
import { Marker, MarkerContent } from "@/components/ui/marker"
import { Spinner } from "@/components/ui/spinner"
import type { UseChatHelpers } from "@ai-sdk/react"

import { AiChatArtifact } from "./ai-chat-artifact"
import { AiChatCitationsList } from "./ai-chat-citation"
import { AiChatClarification } from "./ai-chat-clarification"
import { AiChatMessageActions } from "./ai-chat-message-actions"
import { AiChatMessageContent } from "./ai-chat-message-content"
import { AiChatPlan } from "./ai-chat-plan"
import { AiChatReasoning } from "./ai-chat-reasoning"
import { AiChatSourcesList } from "./ai-chat-source"
import { AiChatThinking } from "./ai-chat-thinking"
import { AiChatToolCall } from "./ai-chat-tool-call"
import { AiChatTrustLabel } from "./ai-chat-trust-label"
import {
  getMessageArtifacts,
  getMessageReasoningText,
  getMessageText,
  getTalonExtensions,
  isReasoningStreaming,
} from "./types"

type AiChatMessageProps = {
  message: UIMessage
  chat: UseChatHelpers<UIMessage>
  isStreaming?: boolean
}

function isDynamicToolPart(part: UIMessage["parts"][number]): part is DynamicToolUIPart {
  return part.type === "dynamic-tool"
}

export function AiChatMessage({
  message,
  chat,
  isStreaming = false,
}: AiChatMessageProps) {
  const text = getMessageText(message)
  const talon = getTalonExtensions(message)
  const toolParts = message.parts.filter(isDynamicToolPart)
  const artifacts = getMessageArtifacts(message)
  const reasoningText = getMessageReasoningText(message)
  const reasoningActive =
    isStreaming &&
    (isReasoningStreaming(message) || (Boolean(reasoningText) && !text && !talon?.plan))

  if (message.role === "system") {
    return (
      <Marker variant="separator" className="px-2">
        <MarkerContent>{text}</MarkerContent>
      </Marker>
    )
  }

  const isUser = message.role === "user"
  const align = isUser ? "end" : "start"
  const label = isUser ? "You" : "Assistant"

  return (
    <Message align={align}>
      <MessageContent className="gap-3">
        <MessageHeader>{label}</MessageHeader>

        {!isUser && reasoningActive ? (
          <AiChatThinking text={reasoningText} />
        ) : null}

        {!isUser && talon?.reasoning && !reasoningActive ? (
          <AiChatReasoning reasoning={talon.reasoning} />
        ) : null}

        {!isUser && talon?.plan ? <AiChatPlan steps={talon.plan.steps} /> : null}

        {text ? (
          <Bubble variant={isUser ? "default" : "muted"} align={align}>
            <BubbleContent>
              {isUser ? (
                <p className="whitespace-pre-wrap">{text}</p>
              ) : (
                <AiChatMessageContent content={text} isStreaming={isStreaming} />
              )}
            </BubbleContent>
          </Bubble>
        ) : null}

        {!isUser && toolParts.map((part) => (
          <AiChatToolCall key={part.toolCallId} part={part} chat={chat} />
        ))}

        {!isUser && !isStreaming && talon?.clarification ? (
          <AiChatClarification clarification={talon.clarification} chat={chat} />
        ) : null}

        {!isUser &&
          artifacts.map((artifact) => (
            <AiChatArtifact key={artifact.id} artifact={artifact} />
          ))}

        {!isUser ? (
          <AiChatSourcesList message={message} sources={talon?.sources} />
        ) : null}

        {!isUser && talon?.trust ? <AiChatTrustLabel trust={talon.trust} /> : null}

        {!isUser && talon?.citations ? (
          <AiChatCitationsList citations={talon.citations} />
        ) : null}

        {!isUser && isStreaming && !text && !reasoningActive ? (
          <div className="flex items-center gap-2 px-3 text-xs text-muted-foreground">
            <Spinner className="size-3" />
            <span>Streaming response…</span>
          </div>
        ) : null}

        {!isUser && !isStreaming ? (
          <AiChatMessageActions message={message} chat={chat} />
        ) : null}
      </MessageContent>
    </Message>
  )
}
