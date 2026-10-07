import * as React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { UseChatHelpers } from "@ai-sdk/react"
import type { UIMessage } from "ai"
import { useAiChatContext } from "@/hooks/use-ai-chat-context"
import { cn } from "@/lib/utils"

import type { TalonClarification, TalonClarificationItem } from "./types"

type AiChatClarificationProps = {
  clarification: TalonClarification
  chat: UseChatHelpers<UIMessage>
}

function ChoiceOption({
  name,
  value,
  type,
  checked,
  onChange,
  children,
}: {
  name: string
  value: string
  type: "single" | "multiple"
  checked: boolean
  onChange: (checked: boolean) => void
  children: React.ReactNode
}) {
  return (
    <label
      className={cn(
        "relative flex min-h-11 cursor-pointer items-start gap-2.5 rounded-lg border border-input px-3 py-2.5 text-sm transition-colors hover:bg-muted/50",
        checked && "border-primary/40 bg-muted"
      )}
    >
      <input
        type={type === "multiple" ? "checkbox" : "radio"}
        name={name}
        value={value}
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-1 size-4 shrink-0 accent-primary"
      />
      <span className="min-w-0 flex-1">{children}</span>
    </label>
  )
}

function ClarificationStep({
  item,
  answers,
  onAnswerChange,
}: {
  item: TalonClarificationItem
  answers: Record<string, string | string[]>
  onAnswerChange: (itemId: string, value: string | string[]) => void
}) {
  if (item.type === "text") {
    return (
      <Input
        value={typeof answers[item.id] === "string" ? answers[item.id] : ""}
        placeholder={item.placeholder ?? "Type your answer"}
        onChange={(event) => onAnswerChange(item.id, event.target.value)}
      />
    )
  }

  return (
    <div className="grid gap-2">
      {item.choices?.map((choice) => {
        const current = answers[item.id]

        if (item.type === "multiple") {
          const selected = Array.isArray(current) ? current : []
          const checked = selected.includes(choice.id)

          return (
            <ChoiceOption
              key={choice.id}
              name={item.id}
              value={choice.id}
              type="multiple"
              checked={checked}
              onChange={(nextChecked) => {
                const next = nextChecked
                  ? [...selected, choice.id]
                  : selected.filter((value) => value !== choice.id)
                onAnswerChange(item.id, next)
              }}
            >
              <span className="font-medium">{choice.label}</span>
              {choice.description ? (
                <span className="mt-0.5 block text-xs text-muted-foreground">
                  {choice.description}
                </span>
              ) : null}
            </ChoiceOption>
          )
        }

        return (
          <ChoiceOption
            key={choice.id}
            name={item.id}
            value={choice.id}
            type="single"
            checked={current === choice.id}
            onChange={() => onAnswerChange(item.id, choice.id)}
          >
            <span className="font-medium">{choice.label}</span>
            {choice.description ? (
              <span className="mt-0.5 block text-xs text-muted-foreground">
                {choice.description}
              </span>
            ) : null}
          </ChoiceOption>
        )
      })}
    </div>
  )
}

function isStepComplete(
  item: TalonClarificationItem,
  answers: Record<string, string | string[]>
) {
  const value = answers[item.id]

  if (item.type === "text") {
    return typeof value === "string" && value.trim().length > 0
  }

  if (item.type === "multiple") {
    return Array.isArray(value) && value.length > 0
  }

  return typeof value === "string" && value.length > 0
}

export function AiChatClarification({
  clarification,
  chat,
}: AiChatClarificationProps) {
  const { submitClarification } = useAiChatContext()
  const [stepIndex, setStepIndex] = React.useState(0)
  const [answers, setAnswers] = React.useState<Record<string, string | string[]>>(
    {}
  )
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const items = clarification.items
  const currentItem = items[stepIndex]
  const isFirst = stepIndex === 0
  const isLast = stepIndex === items.length - 1
  const stepComplete = currentItem ? isStepComplete(currentItem, answers) : false

  const handleAnswerChange = React.useCallback(
    (itemId: string, value: string | string[]) => {
      setAnswers((current) => ({ ...current, [itemId]: value }))
    },
    []
  )

  const handleSubmit = React.useCallback(async () => {
    if (!stepComplete || isSubmitting) return

    setIsSubmitting(true)
    try {
      await submitClarification(chat, clarification, answers)
    } finally {
      setIsSubmitting(false)
    }
  }, [answers, chat, clarification, isSubmitting, stepComplete, submitClarification])

  if (clarification.submitted) {
    return (
      <div className="rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm">
        <p className="font-medium">Clarification submitted</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Your preferences were added to the thread.
        </p>
      </div>
    )
  }

  if (!currentItem) return null

  return (
    <div className="rounded-lg border border-border bg-card p-3">
      <div className="mb-3 flex items-start justify-between gap-2">
        <div>
          <p className="font-heading text-sm font-medium">{clarification.title}</p>
          {clarification.description ? (
            <p className="mt-1 text-xs text-muted-foreground">
              {clarification.description}
            </p>
          ) : null}
        </div>
        {items.length > 1 ? (
          <span className="shrink-0 text-xs text-muted-foreground tabular-nums">
            {stepIndex + 1} / {items.length}
          </span>
        ) : null}
      </div>

      <div className="space-y-3">
        <div>
          <p className="text-sm font-medium">{currentItem.title}</p>
          {currentItem.description ? (
            <p className="mt-1 text-xs text-muted-foreground">
              {currentItem.description}
            </p>
          ) : null}
        </div>

        <ClarificationStep
          item={currentItem}
          answers={answers}
          onAnswerChange={handleAnswerChange}
        />

        <div className="flex items-center justify-between gap-2 pt-1">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isFirst}
            onClick={() => setStepIndex((index) => Math.max(0, index - 1))}
          >
            Previous
          </Button>

          {isLast ? (
            <Button
              type="button"
              size="sm"
              disabled={!stepComplete || isSubmitting}
              onClick={() => {
                void handleSubmit()
              }}
            >
              Submit
            </Button>
          ) : (
            <Button
              type="button"
              size="sm"
              disabled={!stepComplete}
              onClick={() =>
                setStepIndex((index) => Math.min(items.length - 1, index + 1))
              }
            >
              Next
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
