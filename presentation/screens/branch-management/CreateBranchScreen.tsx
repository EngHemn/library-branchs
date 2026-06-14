"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeftIcon, EyeIcon, EyeOffIcon, Loader2Icon, PlusIcon, RefreshCwIcon } from "lucide-react"

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
import { ImageUpload } from "@/components/ui/image-upload"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import type { BranchManagementUseCase } from "@/domain/usecases/branch/BranchManagementUseCase"
import { LocationPicker } from "@/presentation/components/branch-management/LocationPicker"
import { useDashboardBreadcrumbs } from "@/presentation/hooks/useDashboardBreadcrumbs"
import { useFormSubmitSuccess } from "@/presentation/hooks/useFormSubmitSuccess"
import { useTranslation } from "@/presentation/i18n/useTranslation"
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

export function CreateBranchScreen({
  branchManagementUseCase,
}: CreateBranchScreenProps) {
  const router = useRouter()
  const { t } = useTranslation()
  const viewModel = useCreateBranchViewModel(branchManagementUseCase)
  const { state } = viewModel
  const [showPassword, setShowPassword] = useState(false)

  useDashboardBreadcrumbs([
    { label: t("breadcrumbs.workspace"), href: "/dashboard" },
    { label: t("nav.branches"), href: "/dashboard/branches" },
    { label: t("branches.create.breadcrumb") },
  ])

  const goBack = () => router.push("/dashboard/branches")

  useFormSubmitSuccess(state.isSaved, t("branches.create.createSuccess"))

  return (
    <>
      {state.isLoading ? <LoadingState /> : null}

      {state.isError ? (
        <div className="flex flex-1 items-center justify-center p-4">
          <Card className="w-full max-w-md rounded-lg">
            <CardHeader>
              <CardTitle>{t("branches.create.unableToCreate")}</CardTitle>
              <CardDescription>{state.error}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" onClick={goBack}>
                <ArrowLeftIcon />
                {t("branches.create.backToBranches")}
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : null}

      {(state.isReady || state.isSaving || state.isSaved) ? (
        <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
          <section className="flex items-center justify-between pt-4">
            <div>
              <h1 className="text-2xl font-semibold tracking-normal">{t("branches.create.title")}</h1>
              <p className="mt-1 text-sm text-muted-foreground">{t("branches.create.subtitle")}</p>
            </div>
            <Button variant="outline" onClick={goBack}>
              <ArrowLeftIcon />
              {t("common.back")}
            </Button>
          </section>

          {state.error ? (
            <Card className="rounded-lg border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950">
              <CardContent className="py-3">
                <p className="text-sm font-medium text-red-800 dark:text-red-200">{state.error}</p>
              </CardContent>
            </Card>
          ) : null}

          <Card className="rounded-lg">
            <CardHeader>
              <CardTitle>{t("branches.create.detailsTitle")}</CardTitle>
              <CardDescription>{t("branches.create.detailsDescription")}</CardDescription>
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
                    <Label htmlFor="branchName">{t("branches.create.fields.branchName")}</Label>
                    <Input
                      id="branchName"
                      placeholder={t("branches.create.placeholders.branchName")}
                      value={state.form.branchName}
                      onChange={(e) => viewModel.setField("branchName", e.target.value)}
                      disabled={state.isSaving || state.isSaved}
                    />
                    {state.fieldErrors.branchName ? (
                      <p className="text-sm text-destructive">{state.fieldErrors.branchName}</p>
                    ) : null}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">{t("branches.create.fields.email")}</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder={t("branches.create.placeholders.email")}
                      value={state.form.email}
                      onChange={(e) => viewModel.setField("email", e.target.value)}
                      disabled={state.isSaving || state.isSaved}
                    />
                    {state.fieldErrors.email ? (
                      <p className="text-sm text-destructive">{state.fieldErrors.email}</p>
                    ) : null}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="adminName">{t("branches.create.fields.adminName")}</Label>
                    <Input
                      id="adminName"
                      placeholder={t("branches.create.placeholders.adminName")}
                      value={state.form.adminName}
                      onChange={(e) => viewModel.setField("adminName", e.target.value)}
                      disabled={state.isSaving || state.isSaved}
                    />
                    {state.fieldErrors.adminName ? (
                      <p className="text-sm text-destructive">{state.fieldErrors.adminName}</p>
                    ) : null}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">{t("branches.create.fields.phone")}</Label>
                    <Input
                      id="phone"
                      placeholder={t("branches.create.placeholders.phone")}
                      value={state.form.phone}
                      onChange={(e) => viewModel.setField("phone", e.target.value)}
                      disabled={state.isSaving || state.isSaved}
                    />
                    {state.fieldErrors.phone ? (
                      <p className="text-sm text-destructive">{state.fieldErrors.phone}</p>
                    ) : null}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">{t("branches.create.fields.password")}</Label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder={t("branches.create.placeholders.password")}
                          value={state.form.password}
                          onChange={(e) => viewModel.setField("password", e.target.value)}
                          disabled={state.isSaving || state.isSaved}
                          className="pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((v) => !v)}
                          className="absolute inset-y-0 right-2 flex items-center text-muted-foreground hover:text-foreground"
                          tabIndex={-1}
                        >
                          {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                        </button>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={viewModel.autoGeneratePassword}
                        disabled={state.isSaving || state.isSaved}
                        title={t("branches.approveDialog.autoGeneratePassword")}
                      >
                        <RefreshCwIcon className="h-4 w-4" />
                      </Button>
                    </div>
                    {state.fieldErrors.password ? (
                      <p className="text-sm text-destructive">{state.fieldErrors.password}</p>
                    ) : null}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">{t("branches.create.fields.address")}</Label>
                    <Input
                      id="address"
                      placeholder={t("branches.create.placeholders.address")}
                      value={state.form.address}
                      onChange={(e) => viewModel.setField("address", e.target.value)}
                      disabled={state.isSaving || state.isSaved}
                    />
                    {state.fieldErrors.address ? (
                      <p className="text-sm text-destructive">{state.fieldErrors.address}</p>
                    ) : null}
                  </div>

                  <div className="sm:col-span-2">
                    <LocationPicker
                      latitude={state.form.latitude}
                      longitude={state.form.longitude}
                      locationError={state.fieldErrors.location}
                      onChange={viewModel.setLocation}
                      disabled={state.isSaving || state.isSaved}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <ImageUpload
                      label={t("branches.create.branchImage")}
                      previewAlt={t("branches.create.branchImagePreview")}
                      value={state.form.imageUrl}
                      onChange={(url) => viewModel.setField("imageUrl", url)}
                      disabled={state.isSaving || state.isSaved}
                    />
                  </div>
                </div>

                <Separator />

                <div className="flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={goBack} disabled={state.isSaving}>
                    {t("common.cancel")}
                  </Button>
                  <Button type="submit" disabled={state.isSaving || state.isSaved}>
                    {state.isSaving ? <Loader2Icon className="animate-spin" /> : <PlusIcon />}
                    {state.isSaving ? t("branches.create.creating") : t("branches.createBranch")}
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
