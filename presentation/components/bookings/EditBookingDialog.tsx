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
import type { BookingManagementUseCase } from "@/domain/usecases/bookings/BookingManagementUseCase"
import { BookingFormFields } from "@/presentation/components/bookings/BookingFormFields"
import { useEditBookingViewModel } from "@/presentation/viewmodels/bookings/useEditBookingViewModel"

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

type EditBookingDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  bookingId: string
  bookingManagementUseCase: BookingManagementUseCase
}

type EditBookingDialogContentProps = {
  bookingId: string
  bookingManagementUseCase: BookingManagementUseCase
  onOpenChange: (open: boolean) => void
}

function EditBookingDialogContent({
  bookingId,
  bookingManagementUseCase,
  onOpenChange,
}: EditBookingDialogContentProps) {
  const { state, form, save } = useEditBookingViewModel(
    bookingId,
    bookingManagementUseCase
  )

  useEffect(() => {
    if (state.isSaved) {
      toast.success("Booking updated successfully.")
      onOpenChange(false)
    }
  }, [state.isSaved, onOpenChange])

  if (state.isLoading) {
    return (
      <div className="space-y-4 py-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-10 w-full" />
        ))}
      </div>
    )
  }

  if (state.isNotFound) {
    return (
      <p className="py-6 text-center text-sm text-muted-foreground">
        Booking not found or has been removed.
      </p>
    )
  }

  if (state.isError && !state.isReady) {
    return (
      <p className="py-6 text-center text-sm text-destructive">
        {state.error ?? "Failed to load booking."}
      </p>
    )
  }

  return (
    <>
      {state.error && state.isReady ? (
        <p className="mb-4 text-sm text-destructive">{state.error}</p>
      ) : null}

      <BookingFormFields
        form={form}
        bookOptions={state.bookOptions}
        memberFormOptions={state.memberFormOptions}
        showBranchField={false}
        disabled={state.isSaving || state.isSaved}
        onSubmit={save}
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
      </BookingFormFields>
    </>
  )
}

export function EditBookingDialog({
  open,
  onOpenChange,
  bookingId,
  bookingManagementUseCase,
}: EditBookingDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="min-w-2xl max-h-[90vh] overflow-y-auto"
        onPointerDownOutside={preventDialogDismissForCombobox}
        onInteractOutside={preventDialogDismissForCombobox}
        onFocusOutside={preventDialogDismissForCombobox}
      >
        <DialogHeader>
          <DialogTitle>Edit Booking</DialogTitle>
        </DialogHeader>

        {open && bookingId ? (
          <EditBookingDialogContent
            key={bookingId}
            bookingId={bookingId}
            bookingManagementUseCase={bookingManagementUseCase}
            onOpenChange={onOpenChange}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
