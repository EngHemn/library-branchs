"use client"

import { useRouter } from "next/navigation"
import { ArrowLeftIcon, Loader2Icon, RefreshCwIcon, SaveIcon } from "lucide-react"

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
import { useEditBookViewModel } from "@/presentation/viewmodels/books/useEditBookViewModel"

type EditBookScreenProps = {
  bookId: string
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

export function EditBookScreen({
  bookId,
  getBooksUseCase,
  shelfManagementUseCase,
}: EditBookScreenProps) {
  const router = useRouter()
  const { t } = useTranslation()
  const viewModel = useEditBookViewModel(
    bookId,
    getBooksUseCase,
    shelfManagementUseCase
  )
  const { state, form } = viewModel

  useDashboardBreadcrumbs([
    { label: t("breadcrumbs.workspace"), href: "/dashboard" },
    { label: t("nav.books"), href: "/dashboard/books" },
    { label: t("books.edit.breadcrumb") },
  ])

  const goBack = () => router.push(`/dashboard/books/${bookId}`)

  useFormSubmitSuccess(state.isSaved, t("books.edit.updateSuccess"))

  return (
    <>
      {state.isLoading ? <LoadingState /> : null}

      {state.isNotFound ? (
        <div className="flex flex-1 items-center justify-center p-4">
          <Card className="w-full max-w-md rounded-lg">
            <CardHeader>
              <CardTitle>{t("books.view.notFoundTitle")}</CardTitle>
              <CardDescription>
                {t("books.view.notFoundDescription")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" onClick={() => router.back()}>
                <ArrowLeftIcon />
                {t("books.view.backToBooks")}
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : null}

      {state.isError && !state.isReady ? (
        <div className="flex flex-1 items-center justify-center p-4">
          <Card className="w-full max-w-md rounded-lg">
            <CardHeader>
              <CardTitle>{t("common.somethingWentWrong")}</CardTitle>
              <CardDescription>{state.error}</CardDescription>
            </CardHeader>
            <CardContent className="flex gap-3">
              <Button variant="outline" onClick={() => router.back()}>
                <ArrowLeftIcon />
                {t("books.view.backToBooks")}
              </Button>
              <Button onClick={() => router.refresh()}>
                <RefreshCwIcon />
                {t("common.retry")}
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : null}

      {(state.isReady || state.isSaving || state.isSaved) ? (
        <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
          <section className="flex items-center justify-between pt-4">
            <div>
              <h1 className="text-2xl font-semibold tracking-normal">
                {t("books.edit.title")}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {t("books.edit.description")}
              </p>
            </div>
            <Button variant="outline" onClick={goBack}>
              <ArrowLeftIcon />
              {t("common.back")}
            </Button>
          </section>

          {state.error && state.isReady ? (
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
              <CardTitle>{t("books.edit.detailsTitle")}</CardTitle>
              <CardDescription>{t("books.edit.detailsDescription")}</CardDescription>
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
                excludeBookId={bookId}
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
                    onClick={() => router.back()}
                    disabled={state.isSaving}
                  >
                    {t("common.cancel")}
                  </Button>
                  <Button type="submit" disabled={state.isSaving || state.isSaved}>
                    {state.isSaving ? (
                      <Loader2Icon className="animate-spin" />
                    ) : (
                      <SaveIcon />
                    )}
                    {state.isSaving ? t("common.saving") : t("common.saveChanges")}
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
