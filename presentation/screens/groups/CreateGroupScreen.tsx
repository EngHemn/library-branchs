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
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { dashboardPaths } from "@/lib/dashboardPaths"
import type { AuthUseCase } from "@/domain/usecases/auth/AuthUseCase"
import type { GroupManagementUseCase } from "@/domain/usecases/groups/GroupManagementUseCase"
import { GroupFormFields } from "@/presentation/components/groups/GroupFormFields"
import { useDashboardBreadcrumbs } from "@/presentation/hooks/useDashboardBreadcrumbs"
import { useFormSubmitSuccess } from "@/presentation/hooks/useFormSubmitSuccess"
import { useCreateGroupViewModel } from "@/presentation/viewmodels/groups/useCreateGroupViewModel"

type CreateGroupScreenProps = {
  authUseCase: AuthUseCase
  groupManagementUseCase: GroupManagementUseCase
}

function LoadingState() {
  return (
    <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
      <div className="space-y-2 pt-4">
        <Skeleton className="h-8 w-48" />
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

export function CreateGroupScreen({
  authUseCase,
  groupManagementUseCase,
}: CreateGroupScreenProps) {
  const router = useRouter()
  const viewModel = useCreateGroupViewModel(authUseCase, groupManagementUseCase)
  const { state, form } = viewModel

  useDashboardBreadcrumbs([
    { label: "Workspace", href: "/dashboard" },
    { label: "Group Management", href: dashboardPaths.groups.list },
    { label: "Add Group" },
  ])

  const goBack = () => router.push(dashboardPaths.groups.list)

  useFormSubmitSuccess(state.isSaved, "Group created successfully.")

  return (
    <>
      {state.isLoading ? <LoadingState /> : null}

      {state.isReady || state.isSaving || state.isSaved ? (
        <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
          <section className="flex items-center justify-between pt-4">
            <div>
              <h1 className="text-2xl font-semibold tracking-normal">
                Add Group
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Create a new group and assign books and staff members.
              </p>
            </div>
            <Button variant="outline" onClick={goBack}>
              <ArrowLeftIcon />
              Back
            </Button>
          </section>

          {state.error ? (
            <Card className="rounded-lg border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950">
              <CardContent className="py-3">
                <p className="text-sm font-medium text-red-800 dark:text-red-200">
                  {state.error}
                </p>
              </CardContent>
            </Card>
          ) : null}

          <Card className="rounded-lg">
            <CardHeader>
              <CardTitle>Group Details</CardTitle>
              <CardDescription>
                Fill in the information for the new group.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <GroupFormFields
                form={form}
                bookOptions={state.bookOptions}
                staffOptions={state.staffOptions}
                branchOptions={state.branchOptions}
                showBranchField={state.showBranchField}
                disabled={state.isSaving || state.isSaved}
                onSubmit={(values) => void viewModel.save(values)}
              >
                <Separator />
                <div className="flex justify-end gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={goBack}
                    disabled={state.isSaving}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={state.isSaving || state.isSaved}
                  >
                    {state.isSaving ? (
                      <Loader2Icon className="animate-spin" />
                    ) : (
                      <PlusIcon />
                    )}
                    {state.isSaving ? "Creating..." : "Create Group"}
                  </Button>
                </div>
              </GroupFormFields>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </>
  )
}
