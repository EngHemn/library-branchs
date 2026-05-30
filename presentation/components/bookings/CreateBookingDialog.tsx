"use client"

import { useState } from "react"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import {
  BookingSearchCombobox,
  type BookingComboboxOption,
} from "@/presentation/components/bookings/BookingSearchCombobox"

type CreateBookingDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  bookOptions?: BookingComboboxOption[]
  branchOptions?: BookingComboboxOption[]
  memberOptions?: BookingComboboxOption[]
  onBranchChange?: (branchId: string) => void
}

type BookingFormState = {
  bookId: string
  branchId: string
  memberId: string
  bookingType: "inside" | "outside" | ""
  dueDate: Date | undefined
  status: "reserved" | "borrowed" | "returned" | "overdue" | "cancelled" | ""
  notes: string
}

const INITIAL_BOOKING_FORM: BookingFormState = {
  bookId: "",
  branchId: "",
  memberId: "",
  bookingType: "",
  dueDate: undefined,
  status: "",
  notes: "",
}

const CREATE_BOOK_HREF = "/dashboard/books/create"
const CREATE_BRANCH_HREF = "/dashboard/branches/create"
const CREATE_MEMBER_HREF = "/dashboard/members/create"

export function CreateBookingDialog({
  open,
  onOpenChange,
  bookOptions = [],
  branchOptions = [],
  memberOptions = [],
  onBranchChange,
}: CreateBookingDialogProps) {
  const [bookingForm, setBookingForm] =
    useState<BookingFormState>(INITIAL_BOOKING_FORM)

  function handleOpenChange(isOpen: boolean) {
    if (!isOpen) {
      setBookingForm(INITIAL_BOOKING_FORM)
    }
    onOpenChange(isOpen)
  }

  function handleClose() {
    handleOpenChange(false)
  }

  function handleNavigateToCreate() {
    handleClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="min-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Booking</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="booking-book">Book *</Label>
              <BookingSearchCombobox
                key={`booking-book-${open}`}
                id="booking-book"
                options={bookOptions}
                value={bookingForm.bookId}
                onValueChange={(bookId) =>
                  setBookingForm((previous) => ({ ...previous, bookId }))
                }
                placeholder="Search book..."
                createHref={CREATE_BOOK_HREF}
                addLabel="Add book"
                onNavigateToCreate={handleNavigateToCreate}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="booking-branch">Branch *</Label>
              <BookingSearchCombobox
                key={`booking-branch-${open}`}
                id="booking-branch"
                options={branchOptions}
                value={bookingForm.branchId}
                onValueChange={(branchId) => {
                  setBookingForm((previous) => ({
                    ...previous,
                    branchId,
                    memberId: "",
                  }))
                  onBranchChange?.(branchId)
                }}
                placeholder="Search branch..."
                createHref={CREATE_BRANCH_HREF}
                addLabel="Add branch"
                onNavigateToCreate={handleNavigateToCreate}
              />
              <p className="text-xs text-muted-foreground">
                Choose the branch where this booking happens.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="booking-member">Member *</Label>
              <BookingSearchCombobox
                key={`booking-member-${bookingForm.branchId}-${open}`}
                id="booking-member"
                options={memberOptions}
                value={bookingForm.memberId}
                onValueChange={(memberId) =>
                  setBookingForm((previous) => ({ ...previous, memberId }))
                }
                placeholder="Search member..."
                disabled={!bookingForm.branchId}
                createHref={CREATE_MEMBER_HREF}
                addLabel="Add member"
                onNavigateToCreate={handleNavigateToCreate}
              />
              <p className="text-xs text-muted-foreground">
                Only members linked to the selected branch are available.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="booking-type">Booking Type *</Label>
              <Select
                value={bookingForm.bookingType}
                onValueChange={(value: "inside" | "outside") =>
                  setBookingForm((previous) => ({
                    ...previous,
                    bookingType: value,
                  }))
                }
              >
                <SelectTrigger id="booking-type" className="w-full">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="outside">Outside</SelectItem>
                  <SelectItem value="inside">Inside</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Due Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !bookingForm.dueDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 size-4" />
                    {bookingForm.dueDate
                      ? format(bookingForm.dueDate, "MM/dd/yyyy")
                      : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={bookingForm.dueDate}
                    onSelect={(date) =>
                      setBookingForm((previous) => ({
                        ...previous,
                        dueDate: date,
                      }))
                    }
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="booking-status">Status</Label>
              <Select
                value={bookingForm.status}
                onValueChange={(
                  value:
                    | "reserved"
                    | "borrowed"
                    | "returned"
                    | "overdue"
                    | "cancelled"
                ) =>
                  setBookingForm((previous) => ({
                    ...previous,
                    status: value,
                  }))
                }
              >
                <SelectTrigger id="booking-status" className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="reserved">Reserved</SelectItem>
                  <SelectItem value="borrowed">Borrowed</SelectItem>
                  <SelectItem value="returned">Returned</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="booking-notes">Notes</Label>
            <Textarea
              id="booking-notes"
              placeholder="Add any notes about this booking..."
              value={bookingForm.notes}
              onChange={(event) =>
                setBookingForm((previous) => ({
                  ...previous,
                  notes: event.target.value,
                }))
              }
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleClose}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
