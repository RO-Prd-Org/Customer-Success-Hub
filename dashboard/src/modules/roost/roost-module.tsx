"use client"

import { PageTopBar } from "@/components/patterns/page-shell"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useChatEndpointConfig } from "@/hooks/use-chat-endpoint-config"
import { Badge } from "@/components/ui/badge"

export function RoostModule() {
  const { endpointId, setEndpointId, options, effectiveApiUrl } =
    useChatEndpointConfig()

  return (
    <div className="flex flex-col gap-6 pb-8">
      <PageTopBar breadcrumbs={[{ label: "Roost" }, { label: "Settings" }]} />

      <div>
        <h1 className="font-heading text-2xl font-semibold">Roost</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Workspace settings and configuration for RedOwl apps.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>AI chat endpoint</CardTitle>
          <CardDescription>
            Route the right-hand chat panel to a specific agent location or
            region.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="chat-endpoint" className="text-sm font-medium">
              Chat location
            </label>
            <Select
              value={endpointId}
              onValueChange={(value) => {
                if (value) setEndpointId(value)
              }}
            >
              <SelectTrigger id="chat-endpoint" className="w-full max-w-lg">
                <SelectValue placeholder="Select endpoint" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Available locations</SelectLabel>
                  {options.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {options.find((option) => option.id === endpointId)?.description}
            </p>
          </div>

          <div className="rounded-lg border border-border bg-muted/30 p-3">
            <p className="text-xs font-medium text-muted-foreground">
              Active endpoint
            </p>
            <p className="mt-1 break-all font-mono text-sm">{effectiveApiUrl}</p>
            <Badge variant="outline" className="mt-2">
              Applies to chat panel immediately
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
