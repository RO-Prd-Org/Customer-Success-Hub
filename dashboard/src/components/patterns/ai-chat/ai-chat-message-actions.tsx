import type { UIMessage } from "ai"
import {
  CopyIcon,
  RefreshCwIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
} from "lucide-react"
import { toast } from "sonner"

import {
  ButtonGroup,
  ButtonGroupText,
} from "@/components/ui/button-group"
import { Button } from "@/components/ui/button"
import type { UseChatHelpers } from "@ai-sdk/react"

import { getMessageText } from "./types"

type AiChatMessageActionsProps = {
  message: UIMessage
  chat: UseChatHelpers<UIMessage>
}

export function AiChatMessageActions({ message, chat }: AiChatMessageActionsProps) {
  if (message.role !== "assistant") return null

  const text = getMessageText(message)

  return (
    <ButtonGroup className="px-3">
      <Button
        variant="ghost"
        size="icon-xs"
        aria-label="Copy response"
        onClick={async () => {
          await navigator.clipboard.writeText(text)
          toast.success("Copied to clipboard")
        }}
      >
        <CopyIcon />
      </Button>
      <Button
        variant="ghost"
        size="icon-xs"
        aria-label="Regenerate response"
        onClick={() => {
          void chat.regenerate({ messageId: message.id })
        }}
      >
        <RefreshCwIcon />
      </Button>
      <ButtonGroupText className="sr-only">Feedback</ButtonGroupText>
      <Button variant="ghost" size="icon-xs" aria-label="Good response">
        <ThumbsUpIcon />
      </Button>
      <Button variant="ghost" size="icon-xs" aria-label="Bad response">
        <ThumbsDownIcon />
      </Button>
    </ButtonGroup>
  )
}
