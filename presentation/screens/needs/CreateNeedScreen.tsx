"use client"

import { useRouter } from "next/navigation"
import { ArrowLeftIcon, Loader2Icon, SaveIcon, SendIcon } from "lucide-react"

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
import { useTranslation } from "@/presentation/i18n/useTranslation"
import { useFormSubmitSuccess } from "@/presentation/hooks/useFormSubmitSuccess"
import { useCreateNeedViewModel } from "@/presentation/viewmodels/needs/useCreateNeedViewModel"

type CreateNeedScreenProps = {
  authUseCase: AuthUseCase
  needManagementUseCase: NeedManagementUseCase
}

function LoadingState() {
  return (
    <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
      <Skeleton className="mt-4 h-8 w-48" />
      <Skeleton className="h-96 rounded-lg" />
    </div>
  )
}

export function CreateNeedScreen({
  authUseCase,
  needManagementUseCase,
}: CreateNeedScreenProps) {
  const router = useRouter()
  const viewModel = useCreateNeedViewModel(authUseCase, needManagementUseCase)
  const { t } = useTranslation()
  const { state, form } = viewModel

  useDashboardBreadcrumbs([
    { label: t("breadcrumbs.workspace"), href: "/dashboard" },
    { label: t("nav.needs"), href: dashboardPaths.needs.list },
    { label: t("needs.create.breadcrumb") },
  ])

  useFormSubmitSuccess(
    state.isSaved,
    t("needs.createSuccess"),
    dashboardPaths.needs.list
  )

  return (
    <>
      {state.isLoading ? <LoadingState /> : null}

      {state.isReady || state.isSaving ? (
        <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
          <section className="flex items-center justify-between pt-4">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">
                {t("needs.create.title")}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {t("needs.create.subtitle")}
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => router.push(dashboardPaths.needs.list)}
            >
              <ArrowLeftIcon />
              {t("needs.back")}
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
              <CardTitle>{t("needs.create.detailsTitle")}</CardTitle>
              <CardDescription>
                {t("needs.create.detailsDescription")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <NeedFormFields
                form={form}
                branchOptions={state.branchOptions}
                requestedByOptions={state.requestedByOptions}
                showBranchField={state.showBranchField}
                disabled={state.isSaving}
                onSubmit={() => undefined}
              >
                <div className="flex flex-wrap justify-end gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={state.isSaving}
                    onClick={form.handleSubmit(
                      (values) => void viewModel.saveDraft(values)
                    )}
                  >
                    {state.isSaving ? (
                      <Loader2Icon className="animate-spin" />
                    ) : (
                      <SaveIcon />
                    )}
                    {t("needs.saveDraft")}
                  </Button>
                  <Button
                    type="button"
                    disabled={state.isSaving}
                    onClick={form.handleSubmit(
                      (values) => void viewModel.submitRequest(values)
                    )}
                  >
                    {state.isSaving ? (
                      <Loader2Icon className="animate-spin" />
                    ) : (
                      <SendIcon />
                    )}
                    {t("needs.submitRequest")}
                  </Button>
                </div>
              </NeedFormFields>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </>
  )
}
