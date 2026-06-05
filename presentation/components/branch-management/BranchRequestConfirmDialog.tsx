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

export type BranchRequestConfirmAction =
  | { kind: "reject-main"; request: MainBranchRequest }
  | { kind: "reject-sub"; request: SubBranchRequest }

type BranchRequestConfirmDialogProps = {
  action: BranchRequestConfirmAction | null
  onConfirm: (message?: string) => void
  onCancel: () => void
}

function getDialogContent(action: BranchRequestConfirmAction): {
  title: string
  description: string
  confirmLabel: string
} {
  switch (action.kind) {
    case "reject-main":
      return {
        title: "Reject main branch request?",
        description: `Reject the request from "${action.request.branchName}" (${action.request.id})? It will be removed from the pending queue.`,
        confirmLabel: "Reject request",
      }
    case "reject-sub":
      return {
        title: "Reject sub branch request?",
        description: `Reject the request for "${action.request.branchName}" under "${action.request.parentBranchName}" (${action.request.id})? It will be removed from the pending queue.`,
        confirmLabel: "Reject request",
      }
  }
}

export function BranchRequestConfirmDialog({
  action,
  onConfirm,
  onCancel,
}: BranchRequestConfirmDialogProps) {
  const [message, setMessage] = useState("")
  const content = action ? getDialogContent(action) : null

  useEffect(() => {
    if (action) {
      setMessage("")
    }
  }, [action])

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
        {content ? (
          <>
            <DialogHeader>
              <div className="mb-2 flex items-center gap-2">
                <div className="rounded-full bg-red-100 p-2 dark:bg-red-900/30">
                  <AlertTriangleIcon className="size-5 text-red-600 dark:text-red-400" />
                </div>
                <DialogTitle>{content.title}</DialogTitle>
              </div>
              <DialogDescription className="text-left">
                {content.description}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-2">
              <Label htmlFor="rejectMessage">
                Message to requester{" "}
                <span className="text-xs font-normal text-muted-foreground">
                  (optional)
                </span>
              </Label>
              <Textarea
                id="rejectMessage"
                placeholder="Explain why the request was rejected..."
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                rows={3}
              />
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={() => onConfirm(message)}>
                {content.confirmLabel}
              </Button>
            </DialogFooter>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
