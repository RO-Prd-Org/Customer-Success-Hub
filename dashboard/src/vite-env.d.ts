/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** `mock` (default) or `live` — switches ChatTransport implementation. */
  readonly VITE_CHAT_MODE?: "mock" | "live"
  /** Chat API path or URL. Defaults to `/api/chat`. */
  readonly VITE_CHAT_API_URL?: string
  /** Dev proxy target when `VITE_CHAT_MODE=live`. Defaults to `http://localhost:3000`. */
  readonly VITE_CHAT_PROXY_TARGET?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
