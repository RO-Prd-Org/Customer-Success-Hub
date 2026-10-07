import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ArrowLeftIcon } from "lucide-react"

export type PageBreadcrumb = {
  label: string
  onClick?: () => void
}

type PageTopBarProps = {
  breadcrumbs: PageBreadcrumb[]
  onBack?: () => void
  showBack?: boolean
  showSidebarTrigger?: boolean
}

export function PageTopBar({
  breadcrumbs,
  onBack,
  showBack = false,
  showSidebarTrigger = true,
}: PageTopBarProps) {
  const lastIndex = breadcrumbs.length - 1

  return (
    <header className="flex h-12 shrink-0 items-center gap-2">
      <div className="flex items-center gap-2 px-1">
        {showBack && onBack ? (
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Go back"
            onClick={onBack}
          >
            <ArrowLeftIcon />
          </Button>
        ) : null}
        {showSidebarTrigger ? <SidebarTrigger className="-ml-1" /> : null}
        {showSidebarTrigger || (showBack && onBack) ? (
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
        ) : null}
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((crumb, index) => {
              const isLast = index === lastIndex

              return (
                <span key={`${crumb.label}-${index}`} className="contents">
                  {index > 0 ? <BreadcrumbSeparator /> : null}
                  <BreadcrumbItem>
                    {isLast && !crumb.onClick ? (
                      <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink
                        onClick={crumb.onClick}
                        className={
                          crumb.onClick
                            ? "cursor-pointer"
                            : undefined
                        }
                      >
                        {crumb.label}
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </span>
              )
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  )
}
