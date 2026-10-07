import type { UseChatHelpers } from "@ai-sdk/react"
import type { UIMessage } from "ai"
import * as React from "react"
import { toast } from "sonner"

import type {
  ComposerAttachment,
  ContextChip,
  TalonClarification,
  TalonUserMetadata,
} from "@/components/patterns/ai-chat/types"

type AiChatContextValue = {
  contextChips: ContextChip[]
  addContextChip: (chip: ContextChip) => void
  removeContextChip: (id: string) => void
  searchOutsideContext: boolean
  setSearchOutsideContext: (value: boolean) => void
  tokenUsage: { used: number; limit: number }
  debugMode: boolean
  setDebugMode: (value: boolean) => void
  fullscreen: boolean
  setFullscreen: (value: boolean) => void
  attachments: ComposerAttachment[]
  addAttachment: (attachment: ComposerAttachment) => void
  removeAttachment: (id: string) => void
  updateAttachment: (
    id: string,
    patch: Partial<ComposerAttachment>
  ) => void
  submitClarification: (
    chat: UseChatHelpers<UIMessage>,
    clarification: TalonClarification,
    answers: Record<string, string | string[]>
  ) => Promise<void>
  handleToolApproval: (
    chat: UseChatHelpers<UIMessage>,
    approvalId: string,
    approved: boolean
  ) => void
}

const AiChatContext = React.createContext<AiChatContextValue | null>(null)

const DEFAULT_CHIPS: ContextChip[] = [
  { id: "page", label: "AI Chat demo", kind: "page", removable: false },
  { id: "project", label: "Talon workspace", kind: "project", removable: true },
]

export function AiChatProvider({ children }: { children: React.ReactNode }) {
  const [contextChips, setContextChips] = React.useState<ContextChip[]>(DEFAULT_CHIPS)
  const [searchOutsideContext, setSearchOutsideContext] = React.useState(false)
  const [debugMode, setDebugMode] = React.useState(false)
  const [fullscreen, setFullscreen] = React.useState(false)
  const [attachments, setAttachments] = React.useState<ComposerAttachment[]>([])

  const tokenUsage = React.useMemo(
    () => ({ used: 4820, limit: 128000 }),
    []
  )

  const addContextChip = React.useCallback((chip: ContextChip) => {
    setContextChips((current) =>
      current.some((item) => item.id === chip.id) ? current : [...current, chip]
    )
  }, [])

  const removeContextChip = React.useCallback((id: string) => {
    setContextChips((current) => current.filter((chip) => chip.id !== id))
    setAttachments((current) => current.filter((attachment) => attachment.id !== id))
  }, [])

  const addAttachment = React.useCallback((attachment: ComposerAttachment) => {
    setAttachments((current) => [...current, attachment])
    setContextChips((current) =>
      current.some((item) => item.id === attachment.id)
        ? current
        : [
            ...current,
            {
              id: attachment.id,
              label: attachment.name,
              kind: "file" as const,
              removable: true,
            },
          ]
    )
  }, [])

  const removeAttachment = React.useCallback((id: string) => {
    setAttachments((current) => current.filter((attachment) => attachment.id !== id))
    setContextChips((current) => current.filter((chip) => chip.id !== id))
  }, [])

  const updateAttachment = React.useCallback(
    (id: string, patch: Partial<ComposerAttachment>) => {
      setAttachments((current) =>
        current.map((attachment) =>
          attachment.id === id ? { ...attachment, ...patch } : attachment
        )
      )
    },
    []
  )

  const handleToolApproval = React.useCallback(
    (chat: UseChatHelpers<UIMessage>, approvalId: string, approved: boolean) => {
      chat.addToolApprovalResponse({ id: approvalId, approved })

      if (approved) {
        toast.success("Action approved", {
          description: "The assistant will continue once the tool completes.",
        })
      } else {
        toast("Action rejected", {
          description: "The proposed tool call was cancelled.",
        })
      }
    },
    []
  )

  const submitClarification = React.useCallback(
    async (
      chat: UseChatHelpers<UIMessage>,
      clarification: TalonClarification,
      answers: Record<string, string | string[]>
    ) => {
      chat.setMessages((messages) =>
        messages.map((message) => {
          const talon = (message.metadata as { talon?: { clarification?: TalonClarification } })
            ?.talon

          if (talon?.clarification?.id !== clarification.id) {
            return message
          }

          return {
            ...message,
            metadata: {
              ...(message.metadata as object),
              talon: {
                ...talon,
                clarification: {
                  ...talon.clarification,
                  submitted: true,
                  answers,
                },
              },
            },
          }
        })
      )

      await chat.sendMessage({
        text: "Clarification submitted.",
        metadata: {
          clarificationResponse: true,
          clarificationAnswers: answers,
        } satisfies TalonUserMetadata,
      })

      toast.success("Clarification submitted")
    },
    []
  )

  const value = React.useMemo(
    () => ({
      contextChips,
      addContextChip,
      removeContextChip,
      searchOutsideContext,
      setSearchOutsideContext,
      tokenUsage,
      debugMode,
      setDebugMode,
      fullscreen,
      setFullscreen,
      attachments,
      addAttachment,
      removeAttachment,
      updateAttachment,
      submitClarification,
      handleToolApproval,
    }),
    [
      addAttachment,
      addContextChip,
      attachments,
      contextChips,
      debugMode,
      fullscreen,
      handleToolApproval,
      removeAttachment,
      removeContextChip,
      searchOutsideContext,
      submitClarification,
      tokenUsage,
      updateAttachment,
    ]
  )

  return (
    <AiChatContext.Provider value={value}>{children}</AiChatContext.Provider>
  )
}

export function useAiChatContext() {
  const context = React.useContext(AiChatContext)
  if (!context) {
    throw new Error("useAiChatContext must be used within AiChatProvider")
  }
  return context
}
