"use client"

import { CheckCircle2Icon, Loader2Icon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ImageUpload } from "@/components/ui/image-upload"
import { Separator } from "@/components/ui/separator"
import type { Branch, BranchType } from "@/domain/entities/branch/Branch"
import type { BranchFormErrors } from "@/domain/validators/branch/validateBranchForm"

type EditBranchFormField = {
  branchName: string
  email: string
  adminName: string
  parentBranch: string | null
  address: string
  phone: string
  imageUrl: string | null
}

type EditBranchFormProps = {
  branchId: string
  branchType: BranchType
  form: EditBranchFormField
  fieldErrors: BranchFormErrors
  mainBranches: Branch[]
  error: string | null
  isSaving: boolean
  isSaved: boolean
  onFieldChange: (field: keyof EditBranchFormField, value: string | null) => void
  onSave: () => void
  onCancel: () => void
}

function FieldError({ message }: { message: string | null }) {
  if (!message) {
    return null
  }

  return <p className="text-sm text-destructive">{message}</p>
}

export function EditBranchForm({
  branchId,
  branchType,
  form,
  fieldErrors,
  mainBranches,
  error,
  isSaving,
  isSaved,
  onFieldChange,
  onSave,
  onCancel,
}: EditBranchFormProps) {
  const isDisabled = isSaving || isSaved

  return (
    <Card className="rounded-lg">
      <CardHeader>
        <CardTitle>Edit Branch</CardTitle>
        <CardDescription>
          Update the details for branch {branchId}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {error ? (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        ) : null}

        {isSaved ? (
          <div className="flex items-center gap-2 rounded-lg border border-emerald-500/50 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-400">
            <CheckCircle2Icon className="size-4 shrink-0" />
            Branch updated successfully. Redirecting…
          </div>
        ) : null}

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="branchName">Branch Name</Label>
            <Input
              id="branchName"
              value={form.branchName}
              disabled={isDisabled}
              aria-invalid={Boolean(fieldErrors.branchName)}
              onChange={(e) => onFieldChange("branchName", e.target.value)}
            />
            <FieldError message={fieldErrors.branchName} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={form.email}
              disabled={isDisabled}
              aria-invalid={Boolean(fieldErrors.email)}
              onChange={(e) => onFieldChange("email", e.target.value)}
            />
            <FieldError message={fieldErrors.email} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="adminName">Admin Name</Label>
            <Input
              id="adminName"
              value={form.adminName}
              disabled={isDisabled}
              aria-invalid={Boolean(fieldErrors.adminName)}
              onChange={(e) => onFieldChange("adminName", e.target.value)}
            />
            <FieldError message={fieldErrors.adminName} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              value={form.phone}
              disabled={isDisabled}
              aria-invalid={Boolean(fieldErrors.phone)}
              onChange={(e) => onFieldChange("phone", e.target.value)}
            />
            <FieldError message={fieldErrors.phone} />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={form.address}
              disabled={isDisabled}
              aria-invalid={Boolean(fieldErrors.address)}
              onChange={(e) => onFieldChange("address", e.target.value)}
            />
            <FieldError message={fieldErrors.address} />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <ImageUpload
              label="Branch image"
              previewAlt="Branch image preview"
              value={form.imageUrl}
              onChange={(url) => onFieldChange("imageUrl", url)}
              disabled={isDisabled}
            />
          </div>

          {branchType === "sub" ? (
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="parentBranch">Parent Branch</Label>
              <Select
                value={form.parentBranch ?? ""}
                disabled={isDisabled}
                onValueChange={(value) =>
                  onFieldChange("parentBranch", value || null)
                }
              >
                <SelectTrigger
                  id="parentBranch"
                  className="w-full"
                  aria-invalid={Boolean(fieldErrors.parentBranch)}
                >
                  <SelectValue placeholder="Select a parent branch" />
                </SelectTrigger>
                <SelectContent>
                  {mainBranches.map((branch) => (
                    <SelectItem key={branch.id} value={branch.branchName}>
                      {branch.branchName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError message={fieldErrors.parentBranch} />
            </div>
          ) : null}
        </div>
      </CardContent>

      <Separator />

      <CardFooter className="flex justify-end gap-3 pt-6">
        <Button
          variant="outline"
          disabled={isDisabled}
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          disabled={isDisabled}
          onClick={onSave}
        >
          {isSaving ? (
            <>
              <Loader2Icon className="size-4 animate-spin" />
              Saving…
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
