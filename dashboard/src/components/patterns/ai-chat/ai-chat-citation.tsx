import { ExternalLinkIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"
import type { TalonCitation } from "./types"

type AiChatCitationMarkerProps = {
  citation: TalonCitation
}

export function AiChatCitationMarker({ citation }: AiChatCitationMarkerProps) {
  return (
    <Popover>
      <PopoverTrigger
        render={
          <button
            type="button"
            className="mx-0.5 inline-flex align-super text-[10px] font-medium text-primary underline-offset-2 hover:underline"
          >
            [{citation.label}]
          </button>
        }
      />
      <PopoverContent className="w-80" align="start">
        <CitationPopoverBody citation={citation} />
      </PopoverContent>
    </Popover>
  )
}

function CitationPopoverBody({ citation }: { citation: TalonCitation }) {
  return (
    <>
      <PopoverHeader>
        <div className="flex items-start justify-between gap-2">
          <PopoverTitle>{citation.title}</PopoverTitle>
          <Badge variant="outline" className="shrink-0 text-[10px]">
            {citation.type}
          </Badge>
        </div>
        <PopoverDescription>
          {citation.owner ? `${citation.owner}` : "Unknown owner"}
          {citation.updatedAt ? ` · ${citation.updatedAt}` : ""}
        </PopoverDescription>
      </PopoverHeader>

      {citation.excerpt ? (
        <p className="text-xs leading-relaxed text-muted-foreground">{citation.excerpt}</p>
      ) : null}

      {citation.url ? (
        <Button
          size="sm"
          variant="outline"
          className="w-full"
          nativeButton={false}
          render={
            <a href={citation.url} target="_blank" rel="noreferrer" />
          }
        >
          <ExternalLinkIcon />
          Open source
        </Button>
      ) : null}
    </>
  )
}

type AiChatCitationsListProps = {
  citations: TalonCitation[]
}

export function AiChatCitationsList({ citations }: AiChatCitationsListProps) {
  if (citations.length === 0) return null

  return (
    <div className="flex flex-wrap items-center gap-1.5 px-1">
      <span className="text-xs text-muted-foreground">Citations</span>
      {citations.map((citation) => (
        <Popover key={citation.id}>
          <PopoverTrigger
            render={
              <Button variant="outline" size="xs" className="h-6 px-2 text-[11px]">
                [{citation.label}] {citation.title}
              </Button>
            }
          />
          <PopoverContent className="w-80" align="start">
            <CitationPopoverBody citation={citation} />
          </PopoverContent>
        </Popover>
      ))}
    </div>
  )
}
