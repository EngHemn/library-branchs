"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { dashboardPaths } from "@/lib/dashboardPaths"
import type { AuthUseCase } from "@/domain/usecases/auth/AuthUseCase"
import type { ShelfManagementUseCase } from "@/domain/usecases/shelves/ShelfManagementUseCase"
import { ShelfFormWizard } from "@/presentation/components/shelves/ShelfFormWizard"
import { useDashboardBreadcrumbs } from "@/presentation/hooks/useDashboardBreadcrumbs"
import { useFormSubmitSuccess } from "@/presentation/hooks/useFormSubmitSuccess"
import { useTranslation } from "@/presentation/i18n/useTranslation"
import { useCreateShelfViewModel } from "@/presentation/viewmodels/shelves/useCreateShelfViewModel"

type CreateShelfScreenProps = {
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

export function CreateShelfScreen({
  authUseCase,
  shelfManagementUseCase,
}: CreateShelfScreenProps) {
  const { t } = useTranslation()
  const viewModel = useCreateShelfViewModel(authUseCase, shelfManagementUseCase)
  const { state, form } = viewModel

  useDashboardBreadcrumbs([
    { label: t("breadcrumbs.workspace"), href: "/dashboard" },
    { label: t("nav.shelves"), href: dashboardPaths.shelves.list },
    { label: t("shelves.addTitle") },
  ])

  useFormSubmitSuccess(
    state.isSaved,
    t("shelves.create.success"),
    dashboardPaths.shelves.list
  )

  if (state.isLoading) {
    return <LoadingState />
  }

  if (!state.isReady && !state.isSaving) {
    return null
  }

  return (
    <ShelfFormWizard
      title={t("shelves.create.title")}
      description={t("shelves.create.description")}
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
      submitLabel={t("shelves.create.submitButton")}
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
