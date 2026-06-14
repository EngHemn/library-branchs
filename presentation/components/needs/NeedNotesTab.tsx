"use client"

import type { NeedNote } from "@/domain/entities/need/Need"
import { formatNeedDateTime } from "@/presentation/components/needs/needDisplay"
import { useTranslation } from "@/presentation/i18n/useTranslation"

type NeedNotesTabProps = {
  comments: NeedNote[]
}

export function NeedNotesTab({ comments }: NeedNotesTabProps) {
  const { t } = useTranslation()

  if (comments.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        {t("needs.notesTab.empty")}
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
