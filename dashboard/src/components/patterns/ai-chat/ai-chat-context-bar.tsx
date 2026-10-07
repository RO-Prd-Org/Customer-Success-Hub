import * as React from "react"
import {
  ChevronDownIcon,
  ChevronUpIcon,
  FileIcon,
  PlusIcon,
  XIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { ContextChip } from "@/components/patterns/ai-chat/types"
import { useAiChatContext } from "@/hooks/use-ai-chat-context"
import { cn } from "@/lib/utils"

const MORE_BADGE_WIDTH = 76
const ADD_BUTTON_WIDTH = 56
const EXPAND_BUTTON_WIDTH = 28

type AiChatContextBarProps = {
  className?: string
}

function ContextChipBadge({
  chip,
  onRemove,
}: {
  chip: ContextChip
  onRemove: (id: string) => void
}) {
  return (
    <Badge
      data-badge
      variant="secondary"
      className="h-6 max-w-36 shrink-0 gap-1 pr-1"
    >
      {chip.kind === "file" ? (
        <FileIcon className="size-3 shrink-0" aria-hidden="true" />
      ) : null}
      <span className="truncate">{chip.label}</span>
      {chip.removable ? (
        <button
          type="button"
          aria-label={`Remove ${chip.label}`}
          className="rounded-sm p-0.5 hover:bg-background/60"
          onClick={() => onRemove(chip.id)}
        >
          <XIcon className="size-3" />
        </button>
      ) : null}
    </Badge>
  )
}

function countVisibleBadges(widths: number[], availableWidth: number) {
  if (widths.length === 0) return 0

  let used = 0
  let count = 0

  for (let index = 0; index < widths.length; index += 1) {
    const width = widths[index] + 6
    const remaining = widths.length - (index + 1)
    const reserve = remaining > 0 ? MORE_BADGE_WIDTH : 0

    if (count === 0 || used + width + reserve <= availableWidth) {
      used += width
      count += 1
    } else {
      break
    }
  }

  return count
}

export function AiChatContextBar({ className }: AiChatContextBarProps) {
  const { contextChips, removeContextChip, addContextChip } = useAiChatContext()
  const [expanded, setExpanded] = React.useState(false)
  const [visibleCount, setVisibleCount] = React.useState(contextChips.length)
  const rowRef = React.useRef<HTMLDivElement>(null)
  const measureRef = React.useRef<HTMLDivElement>(null)
  const expandedRef = React.useRef(expanded)

  expandedRef.current = expanded

  const remeasure = React.useCallback(() => {
    if (expandedRef.current) return

    const row = rowRef.current
    const measure = measureRef.current
    if (!row || !measure) return

    const badges = measure.querySelectorAll("[data-badge]")
    const widths = Array.from(badges).map(
      (badge) => badge.getBoundingClientRect().width
    )

    const expandReserve =
      contextChips.length > 1 ? EXPAND_BUTTON_WIDTH : 0
    const availableWidth =
      row.clientWidth - ADD_BUTTON_WIDTH - expandReserve - 12

    const nextCount = countVisibleBadges(widths, availableWidth)
    setVisibleCount((current) => (current === nextCount ? current : nextCount))
  }, [contextChips])

  React.useLayoutEffect(() => {
    if (expanded) return
    remeasure()
  }, [contextChips, expanded, remeasure])

  React.useEffect(() => {
    const row = rowRef.current
    if (!row) return

    const observer = new ResizeObserver(() => {
      if (expandedRef.current) return
      remeasure()
    })

    observer.observe(row)
    return () => observer.disconnect()
  }, [remeasure])

  const hiddenCount = Math.max(0, contextChips.length - visibleCount)
  const hasOverflow = hiddenCount > 0
  const visibleChips = expanded
    ? contextChips
    : contextChips.slice(0, visibleCount)

  const handleToggleExpanded = () => {
    setExpanded((current) => {
      const next = !current
      if (!next) {
        requestAnimationFrame(() => {
          remeasure()
        })
      }
      return next
    })
  }

  return (
    <div
      data-slot="ai-chat-footer-context"
      className={cn("px-3 py-2", className)}
    >
      <div ref={rowRef} className="flex min-w-0 items-center gap-1.5">
        {contextChips.length > 1 ? (
          hasOverflow || expanded ? (
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              className="size-6 shrink-0"
              aria-label={expanded ? "Collapse context" : "Expand context"}
              aria-expanded={expanded}
              onClick={handleToggleExpanded}
            >
              {expanded ? <ChevronDownIcon /> : <ChevronUpIcon />}
            </Button>
          ) : (
            <span className="size-6 shrink-0" aria-hidden="true" />
          )
        ) : null}

        <div
          className={cn(
            "flex min-w-0 flex-1 items-center gap-1.5",
            expanded ? "flex-wrap" : "overflow-hidden"
          )}
        >
          {contextChips.length === 0 ? (
            <span className="truncate text-xs text-muted-foreground">
              No page context selected
            </span>
          ) : (
            <>
              {visibleChips.map((chip) => (
                <ContextChipBadge
                  key={chip.id}
                  chip={chip}
                  onRemove={removeContextChip}
                />
              ))}

              {!expanded && hasOverflow ? (
                <Badge
                  variant="outline"
                  className="h-6 shrink-0 cursor-pointer whitespace-nowrap"
                  onClick={() => setExpanded(true)}
                >
                  +{hiddenCount} more
                </Badge>
              ) : null}
            </>
          )}
        </div>

        <Button
          variant="outline"
          size="xs"
          className="h-6 shrink-0 gap-1 px-2"
          onClick={() =>
            addContextChip({
              id: `selection-${Date.now()}`,
              label: "Selected text",
              kind: "selection",
              removable: true,
            })
          }
        >
          <PlusIcon className="size-3" />
          Add
        </Button>
      </div>

      <div
        ref={measureRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 -left-[9999px] flex gap-1.5 opacity-0"
      >
        {contextChips.map((chip) => (
          <ContextChipBadge key={chip.id} chip={chip} onRemove={() => undefined} />
        ))}
      </div>
    </div>
  )
}
