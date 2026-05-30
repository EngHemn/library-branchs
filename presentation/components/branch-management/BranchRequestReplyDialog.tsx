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
      setError("Message is required.")
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
                <DialogTitle>Reply to branch request</DialogTitle>
              </div>
              <DialogDescription className="text-left">
                Send a message to{" "}
                <strong>{action.request.adminName}</strong> at{" "}
                <strong>{getRecipientEmail(action)}</strong> about{" "}
                <strong>{getRequestLabel(action)}</strong> ({action.request.id}).
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-2">
              <Label htmlFor="replyMessage">Message</Label>
              <Textarea
                id="replyMessage"
                placeholder="Write your reply to the requester..."
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
                Cancel
              </Button>
              <Button onClick={handleConfirm} disabled={isSending}>
                {isSending ? "Sending..." : "Send reply"}
              </Button>
            </DialogFooter>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
