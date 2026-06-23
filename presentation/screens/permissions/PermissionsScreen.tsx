"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { RefreshCwIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import type { AuthUseCase } from "@/domain/usecases/auth/AuthUseCase"
import type { PermissionManagementUseCase } from "@/domain/usecases/permission/PermissionManagementUseCase"
import { PermissionCard } from "@/presentation/components/permissions/PermissionCard"
import { PermissionDeleteRoleDialog } from "@/presentation/components/permissions/PermissionDeleteRoleDialog"
import { PermissionRoleFormDialog } from "@/presentation/components/permissions/PermissionRoleFormDialog"
import { PermissionRoleHeader } from "@/presentation/components/permissions/PermissionRoleHeader"
import { PermissionRoleSidebar } from "@/presentation/components/permissions/PermissionRoleSidebar"
import { useDashboardBreadcrumbs } from "@/presentation/hooks/useDashboardBreadcrumbs"
import { useTranslation } from "@/presentation/i18n/useTranslation"
import { usePermissionsViewModel } from "@/presentation/viewmodels/permissions/usePermissionsViewModel"

type PermissionsScreenProps = {
  authUseCase: AuthUseCase
  permissionManagementUseCase: PermissionManagementUseCase
}

function LoadingPermissionsScreen() {
  return (
    <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
      <div className="space-y-2 pt-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>
      <div className="grid flex-1 grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
        <Skeleton className="h-96 rounded-lg" />
        <Skeleton className="h-96 rounded-lg" />
      </div>
    </div>
  )
}

export function PermissionsScreen({
  authUseCase,
  permissionManagementUseCase,
}: PermissionsScreenProps) {
  const router = useRouter()
  const { t } = useTranslation()
  const viewModel = usePermissionsViewModel(
    authUseCase,
    permissionManagementUseCase
  )
  const { state } = viewModel

  useEffect(() => {
    if (state.isUnauthenticated) {
      router.replace("/")
    }
  }, [router, state.isUnauthenticated])

  useDashboardBreadcrumbs([
    { label: t("breadcrumbs.workspace"), href: "/dashboard" },
    { label: t("nav.permissions") },
  ])

  const user = state.user

  return (
    <>
      {state.isLoading || state.isUnauthenticated ? (
        <LoadingPermissionsScreen />
      ) : null}

      {state.error ? (
        <div className="flex flex-1 items-center justify-center p-4">
          <Card className="w-full max-w-md rounded-lg">
            <CardHeader>
              <CardTitle>{t("permissions.unavailable")}</CardTitle>
              <CardDescription>{state.error}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={viewModel.reload}>
                <RefreshCwIcon />
                {t("common.retry")}
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : null}

      {state.isReady && user ? (
        <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
          <section className="pt-4">
            <h1 className="text-2xl font-semibold">{t("permissions.title")}</h1>
            <p className="mt-1 text-sm text-gray-500">
              {t("permissions.subtitle")}
            </p>
          </section>

          <div className="grid flex-1 grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
            <PermissionRoleSidebar
              roles={state.filteredRoles}
              selectedRoleId={state.selectedRoleId}
              searchQuery={state.searchQuery}
              onSearchChange={viewModel.setSearchQuery}
              onSelectRole={viewModel.selectRole}
              onAddRole={viewModel.openCreateRoleDialog}
            />

            <div className="flex flex-col gap-4">
              {state.selectedRole && (
                <>
                  <PermissionRoleHeader
                    role={state.selectedRole}
                    selectedCount={state.selectedCount}
                    totalCount={state.totalCount}
                    isSaving={state.isSaving}
                    isDirty={state.isDirty}
                    onEditRole={viewModel.openEditRoleDialog}
                    onDeleteRole={viewModel.openDeleteRoleDialog}
                    onReset={viewModel.resetPermissions}
                    onSave={viewModel.savePermissions}
                  />

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {state.config?.categories.map((category) => (
                      <PermissionCard
                        key={category.name}
                        category={category}
                        selectedPermissions={state.draftPermissions}
                        onTogglePermission={viewModel.togglePermission}
                        onSelectAll={() =>
                          viewModel.selectAllInCategory(category.name)
                        }
                        onDeselectAll={() =>
                          viewModel.deselectAllInCategory(category.name)
                        }
                      />
                    ))}
                  </div>
                </>
              )}

              {!state.selectedRole && (
                <div className="flex flex-1 items-center justify-center rounded-lg border bg-muted/30 p-12">
                  <p className="text-sm text-muted-foreground">
                    {t("permissions.emptySelection")}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}

      <PermissionRoleFormDialog
        open={state.roleDialogMode !== null}
        mode={state.roleDialogMode ?? "create"}
        name={state.roleForm.name}
        description={state.roleForm.description}
        nameError={state.roleFormNameError}
        formError={state.roleFormError}
        isSubmitting={state.isSavingRole}
        onNameChange={viewModel.setRoleFormName}
        onDescriptionChange={viewModel.setRoleFormDescription}
        onClose={viewModel.closeRoleDialog}
        onSubmit={() => {
          void viewModel.submitRoleForm()
        }}
      />

      <PermissionDeleteRoleDialog
        open={state.deleteRoleDialog !== null}
        roleName={state.deleteRoleDialog?.roleName ?? ""}
        isSystem={state.deleteRoleDialog?.isSystem ?? false}
        error={state.deleteRoleError}
        isDeleting={state.isDeletingRole}
        onClose={viewModel.closeDeleteRoleDialog}
        onConfirm={() => {
          void viewModel.confirmDeleteRole()
        }}
      />
    </>
  )
}
