import type { UseChatHelpers } from "@ai-sdk/react"
import type { UIMessage } from "ai"

import { useAiChat } from "./use-ai-chat"

/** @deprecated Prefer `useAiChat({ mode: "mock" })`. */
export function useAiChatMock(): UseChatHelpers<UIMessage> {
  return useAiChat({ mode: "mock" })
}
