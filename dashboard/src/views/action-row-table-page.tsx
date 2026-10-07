"use client"

import * as React from "react"
import { DrillPage } from "@/components/patterns/drill-down"
import { PageTopBar } from "@/components/patterns/page-shell"
import { TalonDataTable } from "@/components/patterns/data-table"
import { Button } from "@/components/ui/button"
import { ReviewDetailContent } from "@/views/data-table/review-detail-content"
import {
  reviewColumnsDef,
  reviews,
  type ReviewRow,
} from "@/views/data-table/shared"

export function ActionRowTablePage() {
  const [selectedReview, setSelectedReview] = React.useState<ReviewRow | null>(
    null
  )
  const [reviewStates, setReviewStates] = React.useState<
    Record<string, ReviewRow["status"]>
  >({})

  const reviewData = reviews.map((review) => ({
    ...review,
    status: reviewStates[review.id] ?? review.status,
  }))

  const handleBack = () => setSelectedReview(null)

  if (selectedReview) {
    const review =
      reviewData.find((item) => item.id === selectedReview.id) ?? selectedReview

    return (
      <DrillPage
        onBack={handleBack}
        breadcrumbs={[
          { label: "Data table", onClick: handleBack },
          { label: "Action row", onClick: handleBack },
          { label: review.request },
        ]}
      >
        <div>
          <h1 className="font-heading text-2xl font-semibold">
            {review.request}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{review.id}</p>
        </div>
        <ReviewDetailContent review={review} />
      </DrillPage>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <PageTopBar
        breadcrumbs={[
          { label: "Data table" },
          { label: "Action row" },
        ]}
      />

      <div className="flex flex-col gap-3">
        <div>
          <h1 className="font-heading text-2xl font-semibold">Action row</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Triage with row actions. Use View to open the full-page drill-down.
          </p>
        </div>

        <TalonDataTable
          rowVariant="action"
          columns={reviewColumnsDef}
          data={reviewData}
          onRowDrillIn={setSelectedReview}
          renderRowActions={(row) => (
            <>
              <Button
                variant="outline"
                size="sm"
                disabled={row.status !== "pending"}
                onClick={() =>
                  setReviewStates((current) => ({
                    ...current,
                    [row.id]: "approved",
                  }))
                }
              >
                Approve
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={row.status !== "pending"}
                onClick={() =>
                  setReviewStates((current) => ({
                    ...current,
                    [row.id]: "rejected",
                  }))
                }
              >
                Reject
              </Button>
            </>
          )}
        />
      </div>
    </div>
  )
}
