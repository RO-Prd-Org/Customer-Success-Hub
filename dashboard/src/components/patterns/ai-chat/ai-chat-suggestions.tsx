import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { SparklesIcon } from "lucide-react"

type AiChatSuggestionsProps = {
  suggestions: string[]
  onSelect: (suggestion: string) => void
}

export function AiChatSuggestions({
  suggestions,
  onSelect,
}: AiChatSuggestionsProps) {
  return (
    <Empty className="border-none bg-transparent p-4">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <SparklesIcon />
        </EmptyMedia>
        <EmptyTitle className="font-heading text-base">
          How can I help?
        </EmptyTitle>
        <EmptyDescription>
          Try an agent workflow with tool approval and clarification, or ask
          for a table artefact preview.
        </EmptyDescription>
      </EmptyHeader>

      <div className="flex w-full max-w-sm flex-col gap-2">
        {suggestions.map((suggestion) => (
          <Button
            key={suggestion}
            variant="outline"
            className="h-auto justify-start whitespace-normal px-3 py-2 text-left text-sm font-normal"
            onClick={() => onSelect(suggestion)}
          >
            {suggestion}
          </Button>
        ))}
      </div>
    </Empty>
  )
}
