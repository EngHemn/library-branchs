"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeftIcon, Loader2Icon, SaveIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import type { AuthUseCase } from "@/domain/usecases/auth/AuthUseCase"
import type { GetBillsUseCase } from "@/domain/usecases/bills/GetBillsUseCase"
import { BillFormFields } from "@/presentation/components/bills/BillFormFields"
import { buildCreateHrefWithReturn } from "@/presentation/components/shared/DashboardEntityLink"
import { useDashboardBreadcrumbs } from "@/presentation/hooks/useDashboardBreadcrumbs"
import { useTranslation } from "@/presentation/i18n/useTranslation"
import { useFormSubmitSuccess } from "@/presentation/hooks/useFormSubmitSuccess"
import { useEditBillViewModel } from "@/presentation/viewmodels/bills/useEditBillViewModel"

const CREATE_BOOK_PATH = "/dashboard/books/create"

type EditBillScreenProps = {
  billId: string
  authUseCase: AuthUseCase
  getBillsUseCase: GetBillsUseCase
}

function LoadingState() {
  return (
    <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
      <div className="space-y-2 pt-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>
      <Card className="rounded-lg">
        <CardContent className="space-y-6 py-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-10 w-full" />
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

export function EditBillScreen({
  billId,
  authUseCase,
  getBillsUseCase,
}: EditBillScreenProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const returnTo = searchParams.get("returnTo") ?? `/dashboard/bills/${billId}`
  const currentPath = `/dashboard/bills/${billId}/edit?returnTo=${encodeURIComponent(returnTo)}`
  const createBookHref = buildCreateHrefWithReturn(
    CREATE_BOOK_PATH,
    currentPath
  )
  const viewModel = useEditBillViewModel(billId, authUseCase, getBillsUseCase)
  const { t } = useTranslation()
  const { state, form } = viewModel

  useDashboardBreadcrumbs([
    { label: t("breadcrumbs.workspace"), href: "/dashboard" },
    { label: t("nav.bills"), href: "/dashboard/bills" },
    { label: t("bills.edit.breadcrumb") },
  ])

  const goBack = () => router.push(returnTo)

  useFormSubmitSuccess(state.isSaved, t("bills.edit.updateSuccess"))

  return (
    <>
      {state.isLoading ? <LoadingState /> : null}

      {state.isNotFound ? (
        <div className="flex flex-1 items-center justify-center p-4">
          <Card className="w-full max-w-md rounded-lg">
            <CardHeader>
              <CardTitle>{t("bills.notFoundTitle")}</CardTitle>
              <CardDescription>
                {t("bills.notFoundDescription")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                onClick={() => router.push("/dashboard/bills")}
              >
                <ArrowLeftIcon />
                {t("bills.backToBills")}
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : null}

      {state.isError ? (
        <div className="flex flex-1 items-center justify-center p-4">
          <Card className="w-full max-w-md rounded-lg">
            <CardHeader>
              <CardTitle>{t("bills.edit.loadErrorTitle")}</CardTitle>
              <CardDescription>{state.error}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" onClick={goBack}>
                <ArrowLeftIcon />
                {t("common.back")}
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : null}

      {state.isReady ? (
        <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
          <section className="flex items-center justify-between pt-4">
            <div>
              <h1 className="text-2xl font-semibold tracking-normal">
                {t("bills.edit.title")}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {t("bills.edit.subtitle")}
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
              <CardTitle>{t("bills.edit.detailsTitle")}</CardTitle>
              <CardDescription>
                {t("bills.edit.detailsDescription")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BillFormFields
                form={form}
                branchOptions={state.branchOptions}
                bookOptions={state.bookOptions}
                createBookHref={createBookHref}
                showBranchField={state.showBranchField}
                disabled={state.isSaving || state.isSaved}
                onSubmit={viewModel.save}
              >
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
                      <SaveIcon />
                    )}
                    {state.isSaving
                      ? t("common.saving")
                      : t("common.saveChanges")}
                  </Button>
                </div>
              </BillFormFields>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </>
  )
}
