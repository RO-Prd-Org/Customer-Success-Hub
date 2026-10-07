import { AlertTriangleIcon, ShieldIcon } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import type { TalonTrustLabel } from "./types"

type AiChatTrustLabelProps = {
  trust: TalonTrustLabel
}

export function AiChatTrustLabel({ trust }: AiChatTrustLabelProps) {
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="outline" className="gap-1">
          <ShieldIcon className="size-3" />
          {trust.label}
        </Badge>
        {trust.sourceVisibility ? (
          <Badge variant="secondary" className="text-[10px] uppercase">
            {trust.sourceVisibility}
          </Badge>
        ) : null}
      </div>

      {trust.externalShare ? (
        <Alert>
          <AlertTriangleIcon />
          <AlertTitle>External sharing</AlertTitle>
          <AlertDescription>
            This response may include data destined for an external system. Review
            before approving.
          </AlertDescription>
        </Alert>
      ) : null}
    </div>
  )
}
