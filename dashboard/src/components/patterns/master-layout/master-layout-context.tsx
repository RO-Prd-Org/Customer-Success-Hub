import * as React from "react"

type MasterLayoutContextValue = {
  chatbotOpen: boolean
  setChatbotOpen: (open: boolean) => void
  toggleChatbot: () => void
}

const MasterLayoutContext =
  React.createContext<MasterLayoutContextValue | null>(null)

export function useMasterLayout() {
  const context = React.useContext(MasterLayoutContext)
  if (!context) {
    throw new Error("useMasterLayout must be used within MasterLayout.")
  }
  return context
}

type MasterLayoutProviderProps = {
  children: React.ReactNode
  defaultChatbotOpen?: boolean
  chatbotOpen?: boolean
  onChatbotOpenChange?: (open: boolean) => void
  storageKey?: string
}

function readStoredPanelState(
  storageKey: string,
  fallback: boolean
) {
  try {
    const raw = localStorage.getItem(`${storageKey}:chatbot`)
    if (raw === "true") return true
    if (raw === "false") return false
  } catch {
    // ignore
  }
  return fallback
}

export function MasterLayoutProvider({
  children,
  defaultChatbotOpen = true,
  chatbotOpen: chatbotOpenProp,
  onChatbotOpenChange,
  storageKey,
}: MasterLayoutProviderProps) {
  const [_chatbotOpen, _setChatbotOpen] = React.useState(() =>
    storageKey
      ? readStoredPanelState(storageKey, defaultChatbotOpen)
      : defaultChatbotOpen
  )

  const chatbotOpen = chatbotOpenProp ?? _chatbotOpen

  const setChatbotOpen = React.useCallback(
    (open: boolean) => {
      if (onChatbotOpenChange) {
        onChatbotOpenChange(open)
      } else {
        _setChatbotOpen(open)
      }
      if (storageKey) {
        try {
          localStorage.setItem(`${storageKey}:chatbot`, String(open))
        } catch {
          // ignore
        }
      }
    },
    [onChatbotOpenChange, storageKey]
  )

  const toggleChatbot = React.useCallback(() => {
    setChatbotOpen(!chatbotOpen)
  }, [setChatbotOpen, chatbotOpen])

  const value = React.useMemo(
    () => ({
      chatbotOpen,
      setChatbotOpen,
      toggleChatbot,
    }),
    [chatbotOpen, setChatbotOpen, toggleChatbot]
  )

  return (
    <MasterLayoutContext.Provider value={value}>
      {children}
    </MasterLayoutContext.Provider>
  )
}
