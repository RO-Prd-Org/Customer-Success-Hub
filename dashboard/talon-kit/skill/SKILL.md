---
name: talon-ui-kit
description: >-
  Scaffold and maintain RedOwl Talon UI — master layout, patterns, shadcn
  primitives, brand colors, and semantic component rules. Use when building
  RedOwl apps, adding pages, auditing UI consistency, or onboarding to the
  Talon design system. Read talon-ui-kit.yaml before scaffolding.
---

# Talon UI Kit

RedOwl's deployable UI kit: React + Vite + Tailwind v4 + shadcn (base-nova) + `@base-ui/react`.

**Source of truth:** `talon-kit/talon-ui-kit.yaml` (declarative structure, tokens, audit rules).

**Reference implementation:** `talon/src/` in the prj-talon repo.

## Before you scaffold

1. Read `talon-kit/talon-ui-kit.yaml` — especially `design_tokens`, `layouts`, `semantic_rules`.
2. Run the audit against the target project:
   ```bash
   cd talon-kit && npm install && npm run audit -- --root /path/to/project
   ```
3. Match existing import aliases (`@/components/ui`, `@/components/patterns`).

## App shell (required for full Talon apps)

Use the **master pattern** — three columns: sidebar · app · chatbot.

```tsx
import { MasterLayout } from "@/components/patterns/master-layout"
import { AiChatPanel } from "@/components/patterns/ai-chat"
import { SidebarBrand, SidebarNavTabs, SidebarUserMenu } from "@/components/patterns/sidebar"

<MasterLayout defaultChatbotOpen={false}>
  <MasterLayout.Sidebar>
    <SidebarHeader><SidebarBrand /></SidebarHeader>
    <SidebarContent>{/* SidebarNavTabs, groups */}</SidebarContent>
    <SidebarFooter><SidebarUserMenu user={...} /></SidebarFooter>
  </MasterLayout.Sidebar>
  <MasterLayout.Main>{/* page */}</MasterLayout.Main>
  <MasterLayout.Chatbot>
    <AiChatPanel ... />
  </MasterLayout.Chatbot>
</MasterLayout>
```

Defaults: sidebar 16rem, chatbot 20rem, both independently collapsible.

## Page scaffolding checklist

| Step | Component | Import |
|------|-----------|--------|
| Breadcrumbs + title bar | `PageTopBar` | `@/components/patterns/page-shell` |
| KPI row | `Card` + `AiChatMetricDisplay` | ui/card, ai-chat |
| Data listing | `TalonDataTable` | `@/components/patterns/data-table` |
| Row drill-down | `DrillDrawer` or `DrillPage` | `@/components/patterns/drill-down` |
| Charts | `ChartContainer` + Recharts | `@/components/ui/chart` |
| Primary action | `Button` default variant | `@/components/ui/button` |

## Color & token rules (non-negotiable)

| Token | Value | Usage |
|-------|-------|-------|
| `--brand` | `#ff0000` | CTAs, sidebar icons, progress fill, chart **attention** points only |
| `--brand-foreground` | `#ffffff` | Text on brand backgrounds |
| Brand dark | `#232b22` | Light-mode text/darks; dark-mode card/sidebar/popover |
| Darkest dark | `#161c16` | **Dark-mode background only** — never in light mode |

### Do

- Use semantic classes: `bg-background`, `text-foreground`, `bg-brand`, `bg-muted`, `border-border`
- Set tokens in `index.css` `:root` and `.dark` — not scattered hex in TSX
- Modal overlays: `bg-foreground/10 dark:bg-background/60`
- Chart neutrals: `var(--chart-1)` … `var(--chart-5)` (green-gray scale)
- Chart attention: `var(--brand)` on **specific** Cell/dot/bar only
- Progress: `ProgressIndicator` defaults to `bg-brand`

### Do not

- `#000`, `bg-black`, `text-black`, `bg-black/10`
- Tailwind hue utilities: `amber-*`, `yellow-*`, `orange-*`, `blue-*`, etc. for surfaces
- `bg-primary` for primary CTAs (use `Button` default = brand)
- Brand red for entire chart series or decorative accents
- `#161c16` outside dark-mode `--background` in CSS

## Component semantic rules

### Button

```tsx
<Button>Save</Button>                    // primary CTA — brand
<Button variant="outline">Cancel</Button>
<Button variant="ghost">Dismiss</Button>
<Button variant="destructive">Delete</Button>
<Button variant="link">Learn more</Button>
```

- Page-level actions: **size default** (`h-9 px-3.5`)
- Dense toolbars / table rows: `size="sm"` or `size="xs"`

### Sidebar

- `SidebarBrand` — logo from `public/` (wide + collapsed mascot; white logo in dark mode)
- Nav menu first icon: brand color (built into `sidebar.tsx`)
- App switcher chip: brand accent

### AI chat approval / tool cards

- Approval container: `border-border bg-muted` — **no** amber/yellow warning backgrounds
- Approve CTA: `Button` default (brand)

### Data table

```tsx
<TalonDataTable
  columns={columns}
  data={rows}
  rowVariant="clickable"   // or "action"
  onRowDrillIn={...}
/>
```

## New page template

```tsx
export function ExamplePage() {
  return (
    <div className="flex flex-col gap-6 pb-8">
      <PageTopBar breadcrumbs={[{ label: "Workspace" }, { label: "Example" }]} />
      <div>
        <h1 className="font-heading text-2xl font-semibold">Page title</h1>
        <p className="mt-1 text-sm text-muted-foreground">Description</p>
      </div>
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {/* KPI cards */}
      </section>
      {/* content */}
    </div>
  )
}
```

## CSS setup (new project)

Copy token block from `talon/src/index.css` into the project's global CSS. Required vars:

`--brand`, `--brand-foreground`, `--foreground`, `--background`, `--primary`, `--muted`, `--border`, `--chart-1` … `--chart-5`, sidebar tokens.

Fonts: Inter Variable (body), IBM Plex Sans Variable (headings).

## Audit & CI

```bash
# From talon-kit directory
npm install
node scripts/audit-ui.mjs --root /path/to/app --fail-on error

# JSON output for CI
node scripts/audit-ui.mjs --root /path/to/app --format json --fail-on warn
```

Copy `talon-kit/` into any repo or install as a submodule. Point `--kit` at a customized YAML if forked.

## When design rules change

1. Update `talon-ui-kit.yaml` (bump `kit.version`)
2. Update `talon/src/index.css` reference implementation
3. Re-run audit on all consuming apps
4. Update this skill if scaffolding steps change

## Additional reference

See `talon-kit/skill/reference.md` for full component inventory and chart attention examples.
