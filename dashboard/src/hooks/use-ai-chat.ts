import { useChat, type UseChatHelpers } from "@ai-sdk/react"
import type { ChatTransport, UIMessage } from "ai"
import * as React from "react"
import { toast } from "sonner"

import {
  buildChatContextPayload,
  createChatTransport,
  type ChatMode,
  type CreateChatTransportOptions,
} from "@/lib/ai"
import { useAiChatContext } from "@/hooks/use-ai-chat-context"

export type UseAiChatOptions = {
  /** Override transport entirely (e.g. custom AgentCore / EVE adapter). */
  transport?: ChatTransport<UIMessage>
  /** `mock` uses local scenarios; `live` POSTs to `VITE_CHAT_API_URL`. */
  mode?: ChatMode | "auto"
  api?: string
  credentials?: RequestCredentials
  headers?: CreateChatTransportOptions["headers"]
  onFinish?: (event: { message: UIMessage }) => void
}

function notifyApprovalIfNeeded(message: UIMessage) {
  const hasApproval = message.parts.some(
    (part) =>
      part.type === "dynamic-tool" && part.state === "approval-requested"
  )

  if (hasApproval) {
    toast("Approval needed", {
      description: "Review the tool call and approve or reject the action.",
    })
  }
}

export function useAiChat(options: UseAiChatOptions = {}): UseChatHelpers<UIMessage> {
  const {
    contextChips,
    attachments,
    searchOutsideContext,
  } = useAiChatContext()

  const getContextRef = React.useRef(() =>
    buildChatContextPayload({
      contextChips,
      attachments,
      searchOutsideContext,
    })
  )

  getContextRef.current = () =>
    buildChatContextPayload({
      contextChips,
      attachments,
      searchOutsideContext,
    })

  const transport = React.useMemo(() => {
    if (options.transport) return options.transport

    return createChatTransport({
      mode: options.mode,
      api: options.api,
      credentials: options.credentials,
      headers: options.headers,
      getContext: () => getContextRef.current(),
    })
  }, [
    options.transport,
    options.mode,
    options.api,
    options.credentials,
    options.headers,
  ])

  const onFinish = React.useCallback(
    (event: { message: UIMessage }) => {
      notifyApprovalIfNeeded(event.message)
      options.onFinish?.(event)
    },
    [options.onFinish]
  )

  const onError = React.useCallback((error: Error) => {
    toast.error("Chat request failed", {
      description: error.message,
    })
  }, [])

  return useChat({
    transport,
    onFinish,
    onError,
  })
}
