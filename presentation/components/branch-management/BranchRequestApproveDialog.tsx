"use client"

import { useEffect, useState } from "react"
import { CheckIcon, EyeIcon, EyeOffIcon, RefreshCwIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type {
  MainBranchRequest,
  SubBranchRequest,
} from "@/domain/entities/branch/Branch"
import { generatePassword } from "@/lib/generatePassword"

export type BranchRequestApproveAction =
  | { kind: "main"; request: MainBranchRequest }
  | { kind: "sub"; request: SubBranchRequest }

type BranchRequestApproveDialogProps = {
  action: BranchRequestApproveAction | null
  isSubmitting: boolean
  onConfirm: (password: string) => void
  onCancel: () => void
  onViewLocation: (location: {
    branchName: string
    address: string
    latitude: number | null
    longitude: number | null
  }) => void
}

function getRequestLabel(action: BranchRequestApproveAction): string {
  if (action.kind === "main") {
    return action.request.branchName
  }

  return `${action.request.branchName} (${action.request.parentBranchName})`
}

export function BranchRequestApproveDialog({
  action,
  isSubmitting,
  onConfirm,
  onCancel,
  onViewLocation,
}: BranchRequestApproveDialogProps) {
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (action) {
      setPassword(generatePassword())
      setShowPassword(false)
      setError(null)
    }
  }, [action])

  const handleConfirm = (): void => {
    if (password.trim().length < 6) {
      setError("Password must be at least 6 characters.")
      return
    }

    onConfirm(password.trim())
  }

  const hasLocation =
    action !== null &&
    action.request.latitude !== null &&
    action.request.longitude !== null

  return (
    <Dialog
      open={Boolean(action)}
      onOpenChange={(open) => {
        if (!open && !isSubmitting) {
          onCancel()
        }
      }}
    >
      <DialogContent className="min-w-lg">
        {action ? (
          <>
            <DialogHeader>
              <div className="mb-2 flex items-center gap-2">
                <div className="rounded-full bg-green-100 p-2 dark:bg-green-900/30">
                  <CheckIcon className="size-5 text-green-600 dark:text-green-400" />
                </div>
                <DialogTitle>
                  Approve {action.kind === "main" ? "main" : "sub"} branch request
                </DialogTitle>
              </div>
              <DialogDescription className="text-left">
                Create the branch for <strong>{getRequestLabel(action)}</strong> (
                {action.request.id}) and remove it from the pending queue.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="rounded-lg border bg-muted/30 px-3 py-2 text-sm">
                <p>
                  <span className="text-muted-foreground">Admin:</span>{" "}
                  {action.request.adminName}
                </p>
                <p className="mt-1">
                  <span className="text-muted-foreground">Address:</span>{" "}
                  {action.request.address || "Not provided"}
                </p>
              </div>

              <div className="flex items-center justify-between gap-3">
                <p className="text-sm text-muted-foreground">
                  {hasLocation
                    ? "Review the proposed location before approving."
                    : "This request has no map location."}
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    onViewLocation({
                      branchName: action.request.branchName,
                      address: action.request.address,
                      latitude: action.request.latitude,
                      longitude: action.request.longitude,
                    })
                  }
                >
                  View location
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="approvePassword">Admin password</Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input
                      id="approvePassword"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      disabled={isSubmitting}
                      onChange={(event) => {
                        setPassword(event.target.value)
                        if (error) {
                          setError(null)
                        }
                      }}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      className="absolute inset-y-0 right-2 flex items-center text-muted-foreground hover:text-foreground"
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <EyeOffIcon className="h-4 w-4" />
                      ) : (
                        <EyeIcon className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    disabled={isSubmitting}
                    onClick={() => setPassword(generatePassword())}
                    title="Auto-generate password"
                  >
                    <RefreshCwIcon className="h-4 w-4" />
                  </Button>
                </div>
                {error ? <p className="text-sm text-destructive">{error}</p> : null}
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button onClick={handleConfirm} disabled={isSubmitting || !hasLocation}>
                {isSubmitting ? "Approving..." : "Approve request"}
              </Button>
            </DialogFooter>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
