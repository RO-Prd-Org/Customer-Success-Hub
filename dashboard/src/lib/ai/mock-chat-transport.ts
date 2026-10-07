import {
  createUIMessageStream,
  type ChatTransport,
  type UIMessage,
} from "ai"

import { detectScenario, runMockScenario } from "./mock-scenarios"

export class MockChatTransport implements ChatTransport<UIMessage> {
  async sendMessages({
    messages,
    abortSignal,
  }: Parameters<ChatTransport<UIMessage>["sendMessages"]>[0]) {
    const scenario = detectScenario(messages)

    return createUIMessageStream({
      execute: async ({ writer }) => {
        await runMockScenario(scenario, writer, abortSignal)
      },
    })
  }

  async reconnectToStream() {
    return null
  }
}

export const mockChatTransport = new MockChatTransport()
