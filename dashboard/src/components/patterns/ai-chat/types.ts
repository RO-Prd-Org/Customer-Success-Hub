import type { UseChatHelpers } from "@ai-sdk/react"
import type { ChatTransport, UIMessage } from "ai"

export type MessageRole = "user" | "assistant" | "system"

export type ToolCallState =
  | "pending"
  | "running"
  | "success"
  | "failed"
  | "cancelled"
  | "approval-required"

export type PlanStepState =
  | "pending"
  | "active"
  | "complete"
  | "skipped"
  | "blocked"
  | "failed"

export type ContextChip = {
  id: string
  label: string
  kind: "page" | "file" | "database" | "project" | "selection"
  removable?: boolean
}

export type TalonCitation = {
  id: string
  label: string
  title: string
  type: string
  owner?: string
  updatedAt?: string
  url?: string
  excerpt?: string
}

export type TalonExternalSource = {
  id: string
  title: string
  url: string
  provider?: string
  description?: string
}

export type TalonMetric = {
  id: string
  label: string
  value: string
  change?: string
  trend?: "up" | "down" | "neutral"
  helperText?: string
}

export type TalonClarificationChoice = {
  id: string
  label: string
  description?: string
}

export type TalonClarificationItem = {
  id: string
  type: "single" | "multiple" | "text"
  title: string
  description?: string
  choices?: TalonClarificationChoice[]
  placeholder?: string
}

export type TalonClarification = {
  id: string
  title: string
  description?: string
  items: TalonClarificationItem[]
  submitted?: boolean
  answers?: Record<string, string | string[]>
}

export type TalonPlanStep = {
  id: string
  label: string
  state: PlanStepState
  durationMs?: number
}

export type TalonReasoning = {
  summary: string
  details?: string
  confidence?: "high" | "medium" | "low"
  objective?: string
}

export type TalonArtifactTableRow = {
  id: string
  name: string
  status: string
  owner: string
  updatedAt: string
}

export type TalonArtifact =
  | {
      id: string
      kind: "metrics"
      title: string
      description?: string
      metric: TalonMetric
    }
  | {
      id: string
      kind: "table"
      title: string
      description?: string
      rows: TalonArtifactTableRow[]
    }
  | {
      id: string
      kind: "chart"
      title: string
      description?: string
      chartType: "bar" | "line"
      data: Array<{ label: string; value: number }>
    }
  | {
      id: string
      kind: "file"
      title: string
      description?: string
      filename: string
      sizeLabel: string
      mediaType: string
    }
  | {
      id: string
      kind: "document"
      title: string
      description?: string
      preview: string
    }

export type TalonTrustLabel = {
  label: string
  externalShare?: boolean
  sourceVisibility?: "internal" | "external" | "restricted"
}

export type TalonMessageExtensions = {
  reasoning?: TalonReasoning
  plan?: { steps: TalonPlanStep[] }
  clarification?: TalonClarification
  artifact?: TalonArtifact
  artifacts?: TalonArtifact[]
  citations?: TalonCitation[]
  sources?: TalonExternalSource[]
  trust?: TalonTrustLabel
  followUps?: string[]
}

export type TalonMessageMetadata = {
  talon?: TalonMessageExtensions
  clarificationResponse?: boolean
}

export type TalonUserMetadata = {
  clarificationResponse?: boolean
  clarificationAnswers?: Record<string, string | string[]>
}

export type ConversationRecord = {
  id: string
  title: string
  pinned: boolean
  updatedAt: string
  preview: string
  messages: UIMessage[]
}

export type PanelState = {
  width: number
  collapsed: boolean
  fullscreen: boolean
}

export type ComposerAttachment = {
  id: string
  name: string
  sizeLabel: string
  mediaType: string
  state: "idle" | "uploading" | "processing" | "error" | "done"
  progress?: number
}

export type AiChatPanelProps = {
  className?: string
  title?: string
  subtitle?: string
  suggestions?: string[]
  draftStorageKey?: string
  width?: number
  onWidthChange?: (width: number) => void
  transport?: ChatTransport<UIMessage>
  chat?: UseChatHelpers<UIMessage>
  variant?: "panel" | "dialog" | "drawer"
}

export function getMessageText(message: UIMessage): string {
  return message.parts
    .filter((part): part is { type: "text"; text: string } => part.type === "text")
    .map((part) => part.text)
    .join("")
}

export function getMessageMetadata(message: UIMessage): TalonMessageMetadata | undefined {
  return message.metadata as TalonMessageMetadata | undefined
}

export function getTalonExtensions(message: UIMessage): TalonMessageExtensions | undefined {
  return getMessageMetadata(message)?.talon
}

export function getMessageReasoningText(message: UIMessage): string {
  return message.parts
    .filter(
      (part): part is { type: "reasoning"; text: string } => part.type === "reasoning"
    )
    .map((part) => part.text)
    .join("")
}

export function isReasoningStreaming(message: UIMessage): boolean {
  return message.parts.some(
    (part) => part.type === "reasoning" && part.state === "streaming"
  )
}

export function getMessageArtifacts(message: UIMessage): TalonArtifact[] {
  const talon = getTalonExtensions(message)
  if (!talon) return []

  if (talon.artifacts?.length) return talon.artifacts
  return talon.artifact ? [talon.artifact] : []
}
