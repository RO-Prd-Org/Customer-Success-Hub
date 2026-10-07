import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

export function AiChatDemoPage() {
  return (
    <div className="flex flex-col gap-4">
      <header className="flex h-12 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 px-1">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <span className="text-sm text-muted-foreground">Patterns / AI Chat</span>
        </div>
      </header>

      <div className="flex max-w-2xl flex-col gap-4">
        <div>
          <h1 className="font-heading text-2xl font-semibold">AI Chat</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Phases 2 and 3 — agent UX, artefacts, full-screen mode, conversation
            history, and mobile drawer. The assistant panel lives in the master
            layout chatbot slot (desktop) or floating drawer (mobile).
          </p>
        </div>

        <Separator />

        <div className="rounded-lg border border-dashed border-border p-6 text-sm text-muted-foreground">
          <p className="font-medium text-foreground">Demos to try</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>
              <strong>Run agent workflow</strong> — reasoning, plan, tool card,
              approval dialog, clarification questionnaire, citations, trust labels.
            </li>
            <li>
              <strong>Show table artefact</strong> — embedded Talon data table with
              source references.
            </li>
            <li>
              Open <strong>full-screen</strong> from the chat header expand control.
            </li>
            <li>
              Open <strong>conversation history</strong> to search, pin, rename, or
              reload chats.
            </li>
            <li>
              Attach a file from the composer toolbar and toggle debug mode.
            </li>
            <li>
              On mobile widths, use the floating <strong>AI</strong> button to open
              the drawer panel.
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
