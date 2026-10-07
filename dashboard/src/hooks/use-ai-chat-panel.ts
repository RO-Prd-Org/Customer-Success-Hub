import * as React from "react"

const DEFAULT_WIDTH = 320
const MIN_WIDTH = 280
const MAX_WIDTH = 560
const STORAGE_KEY = "redowl-ai-chat-panel"

type StoredPanelState = {
  width: number
}

function clampWidth(width: number) {
  return Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, width))
}

function readStoredState(storageKey: string): StoredPanelState {
  if (typeof window === "undefined") {
    return { width: DEFAULT_WIDTH }
  }

  try {
    const raw = localStorage.getItem(storageKey)
    if (!raw) return { width: DEFAULT_WIDTH }

    const parsed = JSON.parse(raw) as Partial<StoredPanelState>
    if (typeof parsed.width !== "number") {
      return { width: DEFAULT_WIDTH }
    }

    return { width: clampWidth(parsed.width) }
  } catch {
    return { width: DEFAULT_WIDTH }
  }
}

export function useAiChatPanel(storageKey = STORAGE_KEY) {
  const [width, setWidthState] = React.useState(() =>
    readStoredState(storageKey).width
  )

  const setWidth = React.useCallback(
    (nextWidth: number) => {
      const clamped = clampWidth(nextWidth)
      setWidthState(clamped)

      try {
        localStorage.setItem(
          storageKey,
          JSON.stringify({ width: clamped } satisfies StoredPanelState)
        )
      } catch {
        // Ignore quota errors in demo mode.
      }
    },
    [storageKey]
  )

  const chatbotWidth = `${width}px`

  return {
    width,
    setWidth,
    chatbotWidth,
    minWidth: MIN_WIDTH,
    maxWidth: MAX_WIDTH,
  }
}
