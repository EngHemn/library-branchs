"use client"

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { SettingsUseCase } from "@/domain/usecases/settings/SettingsUseCase"
import { AppearanceSection } from "@/presentation/components/settings/AppearanceSection"
import { BorrowingRulesSection } from "@/presentation/components/settings/BorrowingRulesSection"
import { LibraryInfoSection } from "@/presentation/components/settings/LibraryInfoSection"
import { NotificationsSection } from "@/presentation/components/settings/NotificationsSection"
import { LocaleSwitcher } from "@/presentation/components/shared/LocaleSwitcher"
import { useDashboardBreadcrumbs } from "@/presentation/hooks/useDashboardBreadcrumbs"
import { useTranslation } from "@/presentation/i18n/useTranslation"
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
  const { t } = useTranslation()
  const viewModel = useSettingsViewModel(settingsUseCase)
  const { state } = viewModel

  useDashboardBreadcrumbs([
    { label: t("breadcrumbs.workspace"), href: "/dashboard" },
    { label: t("settings.title") },
  ])

  if (state.isLoading) {
    return <LoadingSettingsScreen />
  }

  if (state.loadStatus === "error") {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0 md:p-6 md:pt-0">
        <Card className="mt-4 rounded-lg border-destructive/40">
          <CardHeader>
            <CardTitle>{t("settings.unableToLoad")}</CardTitle>
            <CardDescription>
              {state.loadError ?? t("common.somethingWentWrong")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button type="button" onClick={() => void viewModel.reload()}>
              <RefreshCwIcon />
              {t("common.retry")}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
      <div className="flex flex-col gap-4 pt-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            {t("settings.title")}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t("settings.description")}
          </p>
        </div>
      </div>

      <Tabs defaultValue="appearance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="appearance">{t("settings.tabs.appearance")}</TabsTrigger>
          <TabsTrigger value="library-info">{t("settings.tabs.libraryInfo")}</TabsTrigger>
          <TabsTrigger value="borrowing-rules">{t("settings.tabs.borrowingRules")}</TabsTrigger>
          <TabsTrigger value="notifications">{t("settings.tabs.notifications")}</TabsTrigger>
          <TabsTrigger value="language">{t("settings.tabs.language")}</TabsTrigger>
        </TabsList>

        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>{t("settings.appearance.title")}</CardTitle>
              <CardDescription>
                {t("settings.appearance.description")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AppearanceSection />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="language">
          <Card>
            <CardHeader>
              <CardTitle>{t("settings.language.title")}</CardTitle>
              <CardDescription>
                {t("settings.language.description")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm font-medium">{t("settings.language.label")}</p>
              <LocaleSwitcher />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="library-info">
          <Card>
            <CardHeader>
              <CardTitle>{t("settings.libraryInfo.title")}</CardTitle>
              <CardDescription>
                {t("settings.libraryInfo.description")}
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
              <CardTitle>{t("settings.borrowingRules.title")}</CardTitle>
              <CardDescription>
                {t("settings.borrowingRules.description")}
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
              <CardTitle>{t("settings.notifications.title")}</CardTitle>
              <CardDescription>
                {t("settings.notifications.description")}
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
  )
}
