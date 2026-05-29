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
import { BookFormFields } from "@/presentation/components/books/BookFormFields"
import { useDashboardBreadcrumbs } from "@/presentation/hooks/useDashboardBreadcrumbs"
import { useEditBookViewModel } from "@/presentation/viewmodels/books/useEditBookViewModel"

type EditBookScreenProps = {
  bookId: string
  getBooksUseCase: GetBooksUseCase
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

export function EditBookScreen({ bookId, getBooksUseCase }: EditBookScreenProps) {
  const router = useRouter()
  const viewModel = useEditBookViewModel(bookId, getBooksUseCase)
  const { state, form } = viewModel

  useDashboardBreadcrumbs([
    { label: "Workspace", href: "/dashboard" },
    { label: "Books", href: "/dashboard/books" },
    { label: "Edit Book" },
  ])

  const goBack = () => router.push(`/dashboard/books/${bookId}`)

  return (
    <>
      {state.isLoading ? <LoadingState /> : null}

      {state.isNotFound ? (
        <div className="flex flex-1 items-center justify-center p-4">
          <Card className="w-full max-w-md rounded-lg">
            <CardHeader>
              <CardTitle>Book not found</CardTitle>
              <CardDescription>
                The book you are looking for does not exist or has been removed.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" onClick={() => router.push("/dashboard/books")}>
                <ArrowLeftIcon />
                Back to books
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : null}

      {state.isError && !state.isReady ? (
        <div className="flex flex-1 items-center justify-center p-4">
          <Card className="w-full max-w-md rounded-lg">
            <CardHeader>
              <CardTitle>Something went wrong</CardTitle>
              <CardDescription>{state.error}</CardDescription>
            </CardHeader>
            <CardContent className="flex gap-3">
              <Button variant="outline" onClick={() => router.push("/dashboard/books")}>
                <ArrowLeftIcon />
                Back to books
              </Button>
              <Button onClick={() => router.refresh()}>
                <RefreshCwIcon />
                Retry
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : null}

      {(state.isReady || state.isSaving || state.isSaved) ? (
        <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
          <section className="flex items-center justify-between pt-4">
            <div>
              <h1 className="text-2xl font-semibold tracking-normal">Edit Book</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Update the book information.
              </p>
            </div>
            <Button variant="outline" onClick={goBack}>
              <ArrowLeftIcon />
              Back
            </Button>
          </section>

          {state.isSaved ? (
            <Card className="rounded-lg border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950">
              <CardContent className="flex items-center gap-3 py-3">
                <p className="text-sm font-medium text-green-800 dark:text-green-200">
                  Book updated successfully.
                </p>
                <Button size="sm" variant="outline" onClick={goBack}>
                  Back to book
                </Button>
              </CardContent>
            </Card>
          ) : null}

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
              <CardTitle>Book Details</CardTitle>
              <CardDescription>Modify the book details below.</CardDescription>
            </CardHeader>
            <CardContent>
              <BookFormFields
                form={form}
                authors={state.authors}
                translators={state.translators}
                categories={state.categories}
                languages={state.languages}
                disabled={state.isSaving || state.isSaved}
                onSubmit={viewModel.save}
                onAddLanguage={viewModel.addLanguage}
              >
                <Separator />
                <div className="flex justify-end gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    disabled={state.isSaving}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={state.isSaving || state.isSaved}>
                    {state.isSaving ? (
                      <Loader2Icon className="animate-spin" />
                    ) : (
                      <SaveIcon />
                    )}
                    {state.isSaving ? "Saving..." : "Save Changes"}
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
