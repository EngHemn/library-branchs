"use client"

import { useRouter } from "next/navigation"
import { ArrowLeftIcon, Loader2Icon, SaveIcon } from "lucide-react"

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
import type { StaffManagementUseCase } from "@/domain/usecases/staff/StaffManagementUseCase"
import { useDashboardBreadcrumbs } from "@/presentation/hooks/useDashboardBreadcrumbs"
import { useEditStaffViewModel } from "@/presentation/viewmodels/staff-management/useEditStaffViewModel"

type EditStaffScreenProps = {
  staffId: string
  staffManagementUseCase: StaffManagementUseCase
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

export function EditStaffScreen({ staffId, staffManagementUseCase, branchManagementUseCase }: EditStaffScreenProps) {
  const router = useRouter()
  const viewModel = useEditStaffViewModel(staffId, staffManagementUseCase, branchManagementUseCase)
  const { state } = viewModel

  useDashboardBreadcrumbs([
    { label: "Workspace", href: "/dashboard" },
    { label: "Staff Management", href: "/dashboard/staff" },
    { label: "Edit Staff" },
  ])

  const goBack = () => router.push("/dashboard/staff")

  return (
    <>
      {state.isLoading ? <LoadingState /> : null}

      {state.isNotFound ? (
        <div className="flex flex-1 items-center justify-center p-4">
          <Card className="w-full max-w-md rounded-lg">
            <CardHeader>
              <CardTitle>Staff member not found</CardTitle>
              <CardDescription>
                The staff member you are looking for does not exist or has been removed.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" onClick={goBack}>
                <ArrowLeftIcon />
                Back to staff
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
                Back to staff
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : null}

      {(state.isLoaded || state.isSaving || state.isSaved) && state.staffMember ? (
        <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
          <section className="flex items-center justify-between pt-4">
            <div>
              <h1 className="text-2xl font-semibold tracking-normal">Edit Staff</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Update the details for{" "}
                <span className="font-medium text-foreground">{state.staffMember.staffName}</span>
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
                  Staff member updated successfully.
                </p>
                <Button size="sm" variant="outline" onClick={goBack}>
                  Back to staff
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
              <CardTitle>Staff Details</CardTitle>
              <CardDescription>Update the information for this staff member.</CardDescription>
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
                    <Label htmlFor="staffName">Full Name</Label>
                    <Input
                      id="staffName"
                      value={state.form.staffName}
                      onChange={(e) => viewModel.setField("staffName", e.target.value)}
                      disabled={state.isSaving}
                    />
                    {state.fieldErrors.staffName ? (
                      <p className="text-sm text-destructive">{state.fieldErrors.staffName}</p>
                    ) : null}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select
                      value={state.form.role}
                      onValueChange={(value) => viewModel.setField("role", value)}
                      disabled={state.isSaving}
                    >
                      <SelectTrigger id="role">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="librarian">Librarian</SelectItem>
                        <SelectItem value="assistant">Assistant</SelectItem>
                        <SelectItem value="clerk">Clerk</SelectItem>
                        <SelectItem value="security">Security</SelectItem>
                      </SelectContent>
                    </Select>
                    {state.fieldErrors.role ? (
                      <p className="text-sm text-destructive">{state.fieldErrors.role}</p>
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

                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="branch">Branch</Label>
                    <Select
                      value={state.form.branchId}
                      onValueChange={(value) => viewModel.setField("branchId", value)}
                      disabled={state.isSaving}
                    >
                      <SelectTrigger id="branch">
                        <SelectValue placeholder="Select a branch" />
                      </SelectTrigger>
                      <SelectContent>
                        {state.branches.map((branch) => (
                          <SelectItem key={branch.id} value={branch.id}>
                            {branch.branchName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {state.fieldErrors.branch ? (
                      <p className="text-sm text-destructive">{state.fieldErrors.branch}</p>
                    ) : null}
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
