"use client"

import { useEffect } from "react"
import { Loader2Icon, SaveIcon } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import type { GetBooksUseCase } from "@/domain/usecases/books/GetBooksUseCase"
import { BookFormFields } from "@/presentation/components/books/BookFormFields"
import { useEditBookViewModel } from "@/presentation/viewmodels/books/useEditBookViewModel"

function isComboboxPortalTarget(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) return false

  return Boolean(
    target.closest(
      '[data-slot="combobox-positioner"], [data-slot="combobox-content"], [data-slot="combobox-list"], [data-slot="combobox-item"]'
    )
  )
}

function preventDialogDismissForCombobox(event: Event): void {
  if (isComboboxPortalTarget(event.target)) {
    event.preventDefault()
  }
}

type EditBookDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  bookId: string
  getBooksUseCase: GetBooksUseCase
  onSaved?: () => void
}

type EditBookDialogContentProps = {
  bookId: string
  getBooksUseCase: GetBooksUseCase
  onOpenChange: (open: boolean) => void
  onSaved?: () => void
}

function EditBookDialogContent({
  bookId,
  getBooksUseCase,
  onOpenChange,
  onSaved,
}: EditBookDialogContentProps) {
  const { state, form, save, addLanguage, populateFromBook } =
    useEditBookViewModel(bookId, getBooksUseCase)

  useEffect(() => {
    if (state.isSaved) {
      toast.success("Book updated successfully.")
      onSaved?.()
      onOpenChange(false)
    }
  }, [state.isSaved, onOpenChange, onSaved])

  if (state.isLoading) {
    return (
      <div className="space-y-4 py-2">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-10 w-full" />
        ))}
      </div>
    )
  }

  if (state.isNotFound) {
    return (
      <p className="py-6 text-center text-sm text-muted-foreground">
        Book not found or has been removed.
      </p>
    )
  }

  if (state.isError && !state.isReady) {
    return (
      <p className="py-6 text-center text-sm text-destructive">
        {state.error ?? "Failed to load book."}
      </p>
    )
  }

  return (
    <>
      {state.error && state.isReady ? (
        <p className="mb-4 text-sm text-destructive">{state.error}</p>
      ) : null}

      <BookFormFields
        form={form}
        books={state.books}
        authors={state.authors}
        translators={state.translators}
        categories={state.categories}
        languages={state.languages}
        disabled={state.isSaving || state.isSaved}
        onSubmit={save}
        onAddLanguage={addLanguage}
        onBookSelect={populateFromBook}
        excludeBookId={bookId}
      >
        <DialogFooter className="mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={state.isSaving}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={state.isSaving || state.isSaved}>
            {state.isSaving ? <Loader2Icon className="animate-spin" /> : <SaveIcon />}
            {state.isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </BookFormFields>
    </>
  )
}

export function EditBookDialog({
  open,
  onOpenChange,
  bookId,
  getBooksUseCase,
  onSaved,
}: EditBookDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="min-w-2xl max-h-[90vh] overflow-y-auto"
        onPointerDownOutside={preventDialogDismissForCombobox}
        onInteractOutside={preventDialogDismissForCombobox}
        onFocusOutside={preventDialogDismissForCombobox}
      >
        <DialogHeader>
          <DialogTitle>Edit Book</DialogTitle>
        </DialogHeader>

        {open && bookId ? (
          <EditBookDialogContent
            key={bookId}
            bookId={bookId}
            getBooksUseCase={getBooksUseCase}
            onOpenChange={onOpenChange}
            onSaved={onSaved}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
