import type {
  ComposerAttachment,
  ContextChip,
} from "@/components/patterns/ai-chat/types"

/** Context payload merged into every chat API request body. */
export type TalonChatContextPayload = {
  chips: ContextChip[]
  attachments: ComposerAttachment[]
  searchOutsideContext: boolean
}

/**
 * Expected shape of the POST body your backend receives when using
 * `DefaultChatTransport`. The AI SDK adds `id`, `messages`, `trigger`, and
 * `messageId`; Talon adds `context`.
 */
export type TalonChatRequestBody = {
  id: string
  messages: unknown[]
  trigger: "submit-message" | "regenerate-message"
  messageId?: string
  context?: TalonChatContextPayload
}

export function buildChatContextPayload(input: {
  contextChips: ContextChip[]
  attachments: ComposerAttachment[]
  searchOutsideContext: boolean
}): TalonChatContextPayload {
  return {
    chips: input.contextChips,
    attachments: input.attachments,
    searchOutsideContext: input.searchOutsideContext,
  }
}
