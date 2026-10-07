import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

type AiChatApprovalProps = {
  title: string
  description: string
  onApprove: () => void
  onReject: () => void
}

export function AiChatApproval({
  title,
  description,
  onApprove,
  onReject,
}: AiChatApprovalProps) {
  return (
    <div className="rounded-lg border border-border bg-muted p-3">
      <p className="text-sm font-medium">{title}</p>
      <p className="mt-1 text-xs text-muted-foreground">{description}</p>

      <div className="mt-3 flex flex-wrap gap-2">
        <AlertDialog>
          <AlertDialogTrigger
            render={<Button size="sm">Approve once</Button>}
          />
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm approval</AlertDialogTitle>
              <AlertDialogDescription>
                {description} This action may share data outside the workspace.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={onApprove}>Approve</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Button size="sm" variant="outline" onClick={onApprove}>
          Always allow
        </Button>
        <Button size="sm" variant="ghost" onClick={onReject}>
          Reject
        </Button>
      </div>
    </div>
  )
}
