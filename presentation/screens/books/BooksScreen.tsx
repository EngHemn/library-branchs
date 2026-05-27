"use client"

import { useEffect, useState } from "react"
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
import type { Book } from "@/domain/entities/book/Book"
import type { AuthUseCase } from "@/domain/usecases/auth/AuthUseCase"
import type { GetBooksUseCase } from "@/domain/usecases/books/GetBooksUseCase"
import { BooksFilters } from "@/presentation/components/books/BooksFilters"
import { BooksTable } from "@/presentation/components/books/BooksTable"
import { useBooksViewModel } from "@/presentation/viewmodels/books/useBooksViewModel"

function getCreateBookingHref(bookId: string, returnTo: string) {
  const params = new URLSearchParams({ bookId, returnTo })
  return `/dashboard/bookings/create?${params.toString()}`
}

type BooksScreenProps = {
  authUseCase: AuthUseCase
  getBooksUseCase: GetBooksUseCase
}

function LoadingBooksScreen() {
  return (
    <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
      <div className="space-y-2 pt-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>
      <Skeleton className="h-10 rounded-lg" />
      <Skeleton className="min-h-96 rounded-lg" />
    </div>
  )
}

export function BooksScreen({
  authUseCase,
  getBooksUseCase,
}: BooksScreenProps) {
  const router = useRouter()
  const viewModel = useBooksViewModel(authUseCase, getBooksUseCase)
  const { state } = viewModel

  useEffect(() => {
    if (state.isUnauthenticated) {
      router.replace("/")
    }
  }, [router, state.isUnauthenticated])

  const user = state.user

  const [deleteBook, setDeleteBook] = useState<Book | null>(null)

  const handleConfirmDelete = () => {
    if (deleteBook) {
      void viewModel.deleteBook(deleteBook.id)
      setDeleteBook(null)
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar
        user={
          user
            ? {
                name: user.fullName,
                email: `${user.username}@liba.local`,
                avatar: "",
              }
            : undefined
        }
        onLogout={viewModel.logout}
      />
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
                  <BreadcrumbPage>Books</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        {state.isLoading || state.isUnauthenticated ? (
          <LoadingBooksScreen />
        ) : null}

        {state.error ? (
          <div className="flex flex-1 items-center justify-center p-4">
            <Card className="w-full max-w-md rounded-lg">
              <CardHeader>
                <CardTitle>Books unavailable</CardTitle>
                <CardDescription>{state.error}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={viewModel.reload}>
                  <RefreshCwIcon />
                  Retry
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : null}

        {state.isReady && user ? (
          <TooltipProvider>
            <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
              <section className="flex flex-col gap-3 pt-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-2xl font-bold tracking-normal">
                    Books
                  </h1>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Books are independent records; branches only hold stock
                    references.
                  </p>
                </div>
                <Button onClick={() => router.push("/dashboard/books/create")}>
                  <PlusIcon />
                  Add Book
                </Button>
              </section>

              <BooksFilters
                searchQuery={state.filters.searchQuery}
                categoryFilter={state.filters.categoryFilter}
                authorFilter={state.filters.authorFilter}
                translatorFilter={state.filters.translatorFilter}
                branchFilter={state.filters.branchFilter}
                categories={state.categories}
                authors={state.authors}
                translators={state.translators}
                branches={state.branches}
                onSearchQueryChange={viewModel.setSearchQuery}
                onCategoryFilterChange={viewModel.setCategoryFilter}
                onAuthorFilterChange={viewModel.setAuthorFilter}
                onTranslatorFilterChange={viewModel.setTranslatorFilter}
                onBranchFilterChange={viewModel.setBranchFilter}
              />

              <BooksTable
                books={state.filteredBooks}
                onView={(book) => {
                  router.push(`/dashboard/books/${book.id}`)
                }}
                onBooking={(book) => {
                  router.push(
                    getCreateBookingHref(book.id, "/dashboard/books")
                  )
                }}
                onEdit={(book) => {
                  router.push(`/dashboard/books/${book.id}/edit`)
                }}
                onDelete={(book) => setDeleteBook(book)}
              />
            </div>
          </TooltipProvider>
        ) : null}

        <Dialog
          open={Boolean(state.dialog)}
          onOpenChange={(isOpen) => {
            if (!isOpen) {
              viewModel.closeDialog()
            }
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{state.dialog?.title ?? ""}</DialogTitle>
              <DialogDescription>
                {state.dialog?.description ?? ""}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter showCloseButton />
          </DialogContent>
        </Dialog>

        <Dialog
          open={deleteBook !== null}
          onOpenChange={(isOpen) => {
            if (!isOpen) setDeleteBook(null)
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Book</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete &ldquo;{deleteBook?.title}&rdquo;? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteBook(null)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleConfirmDelete}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </SidebarInset>
    </SidebarProvider>
  )
}
