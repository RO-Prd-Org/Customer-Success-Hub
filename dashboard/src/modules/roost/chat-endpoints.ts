export type ChatEndpointOption = {
  id: string
  label: string
  description: string
  url: string
}

export const CHAT_ENDPOINT_OPTIONS: ChatEndpointOption[] = [
  {
    id: "default",
    label: "Default (environment)",
    description: "Uses VITE_CHAT_API_URL from .env",
    url: "",
  },
  {
    id: "vercel-prod",
    label: "Talon agent — Vercel (production)",
    description: "https://talon-agent.vercel.app/api/chat",
    url: "https://talon-agent.vercel.app/api/chat",
  },
  {
    id: "local-dev",
    label: "Local development",
    description: "http://127.0.0.1:2000/api/chat",
    url: "http://127.0.0.1:2000/api/chat",
  },
  {
    id: "au-sydney",
    label: "AU Sydney region",
    description: "https://chat-au-syd.redowl.internal/api/chat",
    url: "https://chat-au-syd.redowl.internal/api/chat",
  },
  {
    id: "eu-frankfurt",
    label: "EU Frankfurt region",
    description: "https://chat-eu-fra.redowl.internal/api/chat",
    url: "https://chat-eu-fra.redowl.internal/api/chat",
  },
  {
    id: "us-east",
    label: "US East region",
    description: "https://chat-us-east.redowl.internal/api/chat",
    url: "https://chat-us-east.redowl.internal/api/chat",
  },
]

export const ROOST_CHAT_ENDPOINT_KEY = "roost-chat-endpoint-id"

export function getChatEndpointById(id: string) {
  return CHAT_ENDPOINT_OPTIONS.find((option) => option.id === id)
}
