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
import type { GetAuthorsUseCase } from "@/domain/usecases/authors/GetAuthorsUseCase"
import { AuthorBooksTabs } from "@/presentation/components/authors/AuthorBooksTabs"
import { AuthorDetailHeader } from "@/presentation/components/authors/AuthorDetailHeader"
import { AuthorProfileCard } from "@/presentation/components/authors/AuthorProfileCard"
import { AuthorSummaryCards } from "@/presentation/components/authors/AuthorSummaryCards"
import { useDashboardBreadcrumbs } from "@/presentation/hooks/useDashboardBreadcrumbs"
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

export function ViewAuthorScreen({ authorId, getAuthorsUseCase }: ViewAuthorScreenProps) {
  const router = useRouter()
  const viewModel = useAuthorDetailViewModel(authorId, getAuthorsUseCase)
  const { state } = viewModel

  useDashboardBreadcrumbs([
    { label: "Workspace", href: "/dashboard" },
    { label: "Authors", href: "/dashboard/authors" },
    { label: state.author?.name ?? "Author Details" },
  ])

  const goBack = () => router.push("/dashboard/authors")

  return (
    <>
      {state.isLoading ? <LoadingState /> : null}

      {state.isNotFound ? (
        <div className="flex flex-1 items-center justify-center p-4">
          <Card className="w-full max-w-md rounded-lg">
            <CardHeader>
              <CardTitle>Author not found</CardTitle>
              <CardDescription>
                The author you are looking for does not exist or has been removed.
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
              onEdit={() => router.push(`/dashboard/authors/${authorId}/edit`)}
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
    </>
  )
}
