import { SparklesIcon } from "lucide-react"

import { Progress } from "@/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { useAiChatContext } from "@/hooks/use-ai-chat-context"
import { cn } from "@/lib/utils"

type AiChatFooterSettingsProps = {
  className?: string
}

export function AiChatFooterSettings({ className }: AiChatFooterSettingsProps) {
  const {
    debugMode,
    setDebugMode,
    searchOutsideContext,
    setSearchOutsideContext,
    tokenUsage,
  } = useAiChatContext()

  const usagePercent = Math.round((tokenUsage.used / tokenUsage.limit) * 100)

  return (
    <div
      data-slot="ai-chat-footer-settings"
      className={cn(
        "flex flex-wrap items-center justify-between gap-3 border-t border-sidebar-border px-3 py-2",
        className
      )}
    >
      <div className="flex flex-wrap items-center gap-2">
        <Select defaultValue="mock">
          <SelectTrigger size="sm" className="h-7 w-[8.5rem]">
            <SelectValue placeholder="Model" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="mock">Mock agent</SelectItem>
            <SelectItem value="fast">Fast</SelectItem>
            <SelectItem value="balanced">Balanced</SelectItem>
          </SelectContent>
        </Select>

        <ToggleGroup defaultValue={["assist"]} variant="outline" size="sm">
          <ToggleGroupItem value="assist" aria-label="Assist mode">
            Assist
          </ToggleGroupItem>
          <ToggleGroupItem value="agent" aria-label="Agent mode">
            Agent
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        <label className="flex items-center gap-2">
          <Switch
            checked={searchOutsideContext}
            onCheckedChange={setSearchOutsideContext}
            aria-label="Search outside current context"
          />
          Search outside context
        </label>

        <label className="flex items-center gap-2">
          <Switch
            checked={debugMode}
            onCheckedChange={setDebugMode}
            aria-label="Debug mode"
          />
          <SparklesIcon className="size-3.5" />
          Debug
        </label>

        <div className="flex items-center gap-2">
          <span className="shrink-0 tabular-nums">
            {tokenUsage.used.toLocaleString()} / {Math.round(tokenUsage.limit / 1000)}k
          </span>
          <Progress value={usagePercent} className="h-1.5 w-16" />
        </div>
      </div>
    </div>
  )
}
