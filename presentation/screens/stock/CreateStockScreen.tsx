"use client"

import { useRouter } from "next/navigation"
import { ArrowLeftIcon, Loader2Icon, PlusIcon } from "lucide-react"

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
import type { GetBooksUseCase } from "@/domain/usecases/books/GetBooksUseCase"
import type { StockUseCase } from "@/domain/usecases/stock/StockUseCase"
import { CreateStockFormFields } from "@/presentation/components/stock/StockFormFields"
import { useDashboardBreadcrumbs } from "@/presentation/hooks/useDashboardBreadcrumbs"
import { useTranslation } from "@/presentation/i18n/useTranslation"
import { useCreateStockViewModel } from "@/presentation/viewmodels/stock/useCreateStockViewModel"

type CreateStockScreenProps = {
  authUseCase: AuthUseCase
  getBooksUseCase: GetBooksUseCase
  stockUseCase: StockUseCase
}

function LoadingState() {
  return (
    <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
      <div className="space-y-2 pt-4">
        <Skeleton className="h-8 w-48" />
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

export function CreateStockScreen({
  authUseCase,
  getBooksUseCase,
  stockUseCase,
}: CreateStockScreenProps) {
  const router = useRouter()
  const viewModel = useCreateStockViewModel(
    authUseCase,
    getBooksUseCase,
    stockUseCase
  )
  const { t } = useTranslation()
  const { state, form } = viewModel

  useDashboardBreadcrumbs([
    { label: t("breadcrumbs.workspace"), href: "/dashboard" },
    { label: t("nav.stock"), href: "/dashboard/stock" },
    { label: t("stock.create.breadcrumb") },
  ])

  const goBack = () => router.push("/dashboard/stock")

  return (
    <>
      {state.isLoading ? <LoadingState /> : null}

      {(state.isReady || state.isSaving || state.isSaved) ? (
        <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
          <section className="flex items-center justify-between pt-4">
            <div>
              <h1 className="text-2xl font-semibold tracking-normal">
                {t("stock.create.title")}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {t("stock.create.subtitle")}
              </p>
            </div>
            <Button variant="outline" onClick={goBack}>
              <ArrowLeftIcon />
              {t("common.back")}
            </Button>
          </section>

          {state.isSaved ? (
            <Card className="rounded-lg border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950">
              <CardContent className="flex items-center gap-3 py-3">
                <p className="text-sm font-medium text-green-800 dark:text-green-200">
                  {t("stock.create.createSuccess")}
                </p>
                <Button size="sm" variant="outline" onClick={goBack}>
                  {t("stock.create.backToStock")}
                </Button>
              </CardContent>
            </Card>
          ) : null}

          {state.error ? (
            <Card className="rounded-lg border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950">
              <CardContent className="py-3">
                <p className="text-sm font-medium text-red-800 dark:text-red-200">{state.error}</p>
              </CardContent>
            </Card>
          ) : null}

          <Card className="rounded-lg">
            <CardHeader>
              <CardTitle>{t("stock.create.detailsTitle")}</CardTitle>
              <CardDescription>{t("stock.create.detailsDescription")}</CardDescription>
            </CardHeader>
            <CardContent>
              <CreateStockFormFields
                form={form}
                books={state.books}
                subBranches={state.subBranches}
                showSubBranchField={state.showSubBranchField}
                disabled={state.isSaving || state.isSaved}
                onSubmit={viewModel.save}
              >
                <Separator />
                <div className="flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={goBack} disabled={state.isSaving}>
                    {t("common.cancel")}
                  </Button>
                  <Button type="submit" disabled={state.isSaving || state.isSaved}>
                    {state.isSaving ? <Loader2Icon className="animate-spin" /> : <PlusIcon />}
                    {state.isSaving ? t("common.creating") : t("stock.create.createButton")}
                  </Button>
                </div>
              </CreateStockFormFields>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </>
  )
}
