"use client"

import * as React from "react"
import { DrillDrawer } from "@/components/patterns/drill-down"
import { PageTopBar } from "@/components/patterns/page-shell"
import { TalonDataTable } from "@/components/patterns/data-table"
import {
  RecordDetailContent,
} from "@/views/data-table/record-detail-content"
import {
  recordColumnsDef,
  records,
  type RecordRow,
} from "@/views/data-table/shared"

export function ClickableRowTablePage() {
  const [selectedRecord, setSelectedRecord] = React.useState<RecordRow | null>(
    null
  )

  return (
    <div className="flex flex-col gap-6">
      <PageTopBar
        breadcrumbs={[
          { label: "Data table" },
          { label: "Clickable row" },
        ]}
      />

      <div className="flex flex-col gap-3">
        <div>
          <h1 className="font-heading text-2xl font-semibold">
            Clickable row
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Click anywhere on a row to open record detail in a drawer.
          </p>
        </div>

        <TalonDataTable
          rowVariant="clickable"
          columns={recordColumnsDef}
          data={records}
          onRowDrillIn={setSelectedRecord}
        />
      </div>

      <DrillDrawer
        open={selectedRecord !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedRecord(null)
        }}
        title={selectedRecord?.name ?? "Record detail"}
        description={selectedRecord?.id}
      >
        {selectedRecord ? (
          <RecordDetailContent record={selectedRecord} />
        ) : null}
      </DrillDrawer>
    </div>
  )
}
