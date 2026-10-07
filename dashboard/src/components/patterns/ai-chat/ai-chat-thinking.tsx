import { SparklesIcon } from "lucide-react"

import { cn } from "@/lib/utils"

type AiChatThinkingProps = {
  text?: string
  className?: string
}

export function AiChatThinking({ text, className }: AiChatThinkingProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-muted/30 px-3 py-2.5 text-sm",
        className
      )}
    >
      <div className="flex items-center gap-2 text-muted-foreground">
        <SparklesIcon className="size-4 shrink-0 animate-pulse text-primary" />
        <span className="font-medium text-foreground">Thinking</span>
        <span className="inline-flex gap-0.5" aria-hidden="true">
          <span className="size-1 animate-bounce rounded-full bg-primary [animation-delay:0ms]" />
          <span className="size-1 animate-bounce rounded-full bg-primary [animation-delay:150ms]" />
          <span className="size-1 animate-bounce rounded-full bg-primary [animation-delay:300ms]" />
        </span>
      </div>

      {text ? (
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{text}</p>
      ) : null}
    </div>
  )
}
