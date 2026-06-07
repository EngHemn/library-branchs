"use client"

import { useRouter } from "next/navigation"

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
import type { ShelfManagementUseCase } from "@/domain/usecases/shelves/ShelfManagementUseCase"
import { ShelfFormWizard } from "@/presentation/components/shelves/ShelfFormWizard"
import { useDashboardBreadcrumbs } from "@/presentation/hooks/useDashboardBreadcrumbs"
import { useFormSubmitSuccess } from "@/presentation/hooks/useFormSubmitSuccess"
import { useEditShelfViewModel } from "@/presentation/viewmodels/shelves/useEditShelfViewModel"

type EditShelfScreenProps = {
  shelfId: string
  authUseCase: AuthUseCase
  shelfManagementUseCase: ShelfManagementUseCase
}

function LoadingState() {
  return (
    <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
      <Skeleton className="mt-4 h-8 w-48" />
      <Skeleton className="h-12 w-full max-w-xl" />
      <Skeleton className="h-96 rounded-lg" />
    </div>
  )
}

export function EditShelfScreen({
  shelfId,
  authUseCase,
  shelfManagementUseCase,
}: EditShelfScreenProps) {
  const router = useRouter()
  const viewModel = useEditShelfViewModel(
    shelfId,
    authUseCase,
    shelfManagementUseCase
  )
  const { state, form } = viewModel

  useDashboardBreadcrumbs([
    { label: "Workspace", href: "/dashboard" },
    { label: "Shelf Management", href: dashboardPaths.shelves.list },
    { label: "Edit Shelf" },
  ])

  useFormSubmitSuccess(
    state.isSaved,
    "Shelf updated successfully.",
    dashboardPaths.shelves.list
  )

  if (state.isLoading) {
    return <LoadingState />
  }

  if (state.notFound) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0 md:p-6 md:pt-0">
        <Card className="mt-4 rounded-lg">
          <CardHeader>
            <CardTitle>Shelf not found</CardTitle>
            <CardDescription>
              The shelf you are trying to edit does not exist or is unavailable.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push(dashboardPaths.shelves.list)}>
              Back to Shelves
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!state.isReady && !state.isSaving) {
    return null
  }

  return (
    <ShelfFormWizard
      title="Edit Shelf"
      description="Update shelf details and rebuild the location if needed."
      backHref={dashboardPaths.shelves.list}
      form={form}
      currentStep={state.currentStep}
      locationStepIndex={state.locationStepIndex}
      branchOptions={state.branchOptions}
      canSelectBranch={state.canSelectBranch}
      locationOptions={state.locationOptions}
      selectedBranchName={state.selectedBranchName}
      isSaving={state.isSaving}
      error={state.error}
      locationManageError={state.locationManageError}
      isManagingLocation={state.isManagingLocation}
      submitLabel="Save Changes"
      onBack={viewModel.goBack}
      onNext={() => void viewModel.goNext()}
      onSave={() => void viewModel.save()}
      onAddLocationValue={viewModel.addLocationValue}
      onUpdateLocationValue={viewModel.updateLocationValue}
      onDeleteLocationValue={viewModel.deleteLocationValue}
      onAddLocationStep={viewModel.addLocationStep}
      onUpdateLocationStep={viewModel.updateLocationStep}
      onDeleteLocationStep={viewModel.deleteLocationStep}
    />
  )
}
