"use client"

import { useRouter } from "next/navigation"
import { ArrowLeftIcon, RefreshCwIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import type { GetTranslatorsUseCase } from "@/domain/usecases/translators/GetTranslatorsUseCase"
import { TranslatorDetailHeader } from "@/presentation/components/translators/TranslatorDetailHeader"
import { TranslatorProfileCard } from "@/presentation/components/translators/TranslatorProfileCard"
import { TranslatorBooksTable } from "@/presentation/components/translators/TranslatorBooksTable"
import { TranslatorSummaryCards } from "@/presentation/components/translators/TranslatorSummaryCards"
import { useDashboardBreadcrumbs } from "@/presentation/hooks/useDashboardBreadcrumbs"
import { useTranslation } from "@/presentation/i18n/useTranslation"
import { useTranslatorDetailViewModel } from "@/presentation/viewmodels/translators/useTranslatorDetailViewModel"

type ViewTranslatorScreenProps = {
  translatorId: string
  getTranslatorsUseCase: GetTranslatorsUseCase
}

function LoadingState() {
  return (
    <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
      <div className="flex gap-4 pt-4">
        <Skeleton className="size-20 shrink-0 rounded-lg sm:size-24" />
        <div className="flex flex-1 flex-col gap-3">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96 max-w-full" />
          <div className="flex gap-2">
            <Skeleton className="h-9 w-28" />
            <Skeleton className="h-9 w-32" />
          </div>
        </div>
      </div>
      <Skeleton className="h-24 max-w-sm rounded-lg" />
      <Skeleton className="min-h-96 rounded-lg" />
    </div>
  )
}

export function ViewTranslatorScreen({ translatorId, getTranslatorsUseCase }: ViewTranslatorScreenProps) {
  const router = useRouter()
  const { t } = useTranslation()
  const viewModel = useTranslatorDetailViewModel(translatorId, getTranslatorsUseCase)
  const { state } = viewModel

  useDashboardBreadcrumbs([
    { label: t("breadcrumbs.workspace"), href: "/dashboard" },
    { label: t("nav.translators"), href: "/dashboard/translators" },
    { label: state.translator?.name ?? t("translators.view.breadcrumbFallback") },
  ])

  const goBack = () => router.back()

  return (
    <>
      {state.isLoading ? <LoadingState /> : null}

      {state.isNotFound ? (
        <div className="flex flex-1 items-center justify-center p-4">
          <Card className="w-full max-w-md rounded-lg">
            <CardHeader>
              <CardTitle>{t("translators.notFoundTitle")}</CardTitle>
              <CardDescription>
                {t("translators.notFoundDescription")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" onClick={goBack}>
                <ArrowLeftIcon />
                {t("translators.backToTranslators")}
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : null}

      {state.isError ? (
        <div className="flex flex-1 items-center justify-center p-4">
          <Card className="w-full max-w-md rounded-lg">
            <CardHeader>
              <CardTitle>{t("translators.somethingWentWrong")}</CardTitle>
              <CardDescription>{state.error}</CardDescription>
            </CardHeader>
            <CardContent className="flex gap-3">
              <Button variant="outline" onClick={goBack}>
                <ArrowLeftIcon />
                {t("translators.backToTranslators")}
              </Button>
              <Button onClick={() => void viewModel.reload()}>
                <RefreshCwIcon />
                {t("common.retry")}
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : null}

      {state.isLoaded && state.translator ? (
        <main className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
          <section className="pt-4">
            <TranslatorDetailHeader
              translator={state.translator}
              onBack={goBack}
              onEdit={() => router.push(`/dashboard/translators/${translatorId}/edit`)}
            />
          </section>
          <TranslatorSummaryCards translator={state.translator} />

          <section className="max-w-3xl">
            <TranslatorProfileCard translator={state.translator} />
          </section>

          <section>
            <TranslatorBooksTable
              title={t("translators.books.translatedTitle")}
              description={t("translators.books.recordCount", {
                count: state.translator.translatedBooks.length.toLocaleString(),
              })}
              books={state.translator.translatedBooks}
              emptyDescription={t("translators.books.emptyTranslated")}
            />
          </section>
        </main>
      ) : null}
    </>
  )
}
