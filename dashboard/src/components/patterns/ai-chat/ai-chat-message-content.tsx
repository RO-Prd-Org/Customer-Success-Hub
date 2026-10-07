import { Streamdown } from "streamdown"
import { cn } from "@/lib/utils"

type AiChatMessageContentProps = {
  content: string
  isStreaming?: boolean
  className?: string
}

export function AiChatMessageContent({
  content,
  isStreaming = false,
  className,
}: AiChatMessageContentProps) {
  if (!content && isStreaming) {
    return (
      <span className="text-muted-foreground italic">Thinking…</span>
    )
  }

  return (
    <Streamdown
      mode={isStreaming ? "streaming" : "static"}
      isAnimating={isStreaming}
      className={cn(
        "prose prose-sm dark:prose-invert max-w-none [&_p]:my-1 [&_ul]:my-1 [&_ol]:my-1",
        className
      )}
    >
      {content}
    </Streamdown>
  )
}
