import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  PanelLeftCloseIcon,
  PanelLeftOpenIcon,
  PanelRightCloseIcon,
  PanelRightOpenIcon,
} from "lucide-react"

const REDOWL_LOGO_SQUARE = "/Mascot_RedBG_Small.png"
/** Inset from viewport edge when collapsed — matches Tailwind `3` (0.75rem). */
const LOGO_TOGGLE_VIEWPORT_INSET = "0.75rem"
/** Gap between panel edge and toggle when open — clears scrollbar + glow. */
const LOGO_TOGGLE_PANEL_GAP = "1.5rem"

type CollapsiblePanelProps = {
  side: "left" | "right"
  open: boolean
  onToggle: () => void
  label: string
  width?: string
  children: React.ReactNode
  className?: string
  /** Use the RedOwl square mascot as the panel toggle instead of a chevron icon. */
  toggleVariant?: "icon" | "logo"
}

export function CollapsiblePanel({
  side,
  open,
  onToggle,
  label,
  width = "16rem",
  children,
  className,
  toggleVariant = "icon",
}: CollapsiblePanelProps) {
  const ToggleIcon =
    side === "left"
      ? open
        ? PanelLeftCloseIcon
        : PanelLeftOpenIcon
      : open
        ? PanelRightCloseIcon
        : PanelRightOpenIcon

  const toggleLabel = open ? `Collapse ${label}` : `Expand ${label}`
  const useLogoToggle = toggleVariant === "logo"

  return (
    <div
      data-slot="master-layout-panel"
      data-side={side}
      data-state={open ? "expanded" : "collapsed"}
      style={
        {
          "--panel-width": width,
          "--logo-toggle-viewport-inset": LOGO_TOGGLE_VIEWPORT_INSET,
          "--logo-toggle-panel-gap": LOGO_TOGGLE_PANEL_GAP,
          width: open ? width : 0,
        } as React.CSSProperties
      }
      className={cn(
        "relative shrink-0 overflow-visible transition-[width] duration-200 ease-linear",
        className
      )}
    >
      <div
        className={cn(
          "flex h-full flex-col border-border bg-sidebar text-sidebar-foreground transition-opacity duration-200",
          side === "left" ? "border-r" : "border-l",
          open ? "w-(--panel-width) opacity-100" : "w-(--panel-width) overflow-hidden opacity-0"
        )}
      >
        {children}
      </div>

      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              variant={useLogoToggle ? "ghost" : "outline"}
              size={useLogoToggle ? "icon" : "icon-sm"}
              aria-label={toggleLabel}
              aria-expanded={open}
              onClick={onToggle}
              className={cn(
                "absolute top-3 z-10",
                useLogoToggle
                  ? cn(
                      "size-10 overflow-hidden rounded-lg border-0 bg-transparent p-0 shadow-none transition-transform duration-200 ease-linear hover:bg-transparent active:translate-y-0",
                      open &&
                        "shadow-[0_0_0_1px_rgba(255,0,0,0.12),0_0_10px_2px_rgba(255,0,0,0.28)]",
                      side === "right"
                        ? open
                          ? "right-auto left-0 -translate-x-[calc(100%+var(--logo-toggle-panel-gap))]"
                          : "right-[var(--logo-toggle-viewport-inset)] left-auto translate-x-0"
                        : open
                          ? "right-0 translate-x-[calc(100%+var(--logo-toggle-panel-gap))]"
                          : "left-[var(--logo-toggle-viewport-inset)] right-auto translate-x-0"
                    )
                  : cn(
                      "bg-background shadow-sm",
                      side === "left"
                        ? open
                          ? "-right-3"
                          : "left-0"
                        : open
                          ? "-left-3"
                          : "right-0"
                    )
              )}
            />
          }
        >
          {useLogoToggle ? (
            <img
              src={REDOWL_LOGO_SQUARE}
              alt=""
              className="size-10 rounded-lg object-cover"
            />
          ) : (
            <ToggleIcon />
          )}
        </TooltipTrigger>
        <TooltipContent side={side === "left" ? "right" : "left"}>
          {toggleLabel}
        </TooltipContent>
      </Tooltip>
    </div>
  )
}
