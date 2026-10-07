import { generateId, type UIMessage, type UIMessageStreamWriter } from "ai"

import type {
  TalonMessageMetadata,
  TalonUserMetadata,
} from "@/components/patterns/ai-chat/types"

export type MockScenario =
  | "default"
  | "pattern"
  | "help"
  | "error"
  | "agent"
  | "artifact"
  | "clarification-followup"
  | "approval-complete"

function sleep(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException("Aborted", "AbortError"))
      return
    }

    const timeout = window.setTimeout(resolve, ms)

    signal?.addEventListener(
      "abort",
      () => {
        window.clearTimeout(timeout)
        reject(new DOMException("Aborted", "AbortError"))
      },
      { once: true }
    )
  })
}

async function streamText(
  writer: UIMessageStreamWriter,
  text: string,
  abortSignal?: AbortSignal,
  delayMs = 16
) {
  const textId = generateId()
  writer.write({ type: "text-start", id: textId })

  for (const token of text.split(/(\s+)/)) {
    if (abortSignal?.aborted) break
    await sleep(delayMs, abortSignal)
    writer.write({ type: "text-delta", id: textId, delta: token })
  }

  if (!abortSignal?.aborted) {
    writer.write({ type: "text-end", id: textId })
  }
}

async function streamReasoning(
  writer: UIMessageStreamWriter,
  text: string,
  abortSignal?: AbortSignal
) {
  const reasoningId = generateId()
  writer.write({ type: "reasoning-start", id: reasoningId })

  for (const token of text.split(/(\s+)/)) {
    if (abortSignal?.aborted) break
    await sleep(12, abortSignal)
    writer.write({ type: "reasoning-delta", id: reasoningId, delta: token })
  }

  if (!abortSignal?.aborted) {
    writer.write({ type: "reasoning-end", id: reasoningId })
  }
}

function getLastUserText(messages: UIMessage[]): string {
  const lastUser = [...messages].reverse().find((message) => message.role === "user")
  if (!lastUser) return ""

  return lastUser.parts
    .filter((part): part is { type: "text"; text: string } => part.type === "text")
    .map((part) => part.text)
    .join("")
}

function getLastUserMetadata(messages: UIMessage[]): TalonUserMetadata | undefined {
  const lastUser = [...messages].reverse().find((message) => message.role === "user")
  return lastUser?.metadata as TalonUserMetadata | undefined
}

export function detectScenario(messages: UIMessage[]): MockScenario {
  const userText = getLastUserText(messages).toLowerCase()
  const userMetadata = getLastUserMetadata(messages)

  if (userMetadata?.clarificationResponse) {
    return "clarification-followup"
  }

  if (userText.includes("approve") || userText.includes("approved export")) {
    return "approval-complete"
  }

  if (
    userText.includes("agent") ||
    userText.includes("workflow") ||
    userText.includes("export")
  ) {
    return "agent"
  }

  if (
    userText.includes("artefact") ||
    userText.includes("artifact") ||
    userText.includes("table") ||
    userText.includes("metric") ||
    userText.includes("dashboard")
  ) {
    return "artifact"
  }

  if (userText.includes("error")) {
    return "error"
  }

  if (userText.includes("pattern") || userText.includes("layout")) {
    return "pattern"
  }

  if (userText.includes("help") || userText.includes("phase")) {
    return "help"
  }

  return "default"
}

const DEFAULT_RESPONSE = `I'm the **Talon assistant** — a mock stream for the RedOwl design system.

Try these demos:
- **"Run agent workflow"** — thinking animation, tool call, sources, citations
- **"Show metrics dashboard"** — metric cards and table artefact
- **"Explain patterns"** — layout guidance with inline citations`

export async function runMockScenario(
  scenario: MockScenario,
  writer: UIMessageStreamWriter,
  abortSignal?: AbortSignal
) {
  switch (scenario) {
    case "error":
      throw new Error("Mock transport error — try again.")

    case "pattern":
      await streamText(
        writer,
        `The **master layout** uses a three-column shell:

1. Collapsible sidebar (\`collapsible="icon"\`)
2. Main app area (\`SidebarInset\`)
3. Right chatbot panel (\`CollapsiblePanel\`)

Data tables support **clickable** and **action** row variants.`,
        abortSignal
      )
      writer.write({
        type: "message-metadata",
        messageMetadata: {
          talon: {
            followUps: [
              "Run agent workflow",
              "Show table artefact",
            ],
            citations: [
              {
                id: "cite-1",
                label: "1",
                title: "Master layout pattern",
                type: "Internal doc",
                owner: "Design system",
                updatedAt: "2026-03-01",
                url: "https://docs.redowl.io/patterns/master-layout",
                excerpt: "Three-column shell with collapsible sidebar and chatbot panel.",
              },
            ],
            sources: [
              {
                id: "src-layout",
                title: "RedOwl design system docs",
                url: "https://docs.redowl.io/patterns/master-layout",
                provider: "RedOwl Docs",
                description: "Pattern library reference for layout shells.",
              },
            ],
          },
        } satisfies TalonMessageMetadata,
      })
      return

    case "help":
      await streamText(
        writer,
        `You're on **Phase 2+3** of the AI chat block.

**Agent demo:** ask to run an agent workflow.
**Artefact demo:** ask for a table artefact.
**Fullscreen:** use the expand control in the chat header.
**History:** open conversations from the history button.`,
        abortSignal
      )
      return

    case "agent": {
      await streamReasoning(
        writer,
        "Reviewing export policy, record scope, and whether external sharing is required.",
        abortSignal
      )

      writer.write({
        type: "message-metadata",
        messageMetadata: {
          talon: {
            reasoning: {
              summary: "Checked export policy and scoped records to active vendors.",
              details:
                "Assumed workspace default retention rules apply. Flagged external destination for approval.",
              confidence: "medium",
              objective: "Export vendor records for Q1 review",
            },
            plan: {
              steps: [
                { id: "s1", label: "Validate export permissions", state: "complete" },
                { id: "s2", label: "Prepare vendor record set", state: "active" },
                { id: "s3", label: "Request approval for external share", state: "pending" },
                { id: "s4", label: "Deliver export package", state: "pending" },
              ],
            },
          },
        } satisfies TalonMessageMetadata,
      })

      await streamText(
        writer,
        "I can export **12 active vendor records** to the analytics workspace. This action requires approval because data may leave the internal boundary.",
        abortSignal
      )

      writer.write({
        type: "source-url",
        sourceId: "src-analytics",
        url: "https://analytics.redowl.io/vendors/active",
        title: "RedOwl Analytics · Active vendor registry",
      })

      const toolCallId = generateId()
      writer.write({
        type: "tool-input-available",
        toolCallId,
        toolName: "exportRecords",
        input: {
          destination: "analytics.redowl.io",
          recordCount: 12,
          format: "csv",
        },
        dynamic: true,
      })

      writer.write({
        type: "tool-approval-request",
        approvalId: generateId(),
        toolCallId,
        reason: "Export may share vendor data outside the workspace boundary.",
      })

      writer.write({
        type: "message-metadata",
        messageMetadata: {
          talon: {
            clarification: {
              id: "clarify-export",
              title: "Export preferences",
              description: "Choose how the export should be delivered.",
              items: [
                {
                  id: "format",
                  type: "single",
                  title: "Preferred format",
                  choices: [
                    { id: "csv", label: "CSV", description: "Spreadsheet-friendly" },
                    { id: "json", label: "JSON", description: "Structured API payload" },
                  ],
                },
                {
                  id: "notify",
                  type: "single",
                  title: "Notify when complete",
                  choices: [
                    { id: "email", label: "Email me" },
                    { id: "in-app", label: "In-app only" },
                  ],
                },
              ],
            },
            citations: [
              {
                id: "cite-policy",
                label: "1",
                title: "Data export policy",
                type: "Policy",
                owner: "Security",
                updatedAt: "2026-02-12",
                url: "https://docs.redowl.io/security/export-policy",
                excerpt: "External exports require explicit approval once per destination.",
              },
            ],
            sources: [
              {
                id: "src-analytics-meta",
                title: "RedOwl Analytics vendor API",
                url: "https://analytics.redowl.io/vendors/active",
                provider: "RedOwl Analytics",
                description: "Third-party analytics workspace referenced by the export tool.",
              },
            ],
            trust: {
              label: "Internal records · external destination",
              externalShare: true,
              sourceVisibility: "restricted",
            },
            followUps: ["Approve export", "Show metrics dashboard"],
          },
        } satisfies TalonMessageMetadata,
      })
      return
    }

    case "approval-complete":
      await streamText(
        writer,
        "Export **approved**. The vendor record package is being prepared and will be delivered to analytics.redowl.io shortly.",
        abortSignal
      )
      writer.write({
        type: "message-metadata",
        messageMetadata: {
          talon: {
            followUps: ["Show table artefact", "Run another workflow"],
          },
        } satisfies TalonMessageMetadata,
      })
      return

    case "clarification-followup":
      await streamText(
        writer,
        "Thanks — I'll use your export preferences and continue once approval is granted. You can approve the pending tool call above.",
        abortSignal
      )
      writer.write({
        type: "message-metadata",
        messageMetadata: {
          talon: {
            followUps: ["Approve export"],
          },
        } satisfies TalonMessageMetadata,
      })
      return

    case "artifact":
      await streamText(
        writer,
        "Here's a **metrics dashboard** and **vendor table** generated from the export workflow:",
        abortSignal
      )

      writer.write({
        type: "source-url",
        sourceId: "src-vendors-db",
        url: "https://data.redowl.io/datasets/vendor-registry",
        title: "RedOwl Data · Vendor registry dataset",
      })

      writer.write({
        type: "message-metadata",
        messageMetadata: {
          talon: {
            artifacts: [
              {
                id: "art-metrics",
                kind: "metrics",
                title: "Active vendors",
                description: "Snapshot before delivery to analytics",
                metric: {
                  id: "m-active",
                  label: "Active vendors",
                  value: "12",
                  change: "+2 vs last week",
                  trend: "up",
                  helperText: "Ready for export to analytics",
                },
              },
              {
                id: "art-vendors",
                kind: "table",
                title: "Active vendor records",
                description: "12 records · exported from workspace context",
                rows: [
                  {
                    id: "v-1",
                    name: "Northwind Traders",
                    status: "active",
                    owner: "Alex Morgan",
                    updatedAt: "2026-03-08",
                  },
                  {
                    id: "v-2",
                    name: "Contoso Supplies",
                    status: "active",
                    owner: "Jamie Lee",
                    updatedAt: "2026-03-07",
                  },
                  {
                    id: "v-3",
                    name: "Fabrikam Logistics",
                    status: "pending",
                    owner: "Sam Patel",
                    updatedAt: "2026-03-06",
                  },
                ],
              },
            ],
            trust: {
              label: "Workspace data · read-only preview",
              sourceVisibility: "internal",
            },
            citations: [
              {
                id: "cite-vendors",
                label: "1",
                title: "Vendor registry",
                type: "Database",
                owner: "Procurement",
                updatedAt: "2026-03-08",
                url: "https://data.redowl.io/datasets/vendor-registry",
                excerpt: "Authoritative vendor records used for export previews.",
              },
            ],
            sources: [
              {
                id: "src-vendors-meta",
                title: "RedOwl Data vendor registry",
                url: "https://data.redowl.io/datasets/vendor-registry",
                provider: "RedOwl Data",
                description: "Third-party dataset backing the table preview.",
              },
            ],
            followUps: ["Run agent workflow", "Open full screen chat"],
          },
        } satisfies TalonMessageMetadata,
      })
      return

    default:
      await streamText(writer, DEFAULT_RESPONSE, abortSignal)
      writer.write({
        type: "message-metadata",
        messageMetadata: {
          talon: {
            followUps: [
              "Run agent workflow",
              "Show metrics dashboard",
              "Explain the master layout pattern",
            ],
          },
        } satisfies TalonMessageMetadata,
      })
  }
}
