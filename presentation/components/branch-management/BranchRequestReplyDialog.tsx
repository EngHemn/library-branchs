"use client"

import { useEffect, useState } from "react"
import { MessageSquareReplyIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type {
  MainBranchRequest,
  SubBranchRequest,
} from "@/domain/entities/branch/Branch"
import { useTranslation } from "@/presentation/i18n/useTranslation"

export type BranchRequestReplyAction =
  | { kind: "main"; request: MainBranchRequest }
  | { kind: "sub"; request: SubBranchRequest }

type BranchRequestReplyDialogProps = {
  action: BranchRequestReplyAction | null
  isSending: boolean
  onConfirm: (message: string) => void
  onCancel: () => void
}

function getRecipientEmail(action: BranchRequestReplyAction): string {
  return action.request.adminEmail
}

function getRequestLabel(action: BranchRequestReplyAction): string {
  if (action.kind === "main") {
    return action.request.branchName
  }

  return `${action.request.branchName} (${action.request.parentBranchName})`
}

export function BranchRequestReplyDialog({
  action,
  isSending,
  onConfirm,
  onCancel,
}: BranchRequestReplyDialogProps) {
  const { t } = useTranslation()
  const [message, setMessage] = useState("")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (action) {
      setMessage("")
      setError(null)
    }
  }, [action])

  const handleConfirm = (): void => {
    const trimmedMessage = message.trim()

    if (!trimmedMessage) {
      setError(t("branches.replyDialog.messageRequired"))
      return
    }

    onConfirm(trimmedMessage)
  }

  return (
    <Dialog
      open={Boolean(action)}
      onOpenChange={(open) => {
        if (!open) {
          onCancel()
        }
      }}
    >
      <DialogContent className="min-w-lg">
        {action ? (
          <>
            <DialogHeader>
              <div className="mb-2 flex items-center gap-2">
                <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900/30">
                  <MessageSquareReplyIcon className="size-5 text-blue-600 dark:text-blue-400" />
                </div>
                <DialogTitle>{t("branches.replyDialog.title")}</DialogTitle>
              </div>
              <DialogDescription className="text-left">
                {t("branches.replyDialog.description", {
                  adminName: action.request.adminName,
                  email: getRecipientEmail(action),
                  name: getRequestLabel(action),
                  id: action.request.id,
                })}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-2">
              <Label htmlFor="replyMessage">{t("branches.replyDialog.message")}</Label>
              <Textarea
                id="replyMessage"
                placeholder={t("branches.replyDialog.messagePlaceholder")}
                value={message}
                disabled={isSending}
                onChange={(event) => {
                  setMessage(event.target.value)
                  if (error) {
                    setError(null)
                  }
                }}
                rows={4}
              />
              {error ? <p className="text-sm text-destructive">{error}</p> : null}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={onCancel} disabled={isSending}>
                {t("common.cancel")}
              </Button>
              <Button onClick={handleConfirm} disabled={isSending}>
                {isSending ? t("branches.replyDialog.sending") : t("branches.replyDialog.sendReply")}
              </Button>
            </DialogFooter>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
