"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeftIcon, EyeIcon, EyeOffIcon, Loader2Icon, RefreshCwIcon, SaveIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
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
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import type { BranchManagementUseCase } from "@/domain/usecases/branch/BranchManagementUseCase"
import { LocationPicker } from "@/presentation/components/branch-management/LocationPicker"
import { useDashboardBreadcrumbs } from "@/presentation/hooks/useDashboardBreadcrumbs"
import { useEditBranchViewModel } from "@/presentation/viewmodels/branch-management/useEditBranchViewModel"

type EditBranchScreenProps = {
  branchId: string
  branchManagementUseCase: BranchManagementUseCase
}

function LoadingState() {
  return (
    <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
      <div className="space-y-2 pt-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>
      <Card className="rounded-lg">
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-72" />
        </CardHeader>
        <CardContent className="space-y-6">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

export function EditBranchScreen({ branchId, branchManagementUseCase }: EditBranchScreenProps) {
  const router = useRouter()
  const viewModel = useEditBranchViewModel(branchId, branchManagementUseCase)
  const { state } = viewModel
  const [showPassword, setShowPassword] = useState(false)

  useDashboardBreadcrumbs([
    { label: "Workspace", href: "/dashboard" },
    { label: "Branch Management", href: "/dashboard/branches" },
    { label: "Edit Branch" },
  ])

  const goBack = () => router.push("/dashboard/branches")

  return (
    <>
      {state.isLoading ? <LoadingState /> : null}

      {state.isNotFound ? (
        <div className="flex flex-1 items-center justify-center p-4">
          <Card className="w-full max-w-md rounded-lg">
            <CardHeader>
              <CardTitle>Branch not found</CardTitle>
              <CardDescription>
                The branch you are looking for does not exist or has been removed.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" onClick={goBack}>
                <ArrowLeftIcon />
                Back to branches
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : null}

      {state.isError ? (
        <div className="flex flex-1 items-center justify-center p-4">
          <Card className="w-full max-w-md rounded-lg">
            <CardHeader>
              <CardTitle>Something went wrong</CardTitle>
              <CardDescription>{state.error}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" onClick={goBack}>
                <ArrowLeftIcon />
                Back to branches
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : null}

      {(state.isLoaded || state.isSaving || state.isSaved) && state.branch ? (
        <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
          <section className="flex items-center justify-between pt-4">
            <div>
              <h1 className="text-2xl font-semibold tracking-normal">Edit Branch</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Update the details for{" "}
                <span className="font-medium text-foreground">{state.branch.branchName}</span>
              </p>
            </div>
            <Button variant="outline" onClick={goBack}>
              <ArrowLeftIcon />
              Back
            </Button>
          </section>

          {state.isSaved ? (
            <Card className="rounded-lg border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950">
              <CardContent className="flex items-center gap-3 py-3">
                <p className="text-sm font-medium text-green-800 dark:text-green-200">
                  Branch updated successfully.
                </p>
                <Button size="sm" variant="outline" onClick={goBack}>
                  Back to branches
                </Button>
              </CardContent>
            </Card>
          ) : null}

          {state.error && !state.isError ? (
            <Card className="rounded-lg border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950">
              <CardContent className="py-3">
                <p className="text-sm font-medium text-red-800 dark:text-red-200">{state.error}</p>
              </CardContent>
            </Card>
          ) : null}

          <Card className="rounded-lg">
            <CardHeader>
              <CardTitle>Branch Details</CardTitle>
              <CardDescription>
                {state.branch.type === "main" ? "Main branch information" : "Sub branch information"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                className="space-y-6"
                onSubmit={(e) => {
                  e.preventDefault()
                  void viewModel.save()
                }}
              >
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="branchName">Branch Name</Label>
                    <Input
                      id="branchName"
                      value={state.form.branchName}
                      onChange={(e) => viewModel.setField("branchName", e.target.value)}
                      disabled={state.isSaving}
                    />
                    {state.fieldErrors.branchName ? (
                      <p className="text-sm text-destructive">{state.fieldErrors.branchName}</p>
                    ) : null}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={state.form.email}
                      onChange={(e) => viewModel.setField("email", e.target.value)}
                      disabled={state.isSaving}
                    />
                    {state.fieldErrors.email ? (
                      <p className="text-sm text-destructive">{state.fieldErrors.email}</p>
                    ) : null}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="adminName">Admin Name</Label>
                    <Input
                      id="adminName"
                      value={state.form.adminName}
                      onChange={(e) => viewModel.setField("adminName", e.target.value)}
                      disabled={state.isSaving}
                    />
                    {state.fieldErrors.adminName ? (
                      <p className="text-sm text-destructive">{state.fieldErrors.adminName}</p>
                    ) : null}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={state.form.phone}
                      onChange={(e) => viewModel.setField("phone", e.target.value)}
                      disabled={state.isSaving}
                    />
                    {state.fieldErrors.phone ? (
                      <p className="text-sm text-destructive">{state.fieldErrors.phone}</p>
                    ) : null}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">
                      Password{" "}
                      <span className="text-xs font-normal text-muted-foreground">(leave empty to keep current)</span>
                    </Label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="New password (optional)"
                          value={state.form.password}
                          onChange={(e) => viewModel.setField("password", e.target.value)}
                          disabled={state.isSaving}
                          className="pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((v) => !v)}
                          className="absolute inset-y-0 right-2 flex items-center text-muted-foreground hover:text-foreground"
                          tabIndex={-1}
                        >
                          {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                        </button>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={viewModel.autoGeneratePassword}
                        disabled={state.isSaving}
                        title="Auto-generate password"
                      >
                        <RefreshCwIcon className="h-4 w-4" />
                      </Button>
                    </div>
                    {state.fieldErrors.password ? (
                      <p className="text-sm text-destructive">{state.fieldErrors.password}</p>
                    ) : null}
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={state.form.address}
                      onChange={(e) => viewModel.setField("address", e.target.value)}
                      disabled={state.isSaving}
                    />
                    {state.fieldErrors.address ? (
                      <p className="text-sm text-destructive">{state.fieldErrors.address}</p>
                    ) : null}
                  </div>

                  {state.branch.type === "sub" ? (
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="parentBranch">Parent Branch</Label>
                      <Select
                        value={state.form.parentBranch ?? ""}
                        onValueChange={(value) => viewModel.setField("parentBranch", value || null)}
                        disabled={state.isSaving}
                      >
                        <SelectTrigger id="parentBranch">
                          <SelectValue placeholder="Select a parent branch" />
                        </SelectTrigger>
                        <SelectContent>
                          {state.mainBranches.map((branch) => (
                            <SelectItem key={branch.id} value={branch.id}>
                              {branch.branchName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {state.fieldErrors.parentBranch ? (
                        <p className="text-sm text-destructive">{state.fieldErrors.parentBranch}</p>
                      ) : null}
                    </div>
                  ) : null}

                  <div className="sm:col-span-2">
                    <LocationPicker
                      latitude={state.form.latitude}
                      longitude={state.form.longitude}
                      onChange={viewModel.setLocation}
                      disabled={state.isSaving}
                    />
                  </div>
                </div>

                <Separator />

                <div className="flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={goBack} disabled={state.isSaving}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={state.isSaving}>
                    {state.isSaving ? <Loader2Icon className="animate-spin" /> : <SaveIcon />}
                    {state.isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </>
  )
}
