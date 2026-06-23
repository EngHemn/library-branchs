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
import type { Translator } from "@/domain/entities/translator/Translator"
import type { GetTranslatorsUseCase } from "@/domain/usecases/translators/GetTranslatorsUseCase"
import { TranslatorsFilters } from "@/presentation/components/translators/TranslatorsFilters"
import { TranslatorsTable } from "@/presentation/components/translators/TranslatorsTable"
import { useDashboardBreadcrumbs } from "@/presentation/hooks/useDashboardBreadcrumbs"
import { useTranslation } from "@/presentation/i18n/useTranslation"
import { useTranslatorsViewModel } from "@/presentation/viewmodels/translators/useTranslatorsViewModel"

type TranslatorsScreenProps = {
  getTranslatorsUseCase: GetTranslatorsUseCase
}

function LoadingTranslatorsScreen() {
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

export function TranslatorsScreen({
  getTranslatorsUseCase,
}: TranslatorsScreenProps) {
  const router = useRouter()
  const { t } = useTranslation()
  const viewModel = useTranslatorsViewModel(getTranslatorsUseCase)
  const { state } = viewModel
  const [deleteTranslator, setDeleteTranslator] = useState<Translator | null>(
    null
  )

  useDashboardBreadcrumbs([
    { label: t("breadcrumbs.workspace"), href: "/dashboard" },
    { label: t("nav.translators") },
  ])

  const handleConfirmDelete = () => {
    if (!deleteTranslator) return
    void (async () => {
      await viewModel.deleteTranslator(deleteTranslator.id)
      setDeleteTranslator(null)
    })()
  }

  return (
    <>
      {state.isLoading ? <LoadingTranslatorsScreen /> : null}

      {state.error ? (
        <div className="flex flex-1 items-center justify-center p-4">
          <Card className="w-full max-w-md rounded-lg">
            <CardHeader>
              <CardTitle>{t("translators.unavailable")}</CardTitle>
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
                  {t("translators.title")}
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  {t("translators.subtitle")}
                </p>
              </div>
              <Button
                onClick={() => router.push("/dashboard/translators/create")}
              >
                <PlusIcon />
                {t("translators.addTranslator")}
              </Button>
            </section>

            <TranslatorsFilters
              searchQuery={state.searchQuery}
              statusFilter={state.statusFilter}
              languageFilter={state.languageFilter}
              languages={state.languages}
              onSearchQueryChange={viewModel.setSearchQuery}
              onStatusFilterChange={viewModel.setStatusFilter}
              onLanguageFilterChange={viewModel.setLanguageFilter}
            />

            <TranslatorsTable
              translators={state.filteredTranslators}
              onView={(translator) =>
                router.push(`/dashboard/translators/${translator.id}`)
              }
              onEdit={(translator) =>
                router.push(`/dashboard/translators/${translator.id}/edit`)
              }
              onDelete={(translator) => setDeleteTranslator(translator)}
            />
          </div>
        </TooltipProvider>
      ) : null}

      <Dialog
        open={deleteTranslator !== null}
        onOpenChange={(isOpen) => {
          if (!isOpen) setDeleteTranslator(null)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("translators.deleteDialog.title")}</DialogTitle>
            <DialogDescription>
              {t("translators.deleteDialog.description", {
                name: deleteTranslator?.name ?? "",
              })}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTranslator(null)}>
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
