import * as React from "react"
import { toast } from "sonner"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
} from "@/components/ui/drawer"
import { useAiChatContext } from "@/hooks/use-ai-chat-context"
import { useAiChat } from "@/hooks/use-ai-chat"
import { useChatEndpointConfig } from "@/hooks/use-chat-endpoint-config"
import { getChatModeLabel } from "@/lib/ai"
import { useConversationHistory } from "@/hooks/use-conversation-history"
import { useIsMobile } from "@/hooks/use-media-query"
import { cn } from "@/lib/utils"

import { AiChatConversation } from "./ai-chat-conversation"
import { AiChatFooter } from "./ai-chat-footer"
import { AiChatDebug } from "./ai-chat-debug"
import { AiChatError } from "./ai-chat-error"
import { AiChatHeader } from "./ai-chat-header"
import type { AiChatPanelProps } from "./types"

const DEFAULT_SUGGESTIONS = [
  "Run agent workflow",
  "Show metrics dashboard",
  "Explain the master layout pattern",
]

const DRAFT_STORAGE_KEY = "redowl-ai-chat-draft"

function readDraft(storageKey: string) {
  if (typeof window === "undefined") return ""

  try {
    return localStorage.getItem(storageKey) ?? ""
  } catch {
    return ""
  }
}

function writeDraft(storageKey: string, value: string) {
  try {
    if (value) {
      localStorage.setItem(storageKey, value)
    } else {
      localStorage.removeItem(storageKey)
    }
  } catch {
    // Ignore quota errors in demo mode.
  }
}

type AiChatPanelContentProps = {
  className?: string
  title?: string
  subtitle?: string
  suggestions?: string[]
  draftStorageKey?: string
  width?: number
  onWidthChange?: (width: number) => void
  chat: NonNullable<AiChatPanelProps["chat"]>
}

function AiChatPanelContent({
  className,
  title,
  subtitle,
  suggestions = DEFAULT_SUGGESTIONS,
  draftStorageKey = DRAFT_STORAGE_KEY,
  width,
  onWidthChange,
  chat,
}: AiChatPanelContentProps) {
  const { fullscreen } = useAiChatContext()
  const {
    conversations,
    saveConversation,
    renameConversation,
    togglePinConversation,
    deleteConversation,
  } = useConversationHistory()
  const [input, setInput] = React.useState(() => readDraft(draftStorageKey))
  const [lastFailedInput, setLastFailedInput] = React.useState<string | null>(
    null
  )
  const [conversationTitle, setConversationTitle] = React.useState("New conversation")

  const isBusy = chat.status === "submitted" || chat.status === "streaming"

  React.useEffect(() => {
    writeDraft(draftStorageKey, input)
  }, [draftStorageKey, input])

  React.useEffect(() => {
    if (chat.status !== "ready" || chat.messages.length === 0) return

    saveConversation(chat.id, chat.messages)

    const firstUser = chat.messages.find((message) => message.role === "user")
    if (firstUser) {
      const text = firstUser.parts
        .filter((part): part is { type: "text"; text: string } => part.type === "text")
        .map((part) => part.text)
        .join("")
      if (text) {
        const nextTitle = text.length > 42 ? `${text.slice(0, 42)}…` : text
        setConversationTitle((current) =>
          current === nextTitle ? current : nextTitle
        )
      }
    }
  }, [chat.id, chat.messages, chat.status, saveConversation])

  const handleSubmit = React.useCallback(
    async (text?: string) => {
      const messageText = (text ?? input).trim()
      if (!messageText || isBusy) return

      setLastFailedInput(null)
      setInput("")

      try {
        await chat.sendMessage({ text: messageText })
      } catch {
        setInput(messageText)
        setLastFailedInput(messageText)
      }
    },
    [chat, input, isBusy]
  )

  const handleNewChat = React.useCallback(() => {
    chat.stop()
    chat.setMessages([])
    chat.clearError()
    setInput("")
    setLastFailedInput(null)
    setConversationTitle("New conversation")
    writeDraft(draftStorageKey, "")
  }, [chat, draftStorageKey])

  const handleRetry = React.useCallback(() => {
    chat.clearError()
    if (lastFailedInput) {
      void handleSubmit(lastFailedInput)
    }
  }, [chat, handleSubmit, lastFailedInput])

  const handleResizePointerDown = React.useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!onWidthChange || width === undefined || fullscreen) return

      event.preventDefault()

      const startX = event.clientX
      const startWidth = width

      const handlePointerMove = (moveEvent: PointerEvent) => {
        const delta = startX - moveEvent.clientX
        onWidthChange(startWidth + delta)
      }

      const handlePointerUp = () => {
        window.removeEventListener("pointermove", handlePointerMove)
        window.removeEventListener("pointerup", handlePointerUp)
      }

      window.addEventListener("pointermove", handlePointerMove)
      window.addEventListener("pointerup", handlePointerUp)
    },
    [fullscreen, onWidthChange, width]
  )

  const shell = (
    <div
      data-slot="ai-chat-panel"
      className={cn("relative flex h-full min-h-0 flex-col bg-sidebar", className)}
    >
      {onWidthChange && !fullscreen ? (
        <div
          role="separator"
          aria-orientation="vertical"
          aria-label="Resize chat panel"
          onPointerDown={handleResizePointerDown}
          className="absolute inset-y-0 left-0 z-20 w-1 cursor-col-resize hover:bg-border/80"
        />
      ) : null}

      <header data-slot="ai-chat-header">
        <AiChatHeader
          title={title ?? conversationTitle}
          subtitle={subtitle ?? `${getChatModeLabel()} · Talon assistant`}
          onNewChat={handleNewChat}
          history={{
            conversations,
            activeConversationId: chat.id,
            onSelect: (conversation) => {
              chat.setMessages(conversation.messages)
              setConversationTitle(conversation.title)
              toast.success("Conversation loaded")
            },
            onRename: renameConversation,
            onTogglePin: togglePinConversation,
            onDelete: deleteConversation,
          }}
        />
      </header>

      <section
        data-slot="ai-chat-body"
        className="flex min-h-0 flex-1 flex-col overflow-hidden"
      >
        <AiChatDebug chat={chat} />

        {chat.error ? (
          <AiChatError
            message={chat.error.message}
            onRetry={lastFailedInput ? handleRetry : undefined}
            onDismiss={chat.clearError}
          />
        ) : null}

        <AiChatConversation
          chat={chat}
          suggestions={suggestions}
          onSuggestionSelect={(suggestion) => {
            void handleSubmit(suggestion)
          }}
        />
      </section>

      <AiChatFooter
        value={input}
        onChange={setInput}
        onSubmit={() => {
          void handleSubmit()
        }}
        onStop={chat.stop}
        isBusy={isBusy}
      />

    </div>
  )

  return shell
}

export function AiChatPanel({
  className,
  title,
  subtitle,
  suggestions,
  draftStorageKey,
  width,
  onWidthChange,
  chat: chatProp,
  transport,
  variant = "panel",
}: AiChatPanelProps) {
  const { effectiveApiUrl } = useChatEndpointConfig()
  const internalChat = useAiChat({
    transport,
    mode: transport ? undefined : "auto",
    api: transport ? undefined : effectiveApiUrl,
  })
  const chat = chatProp ?? internalChat
  const { fullscreen, setFullscreen } = useAiChatContext()
  const isMobile = useIsMobile()
  const [mobileOpen, setMobileOpen] = React.useState(false)

  React.useEffect(() => {
    if (chat.status !== "ready") return

    const lastMessage = chat.messages.at(-1)
    if (lastMessage?.role === "assistant") {
      const hasArtifact = Boolean(
        (lastMessage.metadata as { talon?: { artifact?: unknown } })?.talon?.artifact
      )
      if (hasArtifact) {
        toast.success("Artefact ready", {
          description: "The assistant returned a preview card in the thread.",
        })
      }
    }
  }, [chat.messages, chat.status])

  const content = (
    <AiChatPanelContent
      className={className}
      title={title}
      subtitle={subtitle}
      suggestions={suggestions}
      draftStorageKey={draftStorageKey}
      width={width}
      onWidthChange={onWidthChange}
      chat={chat}
    />
  )

  if (variant === "drawer") {
    return (
      <Drawer open={mobileOpen} onOpenChange={setMobileOpen}>
        <DrawerContent className="h-[85vh]">
          <DrawerTitle className="sr-only">Assistant</DrawerTitle>
          <DrawerDescription className="sr-only">
            Mobile assistant drawer
          </DrawerDescription>
          {content}
        </DrawerContent>
      </Drawer>
    )
  }

  if (isMobile && variant === "panel") {
    return (
      <>
        <button
          type="button"
          aria-label="Open assistant"
          className="fixed right-4 bottom-4 z-40 flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg"
          onClick={() => setMobileOpen(true)}
        >
          AI
        </button>
        <Drawer open={mobileOpen} onOpenChange={setMobileOpen}>
          <DrawerContent className="h-[88vh]">
            <DrawerTitle className="sr-only">Assistant</DrawerTitle>
            <DrawerDescription className="sr-only">
              Mobile assistant drawer
            </DrawerDescription>
            {content}
          </DrawerContent>
        </Drawer>
      </>
    )
  }

  return (
    <>
      {!fullscreen ? content : null}

      <Dialog open={fullscreen} onOpenChange={setFullscreen}>
        <DialogContent
          showCloseButton
          className="flex h-[90vh] max-h-[90vh] w-[min(960px,95vw)] max-w-[95vw] flex-col gap-0 overflow-hidden p-0"
        >
          <DialogTitle className="sr-only">Assistant full screen</DialogTitle>
          <DialogDescription className="sr-only">
            Full-screen assistant panel
          </DialogDescription>
          <AiChatPanelContent
            className="h-full"
            title={title}
            subtitle={subtitle}
            suggestions={suggestions}
            draftStorageKey={draftStorageKey}
            chat={chat}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}
