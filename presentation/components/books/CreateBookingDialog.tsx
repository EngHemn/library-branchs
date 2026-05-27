"use client"

import { useState, useMemo } from "react"
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
import { Input } from "@/components/ui/input"
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
import type { BranchStock } from "@/domain/entities/book/BookDetail"

type BookingFormState = {
  branchId: string
  memberId: string
  bookingType: string
  dueDate: Date | undefined
  status: string
  notes: string
}

const INITIAL_BOOKING_FORM: BookingFormState = {
  branchId: "",
  memberId: "",
  bookingType: "",
  dueDate: undefined,
  status: "",
  notes: "",
}

const MOCK_MEMBERS: Record<
  string,
  { id: string; name: string; code: string }[]
> = {}

type CreateBookingDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  bookTitle: string
  branchStocks: BranchStock[]
}

export function CreateBookingDialog({
  open,
  onOpenChange,
  bookTitle,
  branchStocks,
}: CreateBookingDialogProps) {
  const [bookingForm, setBookingForm] =
    useState<BookingFormState>(INITIAL_BOOKING_FORM)

  const membersForBranch = useMemo(() => {
    if (!bookingForm.branchId) return []
    return MOCK_MEMBERS[bookingForm.branchId] ?? []
  }, [bookingForm.branchId])

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setBookingForm(INITIAL_BOOKING_FORM)
    }
    onOpenChange(isOpen)
  }

  const handleClose = () => {
    handleOpenChange(false)
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
              <Input id="booking-book" value={bookTitle} disabled />
            </div>

            <div className="space-y-2">
              <Label htmlFor="booking-branch">Branch *</Label>
              <Select
                value={bookingForm.branchId}
                onValueChange={(value) => {
                  setBookingForm((prev) => ({
                    ...prev,
                    branchId: value,
                    memberId: "",
                  }))
                }}
              >
                <SelectTrigger id="booking-branch" className="w-full">
                  <SelectValue placeholder="Select branch" />
                </SelectTrigger>
                <SelectContent>
                  {branchStocks.map((branch) => (
                    <SelectItem key={branch.branchId} value={branch.branchId}>
                      {branch.branchName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Choose the branch where this booking happens.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="booking-member">Member *</Label>
              <Select
                value={bookingForm.memberId}
                onValueChange={(value) =>
                  setBookingForm((prev) => ({ ...prev, memberId: value }))
                }
                disabled={!bookingForm.branchId}
              >
                <SelectTrigger id="booking-member" className="w-full">
                  <SelectValue placeholder="Select member" />
                </SelectTrigger>
                <SelectContent>
                  {membersForBranch.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.name} ({member.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Only members linked to the selected branch are available.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="booking-type">Booking Type *</Label>
              <Select
                value={bookingForm.bookingType}
                onValueChange={(value) =>
                  setBookingForm((prev) => ({ ...prev, bookingType: value }))
                }
              >
                <SelectTrigger id="booking-type" className="w-full">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="outside-borrow">
                    Outside - borrowed from store
                  </SelectItem>
                  <SelectItem value="inside-read">
                    Inside - reading in branch
                  </SelectItem>
                  <SelectItem value="reserve">Reserve</SelectItem>
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
                      setBookingForm((prev) => ({ ...prev, dueDate: date }))
                    }
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="booking-status">Status</Label>
              <Select
                value={bookingForm.status}
                onValueChange={(value) =>
                  setBookingForm((prev) => ({ ...prev, status: value }))
                }
              >
                <SelectTrigger id="booking-status" className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
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
              onChange={(e) =>
                setBookingForm((prev) => ({ ...prev, notes: e.target.value }))
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
