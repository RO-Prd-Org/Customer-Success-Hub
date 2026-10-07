"use client"

import type * as React from "react"
import {
  PageTopBar,
  type PageBreadcrumb,
} from "@/components/patterns/page-shell/page-top-bar"

type DrillPageProps = {
  breadcrumbs: PageBreadcrumb[]
  onBack: () => void
  children: React.ReactNode
}

export function DrillPage({ breadcrumbs, onBack, children }: DrillPageProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-6">
      <PageTopBar
        breadcrumbs={breadcrumbs}
        showBack
        onBack={onBack}
      />
      <div className="flex flex-1 flex-col gap-4">{children}</div>
    </div>
  )
}
