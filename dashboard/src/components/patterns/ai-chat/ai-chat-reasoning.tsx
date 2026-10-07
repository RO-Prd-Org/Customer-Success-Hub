import { ChevronDownIcon, SparklesIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"

import type { TalonReasoning } from "./types"

type AiChatReasoningProps = {
  reasoning: TalonReasoning
  isStreaming?: boolean
}

export function AiChatReasoning({
  reasoning,
  isStreaming = false,
}: AiChatReasoningProps) {
  return (
    <Collapsible defaultOpen={isStreaming} className="rounded-lg border border-border bg-muted/30">
      <CollapsibleTrigger className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm">
        <span className="flex min-w-0 items-center gap-2">
          <SparklesIcon
            className={cn(
              "size-4 shrink-0 text-muted-foreground",
              isStreaming && "animate-pulse text-primary"
            )}
          />
          <span className="truncate font-medium">
            {isStreaming ? "Reasoning" : reasoning.summary}
          </span>
          {isStreaming ? (
            <span className="inline-flex gap-0.5" aria-hidden="true">
              <span className="size-1 animate-bounce rounded-full bg-primary [animation-delay:0ms]" />
              <span className="size-1 animate-bounce rounded-full bg-primary [animation-delay:150ms]" />
              <span className="size-1 animate-bounce rounded-full bg-primary [animation-delay:300ms]" />
            </span>
          ) : null}
        </span>
        <span className="flex items-center gap-2">
          {reasoning.confidence ? (
            <Badge variant="outline" className="text-[10px] uppercase">
              {reasoning.confidence} confidence
            </Badge>
          ) : null}
          <ChevronDownIcon className="size-4 shrink-0 text-muted-foreground" />
        </span>
      </CollapsibleTrigger>

      <CollapsibleContent className="space-y-2 border-t border-border px-3 py-2 text-sm text-muted-foreground">
        {reasoning.objective ? (
          <p>
            <span className="font-medium text-foreground">Objective:</span>{" "}
            {reasoning.objective}
          </p>
        ) : null}
        {reasoning.details ? <p>{reasoning.details}</p> : null}
        {isStreaming && reasoning.summary ? (
          <p className="text-xs italic">{reasoning.summary}</p>
        ) : null}
      </CollapsibleContent>
    </Collapsible>
  )
}
