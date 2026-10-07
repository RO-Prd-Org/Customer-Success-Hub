import type { DynamicToolUIPart } from "ai"
import {
  ChevronDownIcon,
  ExternalLinkIcon,
  RefreshCwIcon,
  WrenchIcon,
} from "lucide-react"
import * as React from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Spinner } from "@/components/ui/spinner"
import { useAiChatContext } from "@/hooks/use-ai-chat-context"
import type { UseChatHelpers } from "@ai-sdk/react"
import type { UIMessage } from "ai"

import { AiChatApproval } from "./ai-chat-approval"

type AiChatToolCallProps = {
  part: DynamicToolUIPart
  chat: UseChatHelpers<UIMessage>
}

function getStateLabel(state: DynamicToolUIPart["state"]) {
  switch (state) {
    case "input-streaming":
    case "input-available":
      return "Running"
    case "approval-requested":
      return "Approval required"
    case "approval-responded":
      return "Awaiting execution"
    case "output-available":
      return "Complete"
    case "output-error":
      return "Failed"
    default:
      return "Pending"
  }
}

function getStateVariant(state: DynamicToolUIPart["state"]) {
  switch (state) {
    case "output-available":
      return "default" as const
    case "output-error":
      return "destructive" as const
    case "approval-requested":
      return "secondary" as const
    default:
      return "outline" as const
  }
}

export function AiChatToolCall({ part, chat }: AiChatToolCallProps) {
  const { handleToolApproval } = useAiChatContext()
  const [rawOpen, setRawOpen] = React.useState(false)

  const approval = "approval" in part ? part.approval : undefined

  return (
    <Card className="overflow-hidden py-0">
      <CardHeader className="flex flex-row items-start justify-between gap-2 border-b px-3 py-2">
        <div className="flex min-w-0 items-start gap-2">
          <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md bg-muted">
            <WrenchIcon className="size-3.5" />
          </div>
          <div className="min-w-0">
            <CardTitle className="text-sm">{part.toolName}</CardTitle>
            <p className="text-xs text-muted-foreground">
              Export vendor records to external destination
            </p>
          </div>
        </div>

        <Badge variant={getStateVariant(part.state)}>{getStateLabel(part.state)}</Badge>
      </CardHeader>

      <CardContent className="space-y-3 px-3 py-3">
        {"input" in part && part.input ? (
          <div className="text-sm">
            <p className="mb-1 text-xs font-medium text-muted-foreground">Input</p>
            <p className="rounded-md bg-muted px-2 py-1.5 font-mono text-xs">
              {JSON.stringify(part.input, null, 0)}
            </p>
          </div>
        ) : null}

        {part.state === "input-streaming" || part.state === "input-available" ? (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Spinner className="size-3" />
            Running tool…
          </div>
        ) : null}

        {"output" in part && part.output ? (
          <div className="text-sm">
            <p className="mb-1 text-xs font-medium text-muted-foreground">Output</p>
            <p className="rounded-md bg-muted px-2 py-1.5 text-xs">
              Export queued successfully.
            </p>
          </div>
        ) : null}

        {part.state === "output-error" && "errorText" in part ? (
          <div className="space-y-2">
            <p className="text-sm text-destructive">{part.errorText}</p>
            <Button size="sm" variant="outline">
              <RefreshCwIcon />
              Retry
            </Button>
          </div>
        ) : null}

        <Collapsible open={rawOpen} onOpenChange={setRawOpen}>
          <CollapsibleTrigger className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
            <ChevronDownIcon className="size-3.5" />
            Raw JSON
          </CollapsibleTrigger>
          <CollapsibleContent>
            <pre className="mt-2 overflow-x-auto rounded-md bg-muted p-2 text-[11px]">
              {JSON.stringify(part, null, 2)}
            </pre>
          </CollapsibleContent>
        </Collapsible>

        <div className="flex gap-2">
          <Button size="sm" variant="outline">
            <ExternalLinkIcon />
            Open in source
          </Button>
        </div>

        {part.state === "approval-requested" && approval ? (
          <AiChatApproval
            title="Approve export to external destination?"
            description="This will share vendor records with analytics.redowl.io."
            onApprove={() => handleToolApproval(chat, approval.id, true)}
            onReject={() => handleToolApproval(chat, approval.id, false)}
          />
        ) : null}
      </CardContent>
    </Card>
  )
}
