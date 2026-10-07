export type ChatMode = "mock" | "live"

const DEFAULT_API_URL = "/api/chat"

export function getChatApiUrl(): string {
  return import.meta.env.VITE_CHAT_API_URL ?? DEFAULT_API_URL
}

export function isRemoteChatApiUrl(apiUrl: string = getChatApiUrl()): boolean {
  return /^https?:\/\//.test(apiUrl)
}

export function getChatMode(): ChatMode {
  const explicit = import.meta.env.VITE_CHAT_MODE

  if (explicit === "live") return "live"
  if (explicit === "mock") return "mock"

  // Auto: remote API URL implies live transport
  return isRemoteChatApiUrl() ? "live" : "mock"
}

export function getChatModeLabel(mode: ChatMode = getChatMode()): string {
  return mode === "live" ? "Live agent" : "Mock agent"
}
