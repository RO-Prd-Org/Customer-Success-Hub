import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import "./index.css"
import App from "./App.tsx"
import { AiChatProvider } from "@/hooks/use-ai-chat-context.tsx"
import { ChatEndpointProvider } from "@/hooks/use-chat-endpoint-config.tsx"
import { ThemeProvider } from "@/components/theme-provider.tsx"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="light">
      <ChatEndpointProvider>
        <AiChatProvider>
          <TooltipProvider>
            <App />
            <Toaster />
          </TooltipProvider>
        </AiChatProvider>
      </ChatEndpointProvider>
    </ThemeProvider>
  </StrictMode>
)
