import { Badge } from "@/components/ui/badge"
import type { FileProcessingStatus } from "../types"

const STATUS_LABEL: Record<FileProcessingStatus, string> = {
  uploading: "Uploading",
  processing: "Processing",
  indexed: "Indexed",
}

export function FileStatusBadge({
  status,
}: {
  status: FileProcessingStatus
}) {
  const variant =
    status === "indexed"
      ? "secondary"
      : status === "processing"
        ? "outline"
        : "outline"

  return (
    <Badge variant={variant} className={status === "uploading" ? "border-brand text-brand" : undefined}>
      {STATUS_LABEL[status]}
    </Badge>
  )
}
