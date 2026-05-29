"use client"

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { SettingsUseCase } from "@/domain/usecases/settings/SettingsUseCase"
import { AppearanceSection } from "@/presentation/components/settings/AppearanceSection"
import { BorrowingRulesSection } from "@/presentation/components/settings/BorrowingRulesSection"
import { LibraryInfoSection } from "@/presentation/components/settings/LibraryInfoSection"
import { NotificationsSection } from "@/presentation/components/settings/NotificationsSection"
import { useSettingsViewModel } from "@/presentation/viewmodels/settings/useSettingsViewModel"

type SettingsScreenProps = {
  settingsUseCase: SettingsUseCase
}

function LoadingSettingsScreen() {
  return (
    <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
      <div className="space-y-2 pt-4">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-4 w-72 max-w-full" />
      </div>
      <Skeleton className="h-10 w-80 rounded-lg" />
      <div className="space-y-4">
        <Skeleton className="h-14 rounded-lg" />
        <Skeleton className="h-14 rounded-lg" />
        <Skeleton className="h-14 rounded-lg" />
        <Skeleton className="h-14 rounded-lg" />
        <Skeleton className="h-10 w-32 rounded-lg self-end" />
      </div>
    </div>
  )
}

export function SettingsScreen({ settingsUseCase }: SettingsScreenProps) {
  const viewModel = useSettingsViewModel(settingsUseCase)
  const { state } = viewModel

  return (
    <SidebarProvider>
      <AppSidebar />
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
                  <BreadcrumbPage>Settings</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        {state.isLoading ? (
          <LoadingSettingsScreen />
        ) : state.loadStatus === "error" ? (
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0 md:p-6 md:pt-0">
            <Card className="mt-4 rounded-lg border-destructive/40">
              <CardHeader>
                <CardTitle>Unable to load settings</CardTitle>
                <CardDescription>
                  {state.loadError ?? "Something went wrong. Please try again."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button type="button" onClick={() => void viewModel.reload()}>
                  <RefreshCwIcon />
                  Retry
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
            <div className="flex flex-col gap-4 pt-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-1">
                <h1 className="text-2xl font-semibold tracking-tight">
                  Settings
                </h1>
                <p className="text-sm text-muted-foreground">
                  Manage appearance, library information, borrowing rules, and
                  notification preferences.
                </p>
              </div>
            </div>

            <Tabs defaultValue="appearance" className="space-y-4">
              <TabsList>
                <TabsTrigger value="appearance">Appearance</TabsTrigger>
                <TabsTrigger value="library-info">Library Info</TabsTrigger>
                <TabsTrigger value="borrowing-rules">
                  Borrowing Rules
                </TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
              </TabsList>

              <TabsContent value="appearance">
                <Card>
                  <CardHeader>
                    <CardTitle>Appearance</CardTitle>
                    <CardDescription>
                      Customize the color mode and accent color of the
                      interface.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <AppearanceSection />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="library-info">
                <Card>
                  <CardHeader>
                    <CardTitle>Library Information</CardTitle>
                    <CardDescription>
                      Update your library's public contact details and identity.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <LibraryInfoSection
                      form={viewModel.libraryInfoForm}
                      isSaving={state.libraryInfoSaving}
                      error={state.libraryInfoError}
                      success={state.libraryInfoSuccess}
                      onSubmit={(values) => {
                        void viewModel.saveLibraryInfo(values)
                      }}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="borrowing-rules">
                <Card>
                  <CardHeader>
                    <CardTitle>Borrowing Rules</CardTitle>
                    <CardDescription>
                      Configure loan durations, renewal limits, and fine
                      policies.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <BorrowingRulesSection
                      form={viewModel.borrowingRulesForm}
                      isSaving={state.borrowingRulesSaving}
                      error={state.borrowingRulesError}
                      success={state.borrowingRulesSuccess}
                      onSubmit={(values) => {
                        void viewModel.saveBorrowingRules(values)
                      }}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notifications">
                <Card>
                  <CardHeader>
                    <CardTitle>Notifications</CardTitle>
                    <CardDescription>
                      Control which notifications are sent to library members.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <NotificationsSection
                      form={viewModel.notificationsForm}
                      isSaving={state.notificationsSaving}
                      error={state.notificationsError}
                      success={state.notificationsSuccess}
                      onSubmit={(values) => {
                        void viewModel.saveNotifications(values)
                      }}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </SidebarInset>
    </SidebarProvider>
  )
}
