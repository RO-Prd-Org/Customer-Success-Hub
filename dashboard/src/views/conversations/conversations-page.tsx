"use client"

import * as React from "react"
import { MailIcon, SearchIcon } from "lucide-react"

import { PageTopBar } from "@/components/patterns/page-shell"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import type { DemoInstance } from "@/lib/demo-instances"
import {
  getConversationById,
  getConversationsForDemo,
  type Conversation,
} from "@/lib/demo-conversations"
import { getInvoiceById } from "@/lib/demo-invoices"
import { InvoiceStatusBadge } from "@/views/invoices/invoice-status-badge"
import { cn } from "@/lib/utils"

type ConversationsPageProps = {
  demo: DemoInstance
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

function statusBadgeVariant(status: Conversation["status"]) {
  switch (status) {
    case "resolved":
      return "outline"
    case "awaiting_reply":
      return "secondary"
    default:
      return "default"
  }
}

function formatTimestamp(value: string) {
  return new Date(value).toLocaleString("en-AU", {
    dateStyle: "medium",
    timeStyle: "short",
  })
}

export function ConversationsPage({ demo }: ConversationsPageProps) {
  const conversations = React.useMemo(
    () => getConversationsForDemo(demo.id),
    [demo.id]
  )
  const [activeId, setActiveId] = React.useState(conversations[0]?.id ?? "")
  const [searchQuery, setSearchQuery] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<"all" | "open" | "resolved" | "awaiting_reply">("all")

  React.useEffect(() => {
    setActiveId(conversations[0]?.id ?? "")
  }, [conversations])

  const filteredConversations = React.useMemo(() => {
    return conversations.filter((conv) => {
      if (statusFilter !== "all" && conv.status !== statusFilter) {
        return false
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase()
        const matchSubject = conv.subject.toLowerCase().includes(query)
        const matchIssue = conv.issue.toLowerCase().includes(query)
        const matchParties = conv.parties.some((p) => p.toLowerCase().includes(query))
        const matchInvoice = conv.invoiceId?.toLowerCase().includes(query)
        return matchSubject || matchIssue || matchParties || matchInvoice
      }
      return true
    })
  }, [conversations, searchQuery, statusFilter])

  const activeConversation =
    getConversationById(demo.id, activeId) ?? filteredConversations[0] ?? conversations[0]

  const linkedInvoice = activeConversation?.invoiceId
    ? getInvoiceById(demo.id, activeConversation.invoiceId)
    : undefined

  return (
    <div className="flex h-[calc(100vh-80px)] flex-col gap-4 overflow-hidden pb-2">
      <PageTopBar breadcrumbs={[{ label: demo.name }, { label: "Conversations" }]} />

      <div className="flex shrink-0 items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-semibold">Conversations</h1>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {conversations.length} agent email threads investigating invoice issues across teams and external parties.
          </p>
        </div>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-[380px_minmax(0,1fr)]">
        {/* Left Column: Email Thread List (Independent Scroll) */}
        <div className="flex flex-col gap-3 min-h-0 h-full rounded-lg border border-border bg-card p-3 shadow-xs">
          <div className="flex shrink-0 flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Threads ({filteredConversations.length})
              </span>
              <Badge variant="secondary" className="text-[10px] font-normal">
                All Agent Acted
              </Badge>
            </div>

            <div className="relative">
              <SearchIcon className="absolute left-2.5 top-2.5 size-3.5 text-muted-foreground" />
              <Input
                placeholder="Search subject, invoice, party..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8 pl-8 text-xs"
              />
            </div>

            <div className="flex items-center gap-1 pt-1">
              {(["all", "open", "awaiting_reply", "resolved"] as const).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatusFilter(st)}
                  className={cn(
                    "rounded-md px-2 py-1 text-[11px] font-medium capitalize transition-colors",
                    statusFilter === st
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted"
                  )}
                >
                  {st === "all" ? "All" : st.replace("_", " ")}
                </button>
              ))}
            </div>
          </div>

          <Separator className="shrink-0" />

          {/* Independent Scroll Container for Left Column */}
          <div className="flex flex-1 flex-col gap-2 overflow-y-auto pr-1">
            {filteredConversations.length === 0 ? (
              <div className="py-8 text-center text-xs text-muted-foreground">
                No conversations match your search filter.
              </div>
            ) : (
              filteredConversations.map((conversation) => {
                const invoice = conversation.invoiceId
                  ? getInvoiceById(demo.id, conversation.invoiceId)
                  : undefined

                const isSelected = activeConversation?.id === conversation.id

                return (
                  <button
                    key={conversation.id}
                    type="button"
                    onClick={() => setActiveId(conversation.id)}
                    className={cn(
                      "group rounded-lg border border-border/80 p-3 text-left transition-all hover:border-border hover:bg-muted/50",
                      isSelected && "border-primary bg-accent/50 shadow-2xs"
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className={cn("line-clamp-1 text-xs font-semibold text-foreground", isSelected && "text-primary")}>
                          {conversation.subject}
                        </p>
                        <p className="mt-1 truncate text-[11px] text-muted-foreground">
                          {conversation.parties.join(" · ")}
                        </p>
                      </div>
                      <div className="shrink-0">
                        {invoice?.status === "red" ? (
                          <InvoiceStatusBadge status="red" />
                        ) : (
                          <Badge variant={statusBadgeVariant(conversation.status)} className="text-[10px]">
                            {statusLabel(conversation.status)}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <p className="mt-1.5 line-clamp-2 text-[11px] leading-snug text-muted-foreground/90">
                      {conversation.issue}
                    </p>
                    <div className="mt-2 flex items-center justify-between text-[10px] text-muted-foreground/70">
                      <span>{conversation.messages.length} messages</span>
                      <span>{formatTimestamp(conversation.updatedAt)}</span>
                    </div>
                  </button>
                )
              })
            )}
          </div>
        </div>

        {/* Right Column: Email Content Details (Independent Scroll) */}
        {activeConversation ? (
          <Card className="flex flex-col min-h-0 h-full overflow-hidden border-border shadow-xs">
            <CardHeader className="shrink-0 border-b border-border bg-card pb-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[11px]">
                      {activeConversation.id}
                    </Badge>
                    {activeConversation.invoiceId ? (
                      <Badge variant="secondary" className="font-mono text-[11px]">
                        Invoice {activeConversation.invoiceId}
                      </Badge>
                    ) : null}
                  </div>
                  <CardTitle className="mt-2 text-lg font-semibold leading-snug">
                    {activeConversation.subject}
                  </CardTitle>
                  <CardDescription className="mt-1 text-xs">
                    {activeConversation.parties.join(" · ")} · Updated{" "}
                    {formatTimestamp(activeConversation.updatedAt)}
                  </CardDescription>
                </div>
                <Badge variant={statusBadgeVariant(activeConversation.status)} className="text-xs">
                  {statusLabel(activeConversation.status)}
                </Badge>
              </div>
            </CardHeader>

            {/* Independent Scroll Container for Right Column Body */}
            <CardContent className="flex-1 overflow-y-auto p-6 space-y-5">
              <div className="rounded-lg border border-border bg-muted/20 p-3.5 text-xs">
                <p className="font-semibold uppercase tracking-wider text-muted-foreground text-[10px]">
                  Issue Flagged
                </p>
                <p className="mt-1 text-sm font-medium text-foreground">{activeConversation.issue}</p>
              </div>

              {linkedInvoice ? (
                <div className="rounded-lg border border-brand/20 bg-brand/5 p-4 text-xs">
                  <div className="mb-2 flex items-center gap-2">
                    <InvoiceStatusBadge status="red" />
                    <span className="font-semibold text-foreground text-sm">{linkedInvoice.id} — {linkedInvoice.vendor}</span>
                  </div>
                  <p className="text-muted-foreground leading-relaxed text-xs">{linkedInvoice.reasoning}</p>
                  {linkedInvoice.agentAction ? (
                    <>
                      <Separator className="my-3" />
                      <p className="font-medium text-foreground/90 leading-relaxed text-xs">{linkedInvoice.agentAction}</p>
                    </>
                  ) : null}
                </div>
              ) : null}

              <div className="space-y-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Email Message Thread ({activeConversation.messages.length})
                </p>

                <div className="flex flex-col gap-4">
                  {activeConversation.messages.map((message) => (
                    <div
                      key={message.id}
                      className="rounded-lg border border-border bg-card p-4 shadow-2xs transition-shadow hover:shadow-xs"
                    >
                      <div className="mb-3 flex items-start gap-2.5">
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                          <MailIcon className="size-4" />
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
                      <div className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90 font-sans">
                        {message.body}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </div>
  )
}
