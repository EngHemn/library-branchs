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
import type { GetAuthorsUseCase } from "@/domain/usecases/authors/GetAuthorsUseCase"
import { AuthorDetailHeader } from "@/presentation/components/authors/AuthorDetailHeader"
import { AuthorProfileCard } from "@/presentation/components/authors/AuthorProfileCard"
import { AuthorBooksTabs } from "@/presentation/components/authors/AuthorBooksTabs"
import { AuthorSummaryCards } from "@/presentation/components/authors/AuthorSummaryCards"
import { useAuthorDetailViewModel } from "@/presentation/viewmodels/authors/useAuthorDetailViewModel"

type ViewAuthorScreenProps = {
  authorId: string
  getAuthorsUseCase: GetAuthorsUseCase
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
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 2 }).map((_, index) => (
          <Card key={index} className="rounded-lg">
            <CardContent className="flex items-center gap-4 py-4">
              <Skeleton className="size-10 shrink-0 rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-6 w-14" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Skeleton className="min-h-96 rounded-lg" />
    </div>
  )
}

export function ViewAuthorScreen({
  authorId,
  getAuthorsUseCase,
}: ViewAuthorScreenProps) {
  const router = useRouter()
  const viewModel = useAuthorDetailViewModel(authorId, getAuthorsUseCase)
  const { state } = viewModel

  const goBack = () => {
    router.push("/dashboard/authors")
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
                  <BreadcrumbLink href="/dashboard/authors">
                    Authors
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>
                    {state.author?.name ?? "Author Details"}
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
                <CardTitle>Author not found</CardTitle>
                <CardDescription>
                  The author you are looking for does not exist or has been
                  removed.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" onClick={goBack}>
                  <ArrowLeftIcon />
                  Back to authors
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
                  Back to authors
                </Button>
                <Button onClick={() => void viewModel.reload()}>
                  <RefreshCwIcon />
                  Retry
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : null}

        {state.isLoaded && state.author ? (
          <main className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
            <section className="pt-4">
              <AuthorDetailHeader
                author={state.author}
                onBack={goBack}
                onEdit={() =>
                  router.push(`/dashboard/authors/${authorId}/edit`)
                }
              />
            </section>
            <AuthorSummaryCards author={state.author} />

            <section className="max-w-3xl">
              <AuthorProfileCard author={state.author} />
            </section>

            <section>
              <AuthorBooksTabs author={state.author} />
            </section>
          </main>
        ) : null}
      </SidebarInset>
    </SidebarProvider>
  )
}
