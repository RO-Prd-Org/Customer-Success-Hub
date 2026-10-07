import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig, loadEnv } from "vite"

import { workshopDataPlugin } from "./vite-plugin-workshop-data"

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "")
  const chatProxyTarget = env.VITE_CHAT_PROXY_TARGET ?? "http://127.0.0.1:2000"
  const chatApiUrl = env.VITE_CHAT_API_URL ?? "/api/chat"
  const useChatProxy =
    env.VITE_CHAT_MODE === "live" && chatApiUrl.startsWith("/")

  return {
    plugins: [react(), tailwindcss(), workshopDataPlugin()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: useChatProxy
      ? {
          proxy: {
            [chatApiUrl]: {
              target: chatProxyTarget,
              changeOrigin: true,
            },
          },
        }
      : undefined,
  }
})
