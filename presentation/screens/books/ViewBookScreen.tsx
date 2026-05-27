"use client"

import { useState } from "react"
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
import type { GetBooksUseCase } from "@/domain/usecases/books/GetBooksUseCase"
import { BookBranchesTable } from "@/presentation/components/books/BookBranchesTable"
import { BookDetailHeader } from "@/presentation/components/books/BookDetailHeader"
import { BookingHistoryTable } from "@/presentation/components/books/BookingHistoryTable"
import { BookProfileCard } from "@/presentation/components/books/BookProfileCard"
import { BookSummaryCards } from "@/presentation/components/books/BookSummaryCards"
import { CreateBookingDialog } from "@/presentation/components/books/CreateBookingDialog"
import { useBookDetailViewModel } from "@/presentation/viewmodels/books/useBookDetailViewModel"

type ViewBookScreenProps = {
  bookId: string
  getBooksUseCase: GetBooksUseCase
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
            <Skeleton className="h-9 w-24" />
          </div>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
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
      <div className="grid gap-5 lg:grid-cols-2">
        <Skeleton className="min-h-96 rounded-lg" />
        <Skeleton className="min-h-96 rounded-lg" />
      </div>
      <Skeleton className="min-h-64 rounded-lg" />
    </div>
  )
}

export function ViewBookScreen({
  bookId,
  getBooksUseCase,
}: ViewBookScreenProps) {
  const router = useRouter()
  const viewModel = useBookDetailViewModel(bookId, getBooksUseCase)
  const { state } = viewModel

  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false)

  const goBack = () => {
    router.push("/dashboard/books")
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
                  <BreadcrumbLink href="/dashboard/books">
                    Books
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>
                    {state.bookDetail?.title ?? "Book Details"}
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
                <CardTitle>Book not found</CardTitle>
                <CardDescription>
                  The book you are looking for does not exist or has been
                  removed.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" onClick={goBack}>
                  <ArrowLeftIcon />
                  Back to books
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
                  Back to books
                </Button>
                <Button onClick={viewModel.reload}>
                  <RefreshCwIcon />
                  Retry
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : null}

        {state.isLoaded && state.bookDetail ? (
          <main className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
            <section className="pt-4">
              <BookDetailHeader
                book={state.bookDetail}
                onBack={goBack}
                onCreateBooking={() => setIsBookingDialogOpen(true)}
                onEdit={() => router.push(`/dashboard/books/${bookId}/edit`)}
              />
            </section>

            <BookSummaryCards book={state.bookDetail} />

            <section className="grid gap-5 grid-cols-1 lg:grid-cols-3">
  <div className="lg:col-span-1">
    <BookProfileCard book={state.bookDetail} />
  </div>

  <div className="lg:col-span-2">
    <BookBranchesTable
      branchStocks={state.bookDetail.branchStocks}
    />
  </div>
</section>

            <section>
              <BookingHistoryTable
                bookings={state.bookDetail.bookingHistory}
              />
            </section>
          </main>
        ) : null}
      </SidebarInset>

      <CreateBookingDialog
        open={isBookingDialogOpen}
        onOpenChange={setIsBookingDialogOpen}
        bookTitle={state.bookDetail?.title ?? ""}
        branchStocks={state.bookDetail?.branchStocks ?? []}
      />
    </SidebarProvider>
  )
}
