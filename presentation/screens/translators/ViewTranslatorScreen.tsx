"use client"

import { useRouter } from "next/navigation"
import { ArrowLeftIcon, RefreshCwIcon } from "lucide-react"

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
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Skeleton } from "@/components/ui/skeleton"
import type { GetTranslatorsUseCase } from "@/domain/usecases/translators/GetTranslatorsUseCase"
import { TranslatorDetailHeader } from "@/presentation/components/translators/TranslatorDetailHeader"
import { TranslatorProfileCard } from "@/presentation/components/translators/TranslatorProfileCard"
import { TranslatorBooksTable } from "@/presentation/components/translators/TranslatorBooksTable"
import { TranslatorSummaryCards } from "@/presentation/components/translators/TranslatorSummaryCards"
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

export function ViewTranslatorScreen({
  translatorId,
  getTranslatorsUseCase,
}: ViewTranslatorScreenProps) {
  const router = useRouter()
  const viewModel = useTranslatorDetailViewModel(translatorId, getTranslatorsUseCase)
  const { state } = viewModel

  const goBack = () => {
    router.push("/dashboard/translators")
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
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/dashboard/translators">
                    Translators
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>
                    {state.translator?.name ?? "Translator Details"}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        {state.isLoading ? <LoadingState /> : null}

        {state.isNotFound ? (
          <div className="flex flex-1 items-center justify-center p-4">
            <Card className="w-full max-w-md rounded-lg">
              <CardHeader>
                <CardTitle>Translator not found</CardTitle>
                <CardDescription>
                  The translator you are looking for does not exist or has been
                  removed.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" onClick={goBack}>
                  <ArrowLeftIcon />
                  Back to translators
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : null}

        {state.isError ? (
          <div className="flex flex-1 items-center justify-center p-4">
            <Card className="w-full max-w-md rounded-lg">
              <CardHeader>
                <CardTitle>Something went wrong</CardTitle>
                <CardDescription>{state.error}</CardDescription>
              </CardHeader>
              <CardContent className="flex gap-3">
                <Button variant="outline" onClick={goBack}>
                  <ArrowLeftIcon />
                  Back to translators
                </Button>
                <Button onClick={() => void viewModel.reload()}>
                  <RefreshCwIcon />
                  Retry
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
                onEdit={() =>
                  router.push(`/dashboard/translators/${translatorId}/edit`)
                }
              />
            </section>
            <TranslatorSummaryCards translator={state.translator} />

            <section className="max-w-3xl">
              <TranslatorProfileCard translator={state.translator} />
            </section>

            <section>
              <TranslatorBooksTable
                title="Translated Books"
                description={`${state.translator.translatedBooks.length.toLocaleString()} book records`}
                books={state.translator.translatedBooks}
                emptyDescription="This translator has not translated any books yet."
              />
            </section>
          </main>
        ) : null}
      </SidebarInset>
    </SidebarProvider>
  )
}
