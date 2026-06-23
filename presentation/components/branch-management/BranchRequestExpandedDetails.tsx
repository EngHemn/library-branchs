"use client"

import type { BranchRequestReply } from "@/domain/entities/branch/Branch"
import { useLocale } from "@/presentation/i18n/useLocale"
import { useTranslation } from "@/presentation/i18n/useTranslation"

type BranchRequestExpandedDetailsProps = {
  note: string
  replies: BranchRequestReply[]
}

export function BranchRequestExpandedDetails({
  note,
  replies,
}: BranchRequestExpandedDetailsProps) {
  const { t } = useTranslation()
  const { locale } = useLocale()

  function formatReplyDate(sentAt: string): string {
    return new Intl.DateTimeFormat(locale, {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(sentAt))
  }

  return (
    <div className="space-y-3">
      <div className="rounded-lg border bg-background p-3">
        <div className="text-xs font-medium tracking-normal text-muted-foreground uppercase">
          {t("branches.requests.note")}
        </div>
        <p className="mt-1 text-sm leading-6">
          {note || t("branches.requests.noNote")}
        </p>
      </div>

      <div className="rounded-lg border bg-background p-3">
        <div className="text-xs font-medium tracking-normal text-muted-foreground uppercase">
          {t("branches.requests.messages")}
        </div>
        {replies.length === 0 ? (
          <p className="mt-1 text-sm text-muted-foreground">
            {t("branches.requests.noMessages")}
          </p>
        ) : (
          <ul className="mt-2 space-y-2">
            {replies.map((reply) => (
              <li
                key={reply.id}
                className="rounded-md border bg-muted/30 px-3 py-2"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">
                    {reply.sentBy}
                  </span>
                  <span>{formatReplyDate(reply.sentAt)}</span>
                </div>
                <p className="mt-1 text-sm leading-6">{reply.message}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
