"use client"

import { FileIcon, ImageIcon } from "lucide-react"

import { EntityImage } from "@/components/ui/entity-image"
import type { NeedAttachment } from "@/domain/entities/need/Need"
import { formatNeedDateTime } from "@/presentation/components/needs/needDisplay"

type NeedAttachmentsTabProps = {
  attachments: NeedAttachment[]
}

export function NeedAttachmentsTab({ attachments }: NeedAttachmentsTabProps) {
  if (attachments.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No files or images have been uploaded.
      </p>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {attachments.map((attachment) => (
        <div
          key={attachment.id}
          className="rounded-lg border p-4"
        >
          {attachment.type === "image" ? (
            <EntityImage
              src={attachment.url}
              alt={attachment.name}
              width={200}
              height={120}
              className="mb-3 h-28 w-full rounded-md object-cover"
              fallback={<ImageIcon className="size-8 text-muted-foreground" />}
            />
          ) : (
            <div className="mb-3 flex h-28 items-center justify-center rounded-md bg-muted">
              <FileIcon className="size-8 text-muted-foreground" />
            </div>
          )}
          <p className="truncate text-sm font-medium">{attachment.name}</p>
          <p className="text-xs text-muted-foreground">
            Uploaded {formatNeedDateTime(attachment.uploadedAt)}
          </p>
        </div>
      ))}
    </div>
  )
}
