# Talon UI Kit — Reference

## UI primitives (`@/components/ui`)

accordion, alert, alert-dialog, attachment, avatar, badge, breadcrumb, bubble, button, button-group, card, chart, checkbox, collapsible, command, dialog, drawer, dropdown-menu, empty, hover-card, input, input-group, kbd, marker, message, message-scroller, pagination, popover, progress, questionnaire, resizable, scroll-area, select, separator, sheet, sidebar, skeleton, sonner, spinner, switch, table, tabs, textarea, toggle, toggle-group, tooltip

## Patterns (`@/components/patterns`)

| Module | Key exports |
|--------|-------------|
| master-layout | MasterLayout, slots (Sidebar, Main, Chatbot), CollapsiblePanel |
| sidebar | SidebarBrand, SidebarAppSwitcher, SidebarNavTabs, SidebarUserMenu |
| data-table | TalonDataTable, dataTableFeatures |
| page-shell | PageTopBar |
| drill-down | DrillDrawer, DrillPage |
| ai-chat | AiChatPanel, AiChatComposer, AiChatConversation, AiChatToolCall, AiChatApproval, AiChatPlan, AiChatArtifact, … |

## Chart attention pattern (Recharts)

Neutral series + brand only where attention is needed:

```tsx
// Line — dots below target
dot={(props) => {
  const { cx, cy, payload } = props
  if (cx == null || cy == null || !payload) return null
  const attention = payload.revenue < payload.target
  return (
    <circle
      cx={cx} cy={cy} r={attention ? 5 : 3}
      fill={attention ? "var(--brand)" : "var(--color-revenue)"}
    />
  )
}}

// Bar — per-bar Cell
{data.map((entry) => (
  <Cell
    key={entry.id}
    fill={entry.needsAttention ? "var(--brand)" : "var(--color-value)"}
  />
))}
```

## Token → Tailwind mapping

| CSS var | Tailwind |
|---------|----------|
| `--brand` | `bg-brand`, `text-brand`, `border-brand` |
| `--foreground` | `text-foreground`, `bg-foreground/10` |
| `--background` | `bg-background`, `dark:bg-background/60` |
| `--muted` | `bg-muted` |
| `--chart-1` … `--chart-5` | `var(--chart-N)` in chart config |

## Deploying the kit to another repo

1. Copy `talon-kit/` folder (or add as git submodule)
2. Copy `.cursor/skills/talon-ui-kit/` or symlink `talon-kit/skill/` → `.cursor/skills/talon-ui-kit/`
3. Copy `talon/src/components/ui` and `talon/src/components/patterns` (or consume as package when published)
4. Copy `talon/src/index.css` tokens
5. Run `cd talon-kit && npm install && npm run audit -- --root ..`
