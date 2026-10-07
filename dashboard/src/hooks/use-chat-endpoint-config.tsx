"use client"

import * as React from "react"

import { getChatApiUrl as getEnvChatApiUrl } from "@/lib/ai/chat-config"
import {
  CHAT_ENDPOINT_OPTIONS,
  getChatEndpointById,
  ROOST_CHAT_ENDPOINT_KEY,
  type ChatEndpointOption,
} from "@/modules/roost/chat-endpoints"

type ChatEndpointContextValue = {
  endpointId: string
  endpoint: ChatEndpointOption
  effectiveApiUrl: string
  setEndpointId: (id: string) => void
  options: ChatEndpointOption[]
}

const ChatEndpointContext = React.createContext<ChatEndpointContextValue | null>(
  null
)

function readStoredEndpointId() {
  if (typeof window === "undefined") return "default"
  try {
    return localStorage.getItem(ROOST_CHAT_ENDPOINT_KEY) ?? "default"
  } catch {
    return "default"
  }
}

function resolveEffectiveUrl(endpoint: ChatEndpointOption) {
  if (endpoint.id === "default" || !endpoint.url) {
    return getEnvChatApiUrl()
  }
  return endpoint.url
}

export function ChatEndpointProvider({ children }: { children: React.ReactNode }) {
  const [endpointId, setEndpointIdState] = React.useState(readStoredEndpointId)

  const endpoint =
    getChatEndpointById(endpointId) ?? CHAT_ENDPOINT_OPTIONS[0]!

  const setEndpointId = React.useCallback((id: string) => {
    setEndpointIdState(id)
    try {
      localStorage.setItem(ROOST_CHAT_ENDPOINT_KEY, id)
    } catch {
      // ignore quota errors
    }
    window.dispatchEvent(new CustomEvent("roost-chat-endpoint-changed"))
  }, [])

  const value = React.useMemo(
    () => ({
      endpointId,
      endpoint,
      effectiveApiUrl: resolveEffectiveUrl(endpoint),
      setEndpointId,
      options: CHAT_ENDPOINT_OPTIONS,
    }),
    [endpoint, endpointId, setEndpointId]
  )

  return (
    <ChatEndpointContext.Provider value={value}>
      {children}
    </ChatEndpointContext.Provider>
  )
}

export function useChatEndpointConfig() {
  const context = React.useContext(ChatEndpointContext)
  if (!context) {
    throw new Error(
      "useChatEndpointConfig must be used within ChatEndpointProvider"
    )
  }
  return context
}

export function getEffectiveChatApiUrl(): string {
  const storedId = readStoredEndpointId()
  const endpoint = getChatEndpointById(storedId) ?? CHAT_ENDPOINT_OPTIONS[0]!
  return resolveEffectiveUrl(endpoint)
}
