import { Separator } from "@/components/ui/separator"
import type { RecordRow } from "./shared"

export function RecordDetailContent({ record }: { record: RecordRow }) {
  return (
    <div className="flex flex-col gap-4 text-sm">
      <div className="grid gap-3">
        <div>
          <p className="text-xs text-muted-foreground">Record ID</p>
          <p className="font-medium">{record.id}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Owner</p>
          <p>{record.owner}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Last updated</p>
          <p>{record.updatedAt}</p>
        </div>
      </div>
      <Separator />
      <div>
        <p className="text-xs text-muted-foreground">Description</p>
        <p className="mt-1 leading-relaxed">{record.description}</p>
      </div>
    </div>
  )
}
