import type { UIMessage } from "ai"
import * as React from "react"

import type { ConversationRecord } from "@/components/patterns/ai-chat/types"
import { getMessageText } from "@/components/patterns/ai-chat/types"

const STORAGE_KEY = "redowl-ai-chat-history"

function readHistory(): ConversationRecord[] {
  if (typeof window === "undefined") return []

  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw) as ConversationRecord[]
  } catch {
    return []
  }
}

function writeHistory(conversations: ConversationRecord[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations))
  } catch {
    // Ignore quota errors in demo mode.
  }
}

function deriveTitle(messages: UIMessage[]) {
  const firstUser = messages.find((message) => message.role === "user")
  const text = firstUser ? getMessageText(firstUser) : "New conversation"
  return text.length > 48 ? `${text.slice(0, 48)}…` : text || "New conversation"
}

function sortConversations(conversations: ConversationRecord[]) {
  return [...conversations].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1
    return b.updatedAt.localeCompare(a.updatedAt)
  })
}

function conversationFingerprint(messages: UIMessage[]) {
  const last = messages.at(-1)
  return `${messages.length}:${last?.id ?? ""}`
}

function buildConversationRecord(
  id: string,
  messages: UIMessage[]
): ConversationRecord {
  const preview =
    getMessageText(
      messages.at(-1) ?? { id: "empty", role: "assistant", parts: [] }
    ) || "Empty conversation"

  return {
    id,
    title: deriveTitle(messages),
    pinned: false,
    updatedAt: new Date().toISOString(),
    preview: preview.length > 80 ? `${preview.slice(0, 80)}…` : preview,
    messages,
  }
}

export function useConversationHistory() {
  const [conversations, setConversations] = React.useState<ConversationRecord[]>(
    () => readHistory()
  )

  const saveConversation = React.useCallback(
    (id: string, messages: UIMessage[]) => {
      if (messages.length === 0) return

      const fingerprint = conversationFingerprint(messages)

      setConversations((prev) => {
        const existing = prev.find((conversation) => conversation.id === id)
        if (
          existing &&
          conversationFingerprint(existing.messages) === fingerprint
        ) {
          return prev
        }

        const next = sortConversations([
          {
            ...buildConversationRecord(id, messages),
            pinned: existing?.pinned ?? false,
          },
          ...prev.filter((conversation) => conversation.id !== id),
        ])

        writeHistory(next)
        return next
      })
    },
    []
  )

  const renameConversation = React.useCallback((id: string, title: string) => {
    setConversations((prev) => {
      const next = prev.map((conversation) =>
        conversation.id === id ? { ...conversation, title } : conversation
      )
      writeHistory(next)
      return next
    })
  }, [])

  const togglePinConversation = React.useCallback((id: string) => {
    setConversations((prev) => {
      const next = sortConversations(
        prev.map((conversation) =>
          conversation.id === id
            ? { ...conversation, pinned: !conversation.pinned }
            : conversation
        )
      )
      writeHistory(next)
      return next
    })
  }, [])

  const deleteConversation = React.useCallback((id: string) => {
    setConversations((prev) => {
      const next = prev.filter((conversation) => conversation.id !== id)
      writeHistory(next)
      return next
    })
  }, [])

  const getConversation = React.useCallback(
    (id: string) => conversations.find((conversation) => conversation.id === id),
    [conversations]
  )

  return {
    conversations,
    saveConversation,
    renameConversation,
    togglePinConversation,
    deleteConversation,
    getConversation,
  }
}
