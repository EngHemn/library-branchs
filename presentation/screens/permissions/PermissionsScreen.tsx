"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { RefreshCwIcon } from "lucide-react"

import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Skeleton } from "@/components/ui/skeleton"
import type { AuthUseCase } from "@/domain/usecases/auth/AuthUseCase"
import type { PermissionManagementUseCase } from "@/domain/usecases/permission/PermissionManagementUseCase"
import { PermissionCard } from "@/presentation/components/permissions/PermissionCard"
import { PermissionContentHeader } from "@/presentation/components/permissions/PermissionContentHeader"
import { PermissionLockedAlert } from "@/presentation/components/permissions/PermissionLockedAlert"
import { PermissionStaffSidebar } from "@/presentation/components/permissions/PermissionStaffSidebar"
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

  const user = state.user

  return (
    <SidebarProvider>
      <AppSidebar
        user={
          user
            ? {
                name: user.fullName,
                email: `${user.username}@liba.local`,
                avatar: "",
              }
            : undefined
        }
        onLogout={viewModel.logout}
      />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-vertical:h-4 data-vertical:self-auto"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/dashboard">Workspace</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Permissions</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        {state.isLoading || state.isUnauthenticated ? (
          <LoadingPermissionsScreen />
        ) : null}

        {state.error ? (
          <div className="flex flex-1 items-center justify-center p-4">
            <Card className="w-full max-w-md rounded-lg">
              <CardHeader>
                <CardTitle>Permissions unavailable</CardTitle>
                <CardDescription>{state.error}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={viewModel.reload}>
                  <RefreshCwIcon />
                  Retry
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : null}

        {state.isReady && user ? (
          <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
            <section className="pt-4">
              <h1 className="text-2xl font-semibold"> Permissions</h1>
              <p className="mt-1 text-sm text-gray-500">
                Select a staff member to configure their permissions.
              </p>
            </section>

            <div className="grid flex-1 grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
              <PermissionStaffSidebar
                staff={state.filteredStaff}
                selectedStaffId={state.selectedStaffId}
                searchQuery={state.searchQuery}
                onSearchChange={viewModel.setSearchQuery}
                onSelectStaff={viewModel.selectStaff}
              />

              <div className="flex flex-col gap-4">
                {state.selectedStaff && (
                  <>
                    <PermissionContentHeader
                      staff={state.selectedStaff}
                      selectedCount={state.selectedCount}
                      totalCount={state.totalCount}
                      isSaving={state.isSaving}
                      onReset={viewModel.resetPermissions}
                      onSave={viewModel.savePermissions}
                    />

                    {state.selectedStaff.isRoleLocked ? (
                      <PermissionLockedAlert />
                    ) : (
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
                    )}
                  </>
                )}

                {!state.selectedStaff && (
                  <div className="flex flex-1 items-center justify-center rounded-lg border bg-muted/30 p-12">
                    <p className="text-sm text-muted-foreground">
                      Select a staff member to manage their permissions.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : null}
      </SidebarInset>
    </SidebarProvider>
  )
}
