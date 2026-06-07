"use client"

import type { NeedNote } from "@/domain/entities/need/Need"
import { formatNeedDateTime } from "@/presentation/components/needs/needDisplay"

type NeedNotesTabProps = {
  comments: NeedNote[]
}

export function NeedNotesTab({ comments }: NeedNotesTabProps) {
  if (comments.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No comments or notes have been added yet.
      </p>
    )
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div
          key={comment.id}
          className="rounded-lg border bg-muted/30 p-4"
        >
          <div className="mb-2 flex items-center justify-between gap-2">
            <span className="text-sm font-medium">{comment.author}</span>
            <span className="text-xs text-muted-foreground">
              {formatNeedDateTime(comment.createdAt)}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">{comment.content}</p>
        </div>
      ))}
    </div>
  )
}
