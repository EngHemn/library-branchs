"use client"

import { useRouter } from "next/navigation"
import { ArrowLeftIcon, Loader2Icon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { dashboardPaths } from "@/lib/dashboardPaths"
import type { AuthUseCase } from "@/domain/usecases/auth/AuthUseCase"
import type { NeedManagementUseCase } from "@/domain/usecases/needs/NeedManagementUseCase"
import { NeedFormFields } from "@/presentation/components/needs/NeedFormFields"
import { useDashboardBreadcrumbs } from "@/presentation/hooks/useDashboardBreadcrumbs"
import { useFormSubmitSuccess } from "@/presentation/hooks/useFormSubmitSuccess"
import { useEditNeedViewModel } from "@/presentation/viewmodels/needs/useEditNeedViewModel"

type EditNeedScreenProps = {
  needId: string
  authUseCase: AuthUseCase
  needManagementUseCase: NeedManagementUseCase
}

export function EditNeedScreen({
  needId,
  authUseCase,
  needManagementUseCase,
}: EditNeedScreenProps) {
  const router = useRouter()
  const viewModel = useEditNeedViewModel(
    needId,
    authUseCase,
    needManagementUseCase
  )
  const { state, form } = viewModel

  useDashboardBreadcrumbs([
    { label: "Workspace", href: "/dashboard" },
    { label: "Needs Management", href: dashboardPaths.needs.list },
    { label: "Edit Request" },
  ])

  useFormSubmitSuccess(
    state.isSaved,
    "Need request updated successfully.",
    dashboardPaths.needs.detail(needId)
  )

  if (state.isLoading) {
    return (
      <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
        <Skeleton className="mt-4 h-8 w-48" />
        <Skeleton className="h-96 rounded-lg" />
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
      <section className="flex items-center justify-between pt-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Edit Need Request
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Update request details and save changes.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => router.push(dashboardPaths.needs.detail(needId))}
        >
          <ArrowLeftIcon />
          Back
        </Button>
      </section>

      {state.error ? (
        <Card className="rounded-lg border-destructive/40">
          <CardContent className="py-3">
            <p className="text-sm text-destructive">{state.error}</p>
          </CardContent>
        </Card>
      ) : null}

      <Card className="rounded-lg">
        <CardHeader>
          <CardTitle>Request Details</CardTitle>
          <CardDescription>Modify the need request information.</CardDescription>
        </CardHeader>
        <CardContent>
          <NeedFormFields
            form={form}
            branchOptions={state.branchOptions}
            requestedByOptions={state.requestedByOptions}
            showBranchField={state.showBranchField}
            disabled={state.isSaving}
            onSubmit={(values) => void viewModel.save(values)}
          >
            <div className="flex justify-end pt-2">
              <Button type="submit" disabled={state.isSaving}>
                {state.isSaving ? (
                  <Loader2Icon className="animate-spin" />
                ) : null}
                Save Changes
              </Button>
            </div>
          </NeedFormFields>
        </CardContent>
      </Card>
    </div>
  )
}
