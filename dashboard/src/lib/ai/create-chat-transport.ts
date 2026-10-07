import {
  DefaultChatTransport,
  type ChatTransport,
  type UIMessage,
} from "ai"

import {
  getChatApiUrl,
  getChatMode,
  isRemoteChatApiUrl,
  type ChatMode,
} from "./chat-config"
import type { TalonChatContextPayload } from "./chat-request"
import { mockChatTransport } from "./mock-chat-transport"

export type CreateChatTransportOptions = {
  mode?: ChatMode | "auto"
  api?: string
  credentials?: RequestCredentials
  headers?: Record<string, string> | (() => Record<string, string>)
  getContext?: () => TalonChatContextPayload | undefined
}

function resolveHeaders(
  headers: CreateChatTransportOptions["headers"]
): Record<string, string> | undefined {
  if (!headers) return undefined
  return typeof headers === "function" ? headers() : headers
}

function resolveCredentials(
  api: string,
  credentials?: RequestCredentials
): RequestCredentials {
  if (credentials) return credentials
  return isRemoteChatApiUrl(api) ? "omit" : "same-origin"
}

export function createHttpChatTransport(
  options: Omit<CreateChatTransportOptions, "mode"> = {}
): ChatTransport<UIMessage> {
  const api = options.api ?? getChatApiUrl()

  return new DefaultChatTransport<UIMessage>({
    api,
    credentials: resolveCredentials(api, options.credentials),
    headers: resolveHeaders(options.headers),
    prepareSendMessagesRequest: (request) => ({
      body: {
        ...request.body,
        id: request.id,
        messages: request.messages,
        trigger: request.trigger,
        messageId: request.messageId,
        context: options.getContext?.(),
      },
    }),
    prepareReconnectToStreamRequest: (request) => ({
      api: request.api,
      credentials: request.credentials,
      headers: request.headers,
    }),
  })
}

export function createChatTransport(
  options: CreateChatTransportOptions = {}
): ChatTransport<UIMessage> {
  const mode = options.mode === "auto" || options.mode === undefined
    ? getChatMode()
    : options.mode

  if (mode === "mock") {
    return mockChatTransport
  }

  return createHttpChatTransport(options)
}
