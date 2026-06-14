"use client"

import { useRouter, useSearchParams } from "next/navigation"
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
import type { GetBooksUseCase } from "@/domain/usecases/books/GetBooksUseCase"
import type { ShelfManagementUseCase } from "@/domain/usecases/shelves/ShelfManagementUseCase"
import { BookFormFields } from "@/presentation/components/books/BookFormFields"
import { useDashboardBreadcrumbs } from "@/presentation/hooks/useDashboardBreadcrumbs"
import { useFormSubmitSuccess } from "@/presentation/hooks/useFormSubmitSuccess"
import { useTranslation } from "@/presentation/i18n/useTranslation"
import { useCreateBookViewModel } from "@/presentation/viewmodels/books/useCreateBookViewModel"

type CreateBookScreenProps = {
  getBooksUseCase: GetBooksUseCase
  shelfManagementUseCase: ShelfManagementUseCase
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

export function CreateBookScreen({
  getBooksUseCase,
  shelfManagementUseCase,
}: CreateBookScreenProps) {
  const router = useRouter()
  const { t } = useTranslation()
  const searchParams = useSearchParams()
  const returnTo = searchParams.get("returnTo")
  const viewModel = useCreateBookViewModel(
    getBooksUseCase,
    shelfManagementUseCase
  )
  const { state, form } = viewModel

  useDashboardBreadcrumbs([
    { label: t("breadcrumbs.workspace"), href: "/dashboard" },
    { label: t("nav.books"), href: "/dashboard/books" },
    { label: t("books.create.breadcrumb") },
  ])

  const goBack = () => {
    if (returnTo) {
      router.push(returnTo)
      return
    }
    router.back()
  }

  useFormSubmitSuccess(
    state.isSaved,
    t("books.create.createSuccess"),
    returnTo ?? undefined
  )

  return (
    <>
      {state.isLoading ? <LoadingState /> : null}

      {(state.isReady || state.isSaving || state.isSaved) ? (
        <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
          <section className="flex items-center justify-between pt-4">
            <div>
              <h1 className="text-2xl font-semibold tracking-normal">
                {t("books.create.title")}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {t("books.create.description")}
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
              <CardTitle>{t("books.create.detailsTitle")}</CardTitle>
              <CardDescription>{t("books.create.detailsDescription")}</CardDescription>
            </CardHeader>
            <CardContent>
              <BookFormFields
                form={form}
                books={state.books}
                authors={state.authors}
                translators={state.translators}
                categories={state.categories}
                languages={state.languages}
                disabled={state.isSaving || state.isSaved}
                onSubmit={viewModel.save}
                onAddLanguage={viewModel.addLanguage}
                onBookSelect={viewModel.populateFromBook}
                locationOptions={state.locationOptions}
                locationManageError={state.locationManageError}
                isManagingLocation={state.isManagingLocation}
                onAddLocationValue={viewModel.addLocationValue}
                onUpdateLocationValue={viewModel.updateLocationValue}
                onDeleteLocationValue={viewModel.deleteLocationValue}
                onAddLocationStep={viewModel.addLocationStep}
                onUpdateLocationStep={viewModel.updateLocationStep}
                onDeleteLocationStep={viewModel.deleteLocationStep}
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
                  <Button type="submit" disabled={state.isSaving || state.isSaved}>
                    {state.isSaving ? <Loader2Icon className="animate-spin" /> : <PlusIcon />}
                    {state.isSaving ? t("common.creating") : t("books.create.createButton")}
                  </Button>
                </div>
              </BookFormFields>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </>
  )
}
