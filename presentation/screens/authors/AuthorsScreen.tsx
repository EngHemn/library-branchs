"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PlusIcon, RefreshCwIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { TooltipProvider } from "@/components/ui/tooltip"
import type { Author } from "@/domain/entities/author/Author"
import type { GetAuthorsUseCase } from "@/domain/usecases/authors/GetAuthorsUseCase"
import { AuthorsFilters } from "@/presentation/components/authors/AuthorsFilters"
import { AuthorsTable } from "@/presentation/components/authors/AuthorsTable"
import { useDashboardBreadcrumbs } from "@/presentation/hooks/useDashboardBreadcrumbs"
import { useTranslation } from "@/presentation/i18n/useTranslation"
import { useAuthorsViewModel } from "@/presentation/viewmodels/authors/useAuthorsViewModel"

type AuthorsScreenProps = {
  getAuthorsUseCase: GetAuthorsUseCase
}

function LoadingAuthorsScreen() {
  return (
    <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
      <div className="space-y-2 pt-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>
      <Skeleton className="h-16 rounded-lg" />
      <Skeleton className="min-h-96 rounded-lg" />
    </div>
  )
}

export function AuthorsScreen({ getAuthorsUseCase }: AuthorsScreenProps) {
  const router = useRouter()
  const { t } = useTranslation()
  const viewModel = useAuthorsViewModel(getAuthorsUseCase)
  const { state } = viewModel
  const [deleteAuthor, setDeleteAuthor] = useState<Author | null>(null)

  useDashboardBreadcrumbs([
    { label: t("breadcrumbs.workspace"), href: "/dashboard" },
    { label: t("nav.authors") },
  ])

  const handleConfirmDelete = () => {
    if (!deleteAuthor) return
    void (async () => {
      await viewModel.deleteAuthor(deleteAuthor.id)
      setDeleteAuthor(null)
    })()
  }

  return (
    <>
      {state.isLoading ? <LoadingAuthorsScreen /> : null}

      {state.error ? (
        <div className="flex flex-1 items-center justify-center p-4">
          <Card className="w-full max-w-md rounded-lg">
            <CardHeader>
              <CardTitle>{t("authors.unavailable")}</CardTitle>
              <CardDescription>{state.error}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => void viewModel.reload()}>
                <RefreshCwIcon />
                {t("common.retry")}
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : null}

      {state.isReady ? (
        <TooltipProvider>
          <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
            <section className="flex flex-col gap-3 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold tracking-normal">
                  {t("authors.title")}
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  {t("authors.subtitle")}
                </p>
              </div>
              <Button onClick={() => router.push("/dashboard/authors/create")}>
                <PlusIcon />
                {t("authors.addAuthor")}
              </Button>
            </section>

            <AuthorsFilters
              searchQuery={state.searchQuery}
              statusFilter={state.statusFilter}
              onSearchQueryChange={viewModel.setSearchQuery}
              onStatusFilterChange={viewModel.setStatusFilter}
            />

            <AuthorsTable
              authors={state.filteredAuthors}
              onView={(author) =>
                router.push(`/dashboard/authors/${author.id}`)
              }
              onEdit={(author) =>
                router.push(`/dashboard/authors/${author.id}/edit`)
              }
              onDelete={(author) => setDeleteAuthor(author)}
            />
          </div>
        </TooltipProvider>
      ) : null}

      <Dialog
        open={deleteAuthor !== null}
        onOpenChange={(isOpen) => {
          if (!isOpen) setDeleteAuthor(null)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("authors.deleteDialog.title")}</DialogTitle>
            <DialogDescription>
              {t("authors.deleteDialog.description", {
                name: deleteAuthor?.name ?? "",
              })}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteAuthor(null)}>
              {t("common.cancel")}
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={state.isDeleting}
            >
              {t("common.delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
