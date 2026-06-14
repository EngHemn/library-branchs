"use client"

import { useEffect, useState } from "react"
import { AlertTriangleIcon } from "lucide-react"

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

export type BranchRequestConfirmAction =
  | { kind: "reject-main"; request: MainBranchRequest }
  | { kind: "reject-sub"; request: SubBranchRequest }

type BranchRequestConfirmDialogProps = {
  action: BranchRequestConfirmAction | null
  onConfirm: (message?: string) => void
  onCancel: () => void
}

export function BranchRequestConfirmDialog({
  action,
  onConfirm,
  onCancel,
}: BranchRequestConfirmDialogProps) {
  const { t } = useTranslation()
  const [message, setMessage] = useState("")

  useEffect(() => {
    if (action) {
      setMessage("")
    }
  }, [action])

  const title = action
    ? action.kind === "reject-main"
      ? t("branches.rejectDialog.titleMain")
      : t("branches.rejectDialog.titleSub")
    : ""

  const description = action
    ? action.kind === "reject-main"
      ? t("branches.rejectDialog.descriptionMain", {
          name: action.request.branchName,
          id: action.request.id,
        })
      : t("branches.rejectDialog.descriptionSub", {
          name: action.request.branchName,
          parent: action.request.parentBranchName,
          id: action.request.id,
        })
    : ""

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
                <div className="rounded-full bg-red-100 p-2 dark:bg-red-900/30">
                  <AlertTriangleIcon className="size-5 text-red-600 dark:text-red-400" />
                </div>
                <DialogTitle>{title}</DialogTitle>
              </div>
              <DialogDescription className="text-left">
                {description}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-2">
              <Label htmlFor="rejectMessage">
                {t("branches.rejectDialog.messageToRequester")}{" "}
                <span className="text-xs font-normal text-muted-foreground">
                  {t("branches.rejectDialog.optional")}
                </span>
              </Label>
              <Textarea
                id="rejectMessage"
                placeholder={t("branches.rejectDialog.messagePlaceholder")}
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                rows={3}
              />
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={onCancel}>
                {t("common.cancel")}
              </Button>
              <Button variant="destructive" onClick={() => onConfirm(message)}>
                {t("branches.rejectDialog.confirmLabel")}
              </Button>
            </DialogFooter>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
