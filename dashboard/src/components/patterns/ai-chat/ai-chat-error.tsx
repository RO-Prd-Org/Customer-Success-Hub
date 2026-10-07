import { AlertCircleIcon } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

type AiChatErrorProps = {
  message: string
  onRetry?: () => void
  onDismiss?: () => void
}

export function AiChatError({ message, onRetry, onDismiss }: AiChatErrorProps) {
  return (
    <Alert variant="destructive" className="mx-3 mt-3">
      <AlertCircleIcon />
      <AlertTitle>Something went wrong</AlertTitle>
      <AlertDescription className="flex flex-col gap-2">
        <span>{message}</span>
        <div className="flex gap-2">
          {onRetry ? (
            <Button size="sm" variant="outline" onClick={onRetry}>
              Retry
            </Button>
          ) : null}
          {onDismiss ? (
            <Button size="sm" variant="ghost" onClick={onDismiss}>
              Dismiss
            </Button>
          ) : null}
        </div>
      </AlertDescription>
    </Alert>
  )
}
