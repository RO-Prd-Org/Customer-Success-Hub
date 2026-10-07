import * as React from "react"
import { ArrowUpIcon, PaperclipIcon, SquareIcon } from "lucide-react"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import { useAiChatContext } from "@/hooks/use-ai-chat-context"
import { cn } from "@/lib/utils"

type AiChatComposerProps = {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  onStop?: () => void
  isBusy?: boolean
  placeholder?: string
  className?: string
}

export function AiChatComposer({
  value,
  onChange,
  onSubmit,
  onStop,
  isBusy = false,
  placeholder = "Ask about Talon patterns…",
  className,
}: AiChatComposerProps) {
  const { addAttachment, updateAttachment } = useAiChatContext()
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)
  const fileInputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return

    textarea.style.height = "auto"
    textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`
  }, [value])

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()

    if (isBusy) {
      onStop?.()
      return
    }

    const trimmed = value.trim()
    if (!trimmed) return

    onSubmit()
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== "Enter" || event.shiftKey) {
      return
    }

    event.preventDefault()

    if (isBusy) {
      onStop?.()
      return
    }

    const trimmed = value.trim()
    if (!trimmed) return

    onSubmit()
  }

  const handleAttachClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const id = `file-${Date.now()}`
    addAttachment({
      id,
      name: file.name,
      sizeLabel: `${Math.max(1, Math.round(file.size / 1024))} KB`,
      mediaType: file.type || "application/octet-stream",
      state: "uploading",
      progress: 12,
    })

    window.setTimeout(() => {
      updateAttachment(id, { state: "processing", progress: 72 })
    }, 500)

    window.setTimeout(() => {
      updateAttachment(id, { state: "done", progress: 100 })
    }, 1200)

    event.target.value = ""
  }

  const canSend = value.trim().length > 0

  return (
    <div
      data-slot="ai-chat-footer-input"
      className={cn("px-3 py-2", className)}
    >
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileChange}
      />

      <form onSubmit={handleSubmit}>
        <InputGroup className="min-h-10 has-[>textarea]:h-auto has-[>[data-align=block-end]]:flex-col">
          <InputGroupTextarea
            ref={textareaRef}
            value={value}
            rows={1}
            placeholder={placeholder}
            aria-label="Message"
            className="min-h-10 w-full py-2.5"
            onChange={(event) => onChange(event.target.value)}
            onKeyDown={handleKeyDown}
          />

          <InputGroupAddon
            align="block-end"
            className="w-full justify-end gap-0.5 px-2 pb-2 pt-0"
          >
            <InputGroupButton
              type="button"
              size="icon-sm"
              variant="ghost"
              aria-label="Attach file"
              onClick={handleAttachClick}
            >
              <PaperclipIcon />
            </InputGroupButton>
            <InputGroupButton
              type="submit"
              size="icon-sm"
              variant={isBusy ? "secondary" : "default"}
              disabled={!isBusy && !canSend}
              aria-label={isBusy ? "Stop generating" : "Send message"}
            >
              {isBusy ? <SquareIcon className="fill-current" /> : <ArrowUpIcon />}
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </form>
    </div>
  )
}
