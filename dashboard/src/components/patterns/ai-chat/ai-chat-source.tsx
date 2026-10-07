import type { UIMessage } from "ai"
import { DatabaseIcon, ExternalLinkIcon, GlobeIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { TalonExternalSource } from "./types"

type AiChatSourceProps = {
  source: TalonExternalSource
}

function getHostname(url: string) {
  try {
    return new URL(url).hostname
  } catch {
    return url
  }
}

export function AiChatSource({ source }: AiChatSourceProps) {
  const hostname = getHostname(source.url)

  return (
    <div className="flex items-start gap-2 rounded-lg border border-border bg-muted/20 px-3 py-2">
      <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md bg-background">
        <GlobeIcon className="size-3.5 text-muted-foreground" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-medium">{source.title}</p>
          {source.provider ? (
            <Badge variant="outline" className="text-[10px]">
              {source.provider}
            </Badge>
          ) : null}
        </div>
        <p className="mt-0.5 truncate text-xs text-muted-foreground">{hostname}</p>
        {source.description ? (
          <p className="mt-1 text-xs text-muted-foreground">{source.description}</p>
        ) : null}
      </div>
      {source.url.startsWith("http") ? (
        <Button
          size="sm"
          variant="outline"
          nativeButton={false}
          render={<a href={source.url} target="_blank" rel="noreferrer" />}
        >
          <ExternalLinkIcon />
          Open
        </Button>
      ) : null}
    </div>
  )
}

type AiChatSourcesListProps = {
  message: UIMessage
  sources?: TalonExternalSource[]
}

function getSourceParts(message: UIMessage): TalonExternalSource[] {
  return message.parts.flatMap((part) => {
    if (part.type === "source-url") {
      return [
        {
          id: part.sourceId,
          title: part.title ?? part.url,
          url: part.url,
        },
      ]
    }

    if (part.type === "source-document") {
      return [
        {
          id: part.sourceId,
          title: part.title,
          url: "#",
          provider: part.mediaType,
          description: part.filename,
        },
      ]
    }

    return []
  })
}

export function AiChatSourcesList({ message, sources = [] }: AiChatSourcesListProps) {
  const partSources = getSourceParts(message)
  const merged = [...sources]

  for (const source of partSources) {
    if (!merged.some((item) => item.id === source.id)) {
      merged.push(source)
    }
  }

  if (merged.length === 0) return null

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5 px-1 text-xs font-medium text-muted-foreground">
        <DatabaseIcon className="size-3.5" />
        <span>Data sources</span>
      </div>
      {merged.map((source) => (
        <AiChatSource key={source.id} source={source} />
      ))}
    </div>
  )
}
