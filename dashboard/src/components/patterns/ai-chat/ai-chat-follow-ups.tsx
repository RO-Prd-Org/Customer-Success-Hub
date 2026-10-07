import { Button } from "@/components/ui/button"

type AiChatFollowUpsProps = {
  suggestions: string[]
  onSelect: (suggestion: string) => void
}

export function AiChatFollowUps({ suggestions, onSelect }: AiChatFollowUpsProps) {
  if (suggestions.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2 px-1">
      {suggestions.map((suggestion) => (
        <Button
          key={suggestion}
          variant="outline"
          size="sm"
          className="h-auto whitespace-normal px-2.5 py-1.5 text-left text-xs font-normal"
          onClick={() => onSelect(suggestion)}
        >
          {suggestion}
        </Button>
      ))}
    </div>
  )
}
