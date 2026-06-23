"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeftIcon,
  EyeIcon,
  EyeOffIcon,
  Loader2Icon,
  PlusIcon,
  RefreshCwIcon,
} from "lucide-react"

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
import { ImageUpload } from "@/components/ui/image-upload"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import type { AuthUseCase } from "@/domain/usecases/auth/AuthUseCase"
import type { BranchManagementUseCase } from "@/domain/usecases/branch/BranchManagementUseCase"
import type { StaffManagementUseCase } from "@/domain/usecases/staff/StaffManagementUseCase"
import { useDashboardBreadcrumbs } from "@/presentation/hooks/useDashboardBreadcrumbs"
import { useFormSubmitSuccess } from "@/presentation/hooks/useFormSubmitSuccess"
import { useTranslation } from "@/presentation/i18n/useTranslation"
import { useCreateStaffViewModel } from "@/presentation/viewmodels/staff-management/useCreateStaffViewModel"

type CreateStaffScreenProps = {
  authUseCase: AuthUseCase
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

export function CreateStaffScreen({
  authUseCase,
  staffManagementUseCase,
  branchManagementUseCase,
}: CreateStaffScreenProps) {
  const router = useRouter()
  const { t } = useTranslation()
  const viewModel = useCreateStaffViewModel(
    authUseCase,
    staffManagementUseCase,
    branchManagementUseCase
  )
  const { state } = viewModel
  const [showPassword, setShowPassword] = useState(false)

  useDashboardBreadcrumbs([
    { label: t("breadcrumbs.workspace"), href: "/dashboard" },
    { label: t("nav.staff"), href: "/dashboard/staff" },
    { label: t("staff.create.breadcrumb") },
  ])

  const goBack = () => router.push("/dashboard/staff")

  useFormSubmitSuccess(state.isSaved, t("staff.create.createSuccess"))

  return (
    <>
      {state.isLoading ? <LoadingState /> : null}

      {state.isReady || state.isSaving || state.isSaved ? (
        <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
          <section className="flex items-center justify-between pt-4">
            <div>
              <h1 className="text-2xl font-semibold tracking-normal">
                {t("staff.create.title")}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {t("staff.create.description")}
              </p>
            </div>
            <Button variant="outline" onClick={goBack}>
              <ArrowLeftIcon />
              {t("common.back")}
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
              <CardTitle>{t("staff.create.detailsTitle")}</CardTitle>
              <CardDescription>
                {t("staff.create.detailsDescription")}
              </CardDescription>
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
                    <Label htmlFor="staffName">
                      {t("staff.fields.fullName")}
                    </Label>
                    <Input
                      id="staffName"
                      placeholder={t("staff.placeholders.fullName")}
                      value={state.form.staffName}
                      onChange={(e) =>
                        viewModel.setField("staffName", e.target.value)
                      }
                      disabled={state.isSaving || state.isSaved}
                    />
                    {state.fieldErrors.staffName ? (
                      <p className="text-sm text-destructive">
                        {state.fieldErrors.staffName}
                      </p>
                    ) : null}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role">{t("staff.fields.role")}</Label>
                    <Select
                      value={state.form.role}
                      onValueChange={(value) =>
                        viewModel.setField("role", value)
                      }
                      disabled={state.isSaving || state.isSaved}
                    >
                      <SelectTrigger id="role">
                        <SelectValue
                          placeholder={t("staff.placeholders.selectRole")}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {state.showBranchAdminRole ? (
                          <SelectItem value="branch_admin">
                            {t("staff.roles.branchAdmin")}
                          </SelectItem>
                        ) : null}
                        <SelectItem value="sub_branch_admin">
                          {t("staff.roles.subBranchAdmin")}
                        </SelectItem>
                        <SelectItem value="staff">
                          {t("staff.roles.staff")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {state.fieldErrors.role ? (
                      <p className="text-sm text-destructive">
                        {state.fieldErrors.role}
                      </p>
                    ) : null}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">{t("staff.fields.email")}</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder={t("staff.placeholders.email")}
                      value={state.form.email}
                      onChange={(e) =>
                        viewModel.setField("email", e.target.value)
                      }
                      disabled={state.isSaving || state.isSaved}
                    />
                    {state.fieldErrors.email ? (
                      <p className="text-sm text-destructive">
                        {state.fieldErrors.email}
                      </p>
                    ) : null}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">{t("staff.fields.phone")}</Label>
                    <Input
                      id="phone"
                      placeholder={t("staff.placeholders.phone")}
                      value={state.form.phone}
                      onChange={(e) =>
                        viewModel.setField("phone", e.target.value)
                      }
                      disabled={state.isSaving || state.isSaved}
                    />
                    {state.fieldErrors.phone ? (
                      <p className="text-sm text-destructive">
                        {state.fieldErrors.phone}
                      </p>
                    ) : null}
                  </div>

                  {state.showBranchField ? (
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="branch">{t("staff.fields.branch")}</Label>
                      <Select
                        value={state.form.branchId}
                        onValueChange={(value) =>
                          viewModel.setField("branchId", value)
                        }
                        disabled={state.isSaving || state.isSaved}
                      >
                        <SelectTrigger id="branch">
                          <SelectValue
                            placeholder={t("staff.placeholders.selectBranch")}
                          />
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
                        <p className="text-sm text-destructive">
                          {state.fieldErrors.branch}
                        </p>
                      ) : null}
                    </div>
                  ) : null}

                  <div className="space-y-2 sm:col-span-2">
                    <ImageUpload
                      label={t("staff.fields.profilePhoto")}
                      previewAlt={t("staff.fields.profilePhotoPreview")}
                      value={state.form.imageUrl}
                      onChange={(url) => viewModel.setField("imageUrl", url)}
                      disabled={state.isSaving || state.isSaved}
                    />
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="password">
                      {t("staff.fields.password")}
                    </Label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder={t("staff.placeholders.password")}
                          value={state.form.password}
                          onChange={(e) =>
                            viewModel.setField("password", e.target.value)
                          }
                          disabled={state.isSaving || state.isSaved}
                          className="pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((v) => !v)}
                          className="absolute inset-y-0 right-2 flex items-center text-muted-foreground hover:text-foreground"
                          tabIndex={-1}
                        >
                          {showPassword ? (
                            <EyeOffIcon className="h-4 w-4" />
                          ) : (
                            <EyeIcon className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={viewModel.autoGeneratePassword}
                        disabled={state.isSaving || state.isSaved}
                        title={t("staff.create.autoGeneratePassword")}
                      >
                        <RefreshCwIcon className="h-4 w-4" />
                      </Button>
                    </div>
                    {state.fieldErrors.password ? (
                      <p className="text-sm text-destructive">
                        {state.fieldErrors.password}
                      </p>
                    ) : null}
                  </div>
                </div>

                <Separator />

                <div className="flex justify-end gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={goBack}
                    disabled={state.isSaving}
                  >
                    {t("common.cancel")}
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
                    {state.isSaving
                      ? t("common.creating")
                      : t("staff.create.createButton")}
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
