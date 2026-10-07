import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import type { ReviewRow } from "./shared"

export function ReviewDetailContent({ review }: { review: ReviewRow }) {
  return (
    <div className="flex flex-col gap-4 text-sm">
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">Status</span>
        <Badge
          variant={
            review.status === "approved"
              ? "outline"
              : review.status === "rejected"
                ? "destructive"
                : "secondary"
          }
        >
          {review.status}
        </Badge>
      </div>
      <div className="grid gap-3">
        <div>
          <p className="text-xs text-muted-foreground">Request ID</p>
          <p className="font-medium">{review.id}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Requester</p>
          <p>{review.requester}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Submitted</p>
          <p>{review.submittedAt}</p>
        </div>
      </div>
      <Separator />
      <div>
        <p className="text-xs text-muted-foreground">Details</p>
        <p className="mt-1 leading-relaxed">{review.details}</p>
      </div>
    </div>
  )
}
