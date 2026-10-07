import { FileIcon, XIcon } from "lucide-react"

import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle,
} from "@/components/ui/attachment"
import { Progress } from "@/components/ui/progress"
import { Spinner } from "@/components/ui/spinner"
import type { ComposerAttachment } from "./types"

type AiChatComposerAttachmentsProps = {
  attachments: ComposerAttachment[]
  onRemove: (id: string) => void
}

export function AiChatComposerAttachments({
  attachments,
  onRemove,
}: AiChatComposerAttachmentsProps) {
  if (attachments.length === 0) return null

  return (
    <AttachmentGroup className="px-3 pb-2">
      {attachments.map((attachment) => (
        <Attachment key={attachment.id} state={attachment.state} size="sm">
          <AttachmentMedia variant="icon">
            {attachment.state === "uploading" || attachment.state === "processing" ? (
              <Spinner className="size-4" />
            ) : (
              <FileIcon />
            )}
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>{attachment.name}</AttachmentTitle>
            <AttachmentDescription>
              {attachment.mediaType} · {attachment.sizeLabel}
            </AttachmentDescription>
            {attachment.state === "uploading" && attachment.progress !== undefined ? (
              <Progress value={attachment.progress} className="mt-2 h-1" />
            ) : null}
          </AttachmentContent>
          <AttachmentActions>
            <AttachmentAction
              aria-label={`Remove ${attachment.name}`}
              onClick={() => onRemove(attachment.id)}
            >
              <XIcon />
            </AttachmentAction>
          </AttachmentActions>
        </Attachment>
      ))}
    </AttachmentGroup>
  )
}
