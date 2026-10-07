import { BotIcon, MailIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import type { Conversation } from "@/lib/demo-conversations"
import type { Invoice } from "@/lib/demo-invoices"

type InvoiceContextTabProps = {
  invoice: Invoice
  conversations: Conversation[]
}

function statusLabel(status: Conversation["status"]) {
  switch (status) {
    case "resolved":
      return "Resolved"
    case "awaiting_reply":
      return "Awaiting reply"
    default:
      return "Open"
  }
}

function formatTimestamp(value: string) {
  return new Date(value).toLocaleString("en-AU", {
    dateStyle: "medium",
    timeStyle: "short",
  })
}

export function InvoiceContextTab({ invoice, conversations }: InvoiceContextTabProps) {
  const agentSessions = invoice.conversationIds.filter((id) => id.startsWith("wrun_"))

  if (conversations.length === 0 && agentSessions.length === 0 && !invoice.agentEvidence) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <MailIcon className="mb-3 size-8 text-muted-foreground" />
          <p className="text-sm font-medium">No context yet</p>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            {invoice.analysisPending
              ? "Run the EVE replay agent on this invoice to populate analysis and context."
              : "No email threads or agent sessions are linked to this invoice."}
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {agentSessions.map((sessionId) => (
        <Card key={sessionId}>
          <CardHeader className="pb-3">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <CardTitle className="flex items-center gap-2 text-base">
                  <BotIcon className="size-4" />
                  Agent session
                </CardTitle>
                <CardDescription className="mt-1 font-mono">{sessionId}</CardDescription>
              </div>
              <Badge variant="outline">EVE replay</Badge>
            </div>
          </CardHeader>
          {invoice.agentEvidence ? (
            <CardContent>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Evidence summary
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {invoice.agentEvidence}
              </p>
            </CardContent>
          ) : null}
        </Card>
      ))}

      {conversations.map((conversation) => (
        <Card key={conversation.id}>
          <CardHeader className="pb-3">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <CardTitle className="text-base">{conversation.subject}</CardTitle>
                <CardDescription className="mt-1">
                  {conversation.parties.join(" · ")} · Updated{" "}
                  {formatTimestamp(conversation.updatedAt)}
                </CardDescription>
              </div>
              <Badge variant="outline">{statusLabel(conversation.status)}</Badge>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {conversation.messages.map((message) => (
              <div key={message.id} className="rounded-lg border border-border p-4">
                <div className="mb-3 flex items-start gap-2.5">
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                    <MailIcon className="size-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-foreground">{message.from}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatTimestamp(message.sentAt)}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      To: {message.to.join(", ")}
                    </p>
                  </div>
                </div>
                <Separator className="my-3" />
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90 font-sans">
                  {message.body}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
