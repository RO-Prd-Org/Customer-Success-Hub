import * as React from "react"
import { HistoryIcon, PenLineIcon, PinIcon, Trash2Icon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { ConversationRecord } from "./types"

export type AiChatHistoryProps = {
  conversations: ConversationRecord[]
  activeConversationId?: string
  onSelect: (conversation: ConversationRecord) => void
  onRename: (id: string, title: string) => void
  onTogglePin: (id: string) => void
  onDelete: (id: string) => void
}

function AiChatHistoryPanel({
  conversations,
  activeConversationId,
  onSelect,
  onRename,
  onTogglePin,
  onDelete,
  onClose,
}: AiChatHistoryProps & { onClose: () => void }) {
  const [renamingId, setRenamingId] = React.useState<string | null>(null)
  const [renameValue, setRenameValue] = React.useState("")

  const pinned = conversations.filter((conversation) => conversation.pinned)
  const recent = conversations.filter((conversation) => !conversation.pinned)

  return (
    <div className="flex flex-col">
      <div className="border-b px-3 py-2">
        <p className="font-heading text-sm font-medium">Conversations</p>
        <p className="text-xs text-muted-foreground">
          Search, pin, rename, or reopen chats.
        </p>
      </div>

      <Tabs defaultValue="all" className="gap-0">
        <TabsList className="mx-3 mt-2 w-[calc(100%-1.5rem)]">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pinned">Pinned</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-0">
          <Command className="rounded-none border-0">
            <CommandInput placeholder="Search conversations…" />
            <CommandList className="max-h-64">
              <CommandEmpty>No conversations found.</CommandEmpty>
              <CommandGroup heading="Recent">
                {recent.map((conversation) => (
                  <CommandItem
                    key={conversation.id}
                    value={`${conversation.title} ${conversation.preview}`}
                    onSelect={() => {
                      onSelect(conversation)
                      onClose()
                    }}
                    className="flex flex-col items-start gap-1 py-2"
                  >
                    <div className="flex w-full items-center justify-between gap-2">
                      <span className="truncate font-medium">
                        {conversation.id === activeConversationId ? "• " : ""}
                        {conversation.title}
                      </span>
                      <span className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          aria-label="Pin conversation"
                          onClick={(event) => {
                            event.stopPropagation()
                            onTogglePin(conversation.id)
                          }}
                        >
                          <PinIcon />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          aria-label="Rename conversation"
                          onClick={(event) => {
                            event.stopPropagation()
                            setRenamingId(conversation.id)
                            setRenameValue(conversation.title)
                          }}
                        >
                          <PenLineIcon />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          aria-label="Delete conversation"
                          onClick={(event) => {
                            event.stopPropagation()
                            onDelete(conversation.id)
                          }}
                        >
                          <Trash2Icon />
                        </Button>
                      </span>
                    </div>
                    <span className="line-clamp-1 text-xs text-muted-foreground">
                      {conversation.preview}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </TabsContent>

        <TabsContent value="pinned" className="max-h-64 overflow-y-auto px-3 pb-3">
          {pinned.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No pinned conversations yet.
            </p>
          ) : (
            <div className="space-y-2 pt-1">
              {pinned.map((conversation) => (
                <button
                  key={conversation.id}
                  type="button"
                  className="flex w-full flex-col rounded-lg border border-border px-3 py-2 text-left hover:bg-muted/50"
                  onClick={() => {
                    onSelect(conversation)
                    onClose()
                  }}
                >
                  <span className="font-medium">{conversation.title}</span>
                  <span className="text-xs text-muted-foreground">
                    {conversation.preview}
                  </span>
                </button>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {renamingId ? (
        <div className="flex items-center gap-2 border-t px-3 py-2">
          <Input
            value={renameValue}
            onChange={(event) => setRenameValue(event.target.value)}
            aria-label="Conversation title"
            className="h-8"
          />
          <Button
            size="sm"
            onClick={() => {
              if (renamingId && renameValue.trim()) {
                onRename(renamingId, renameValue.trim())
              }
              setRenamingId(null)
            }}
          >
            Save
          </Button>
        </div>
      ) : null}
    </div>
  )
}

export function AiChatHistory({
  conversations,
  activeConversationId,
  onSelect,
  onRename,
  onTogglePin,
  onDelete,
}: AiChatHistoryProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button variant="ghost" size="icon-sm" aria-label="Conversation history">
            <HistoryIcon />
          </Button>
        }
      />
      <PopoverContent
        side="bottom"
        align="end"
        className="w-[min(20rem,calc(100vw-2rem))] overflow-hidden p-0"
      >
        <AiChatHistoryPanel
          conversations={conversations}
          activeConversationId={activeConversationId}
          onSelect={onSelect}
          onRename={onRename}
          onTogglePin={onTogglePin}
          onDelete={onDelete}
          onClose={() => setOpen(false)}
        />
      </PopoverContent>
    </Popover>
  )
}
