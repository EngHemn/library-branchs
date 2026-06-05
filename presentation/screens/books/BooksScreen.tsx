"use client"

import { useEffect, useState } from "react"
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
import type { Book } from "@/domain/entities/book/Book"
import type { AuthUseCase } from "@/domain/usecases/auth/AuthUseCase"
import type { BookingManagementUseCase } from "@/domain/usecases/bookings/BookingManagementUseCase"
import type { GetBooksUseCase } from "@/domain/usecases/books/GetBooksUseCase"
import { BooksFilters } from "@/presentation/components/books/BooksFilters"
import { BooksTable } from "@/presentation/components/books/BooksTable"
import { EditBookDialog } from "@/presentation/components/books/EditBookDialog"
import { CreateBookingDialog } from "@/presentation/components/bookings/CreateBookingDialog"
import { useDashboardBreadcrumbs } from "@/presentation/hooks/useDashboardBreadcrumbs"
import { useBooksViewModel } from "@/presentation/viewmodels/books/useBooksViewModel"

type BooksScreenProps = {
  authUseCase: AuthUseCase
  getBooksUseCase: GetBooksUseCase
  bookingManagementUseCase: BookingManagementUseCase
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
  bookingManagementUseCase,
}: BooksScreenProps) {
  const router = useRouter()
  const viewModel = useBooksViewModel(authUseCase, getBooksUseCase)
  const { state } = viewModel
  const [deleteBook, setDeleteBook] = useState<Book | null>(null)
  const [createBookingOpen, setCreateBookingOpen] = useState(false)
  const [createBookingBookId, setCreateBookingBookId] = useState("")
  const [editBookId, setEditBookId] = useState<string | null>(null)

  useEffect(() => {
    if (state.isUnauthenticated) {
      router.replace("/")
    }
  }, [router, state.isUnauthenticated])

  useDashboardBreadcrumbs([
    { label: "Workspace", href: "/dashboard" },
    { label: "Books" },
  ])

  const user = state.user

  const handleConfirmDelete = () => {
    if (deleteBook) {
      void viewModel.deleteBook(deleteBook.id)
      setDeleteBook(null)
    }
  }

  return (
    <>
      {state.isLoading || state.isUnauthenticated ? <LoadingBooksScreen /> : null}

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
                <h1 className="text-2xl font-bold tracking-normal">Books</h1>
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
              showBranchFilter={state.showBranchFilter}
              onSearchQueryChange={viewModel.setSearchQuery}
              onCategoryFilterChange={viewModel.setCategoryFilter}
              onAuthorFilterChange={viewModel.setAuthorFilter}
              onTranslatorFilterChange={viewModel.setTranslatorFilter}
              onBranchFilterChange={viewModel.setBranchFilter}
            />

            <BooksTable
              books={state.filteredBooks}
              onView={(book) => router.push(`/dashboard/books/${book.id}`)}
              onBooking={(book) => {
                setCreateBookingBookId(book.id)
                setCreateBookingOpen(true)
              }}
              onEdit={(book) => setEditBookId(book.id)}
              onDelete={(book) => setDeleteBook(book)}
            />
          </div>
        </TooltipProvider>
      ) : null}

      <Dialog
        open={Boolean(state.dialog)}
        onOpenChange={(isOpen) => {
          if (!isOpen) viewModel.closeDialog()
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{state.dialog?.title ?? ""}</DialogTitle>
            <DialogDescription>{state.dialog?.description ?? ""}</DialogDescription>
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

      <CreateBookingDialog
        open={createBookingOpen}
        onOpenChange={(isOpen) => {
          setCreateBookingOpen(isOpen)
          if (!isOpen) setCreateBookingBookId("")
        }}
        authUseCase={authUseCase}
        bookingManagementUseCase={bookingManagementUseCase}
        initialBookId={createBookingBookId}
        isBookLocked={Boolean(createBookingBookId)}
      />

      <EditBookDialog
        open={editBookId !== null}
        onOpenChange={(isOpen) => {
          if (!isOpen) setEditBookId(null)
        }}
        bookId={editBookId ?? ""}
        getBooksUseCase={getBooksUseCase}
      />
    </>
  )
}
