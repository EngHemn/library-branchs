"use client"

import { useRouter } from "next/navigation"
import { ArrowLeftIcon, Loader2Icon, PlusIcon } from "lucide-react"

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
import { useCreateBranchViewModel } from "@/presentation/viewmodels/branch-management/useCreateBranchViewModel"

type CreateBranchScreenProps = {
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
          {Array.from({ length: 6 }).map((_, index) => (
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

export function CreateBranchScreen({ branchManagementUseCase }: CreateBranchScreenProps) {
  const router = useRouter()
  const viewModel = useCreateBranchViewModel(branchManagementUseCase)
  const { state } = viewModel

  useDashboardBreadcrumbs([
    { label: "Workspace", href: "/dashboard" },
    { label: "Branch Management", href: "/dashboard/branches" },
    { label: "Create Branch" },
  ])

  const goBack = () => router.push("/dashboard/branches")

  return (
    <>
      {state.isLoading ? <LoadingState /> : null}

      {(state.isReady || state.isSaving || state.isSaved) ? (
        <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
          <section className="flex items-center justify-between pt-4">
            <div>
              <h1 className="text-2xl font-semibold tracking-normal">Create Branch</h1>
              <p className="mt-1 text-sm text-muted-foreground">Add a new branch to the workspace.</p>
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
                  Branch created successfully.
                </p>
                <Button size="sm" variant="outline" onClick={goBack}>
                  Back to branches
                </Button>
              </CardContent>
            </Card>
          ) : null}

          {state.error ? (
            <Card className="rounded-lg border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950">
              <CardContent className="py-3">
                <p className="text-sm font-medium text-red-800 dark:text-red-200">{state.error}</p>
              </CardContent>
            </Card>
          ) : null}

          <Card className="rounded-lg">
            <CardHeader>
              <CardTitle>Branch Details</CardTitle>
              <CardDescription>Fill in the information for the new branch.</CardDescription>
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
                      placeholder="Enter branch name"
                      value={state.form.branchName}
                      onChange={(e) => viewModel.setField("branchName", e.target.value)}
                      disabled={state.isSaving || state.isSaved}
                    />
                    {state.fieldErrors.branchName ? (
                      <p className="text-sm text-destructive">{state.fieldErrors.branchName}</p>
                    ) : null}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type">Branch Type</Label>
                    <Select
                      value={state.form.type}
                      onValueChange={(value) => viewModel.setField("type", value)}
                      disabled={state.isSaving || state.isSaved}
                    >
                      <SelectTrigger id="type">
                        <SelectValue placeholder="Select branch type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="main">Main Branch</SelectItem>
                        <SelectItem value="sub">Sub Branch</SelectItem>
                      </SelectContent>
                    </Select>
                    {state.fieldErrors.type ? (
                      <p className="text-sm text-destructive">{state.fieldErrors.type}</p>
                    ) : null}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter email address"
                      value={state.form.email}
                      onChange={(e) => viewModel.setField("email", e.target.value)}
                      disabled={state.isSaving || state.isSaved}
                    />
                    {state.fieldErrors.email ? (
                      <p className="text-sm text-destructive">{state.fieldErrors.email}</p>
                    ) : null}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="adminName">Admin Name</Label>
                    <Input
                      id="adminName"
                      placeholder="Enter admin name"
                      value={state.form.adminName}
                      onChange={(e) => viewModel.setField("adminName", e.target.value)}
                      disabled={state.isSaving || state.isSaved}
                    />
                    {state.fieldErrors.adminName ? (
                      <p className="text-sm text-destructive">{state.fieldErrors.adminName}</p>
                    ) : null}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      placeholder="Enter phone number"
                      value={state.form.phone}
                      onChange={(e) => viewModel.setField("phone", e.target.value)}
                      disabled={state.isSaving || state.isSaved}
                    />
                    {state.fieldErrors.phone ? (
                      <p className="text-sm text-destructive">{state.fieldErrors.phone}</p>
                    ) : null}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      placeholder="Enter address"
                      value={state.form.address}
                      onChange={(e) => viewModel.setField("address", e.target.value)}
                      disabled={state.isSaving || state.isSaved}
                    />
                    {state.fieldErrors.address ? (
                      <p className="text-sm text-destructive">{state.fieldErrors.address}</p>
                    ) : null}
                  </div>

                  {state.form.type === "sub" ? (
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="parentBranch">Parent Branch</Label>
                      <Select
                        value={state.form.parentBranch ?? ""}
                        onValueChange={(value) => viewModel.setField("parentBranch", value || null)}
                        disabled={state.isSaving || state.isSaved}
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
                      locationError={state.fieldErrors.location}
                      onChange={viewModel.setLocation}
                      disabled={state.isSaving || state.isSaved}
                    />
                  </div>
                </div>

                <Separator />

                <div className="flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={goBack} disabled={state.isSaving}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={state.isSaving || state.isSaved}>
                    {state.isSaving ? <Loader2Icon className="animate-spin" /> : <PlusIcon />}
                    {state.isSaving ? "Creating..." : "Create Branch"}
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
