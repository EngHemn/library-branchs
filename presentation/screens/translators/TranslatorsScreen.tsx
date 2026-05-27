"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PlusIcon, RefreshCwIcon } from "lucide-react"

import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
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
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Skeleton } from "@/components/ui/skeleton"
import { TooltipProvider } from "@/components/ui/tooltip"
import type { Translator } from "@/domain/entities/translator/Translator"
import type { GetTranslatorsUseCase } from "@/domain/usecases/translators/GetTranslatorsUseCase"
import { TranslatorsFilters } from "@/presentation/components/translators/TranslatorsFilters"
import { TranslatorsTable } from "@/presentation/components/translators/TranslatorsTable"
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
  const viewModel = useTranslatorsViewModel(getTranslatorsUseCase)
  const { state } = viewModel
  const [deleteTranslator, setDeleteTranslator] = useState<Translator | null>(
    null
  )

  const handleConfirmDelete = () => {
    if (!deleteTranslator) return
    void (async () => {
      await viewModel.deleteTranslator(deleteTranslator.id)
      setDeleteTranslator(null)
    })()
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-vertical:h-4 data-vertical:self-auto"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/dashboard">Workspace</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Translators</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        {state.isLoading ? <LoadingTranslatorsScreen /> : null}

        {state.error ? (
          <div className="flex flex-1 items-center justify-center p-4">
            <Card className="w-full max-w-md rounded-lg">
              <CardHeader>
                <CardTitle>Translators unavailable</CardTitle>
                <CardDescription>{state.error}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => void viewModel.reload()}>
                  <RefreshCwIcon />
                  Retry
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
                  <h1 className="text-2xl font-bold tracking-normal">Translators</h1>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Manage translators and their profiles.
                  </p>
                </div>
                <Button onClick={() => router.push("/dashboard/translators/create")}>
                  <PlusIcon />
                  Add Translator
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
                onView={(translator) => {
                  router.push(`/dashboard/translators/${translator.id}`)
                }}
                onEdit={(translator) => {
                  router.push(`/dashboard/translators/${translator.id}/edit`)
                }}
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
              <DialogTitle>Delete Translator</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete &ldquo;{deleteTranslator?.name}
                &rdquo;? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteTranslator(null)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleConfirmDelete}
                disabled={state.isDeleting}
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </SidebarInset>
    </SidebarProvider>
  )
}
