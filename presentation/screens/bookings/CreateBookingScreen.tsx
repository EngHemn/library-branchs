"use client"

import { useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeftIcon, CalendarIcon, PlusIcon } from "lucide-react"
import { format } from "date-fns"

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
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { fakeBooks } from "@/data/fake/fakeBooks"
import { fakeBranches } from "@/data/fake/fakeBranches"
import { fakeMembers } from "@/data/fake/fakeMembers"
import { cn } from "@/lib/utils"
import {
  BookingSearchCombobox,
  type BookingComboboxOption,
} from "@/presentation/components/bookings/BookingSearchCombobox"

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

function toBookOptions(): BookingComboboxOption[] {
  return fakeBooks.map((book) => ({
    value: book.id,
    label: book.title,
    searchText: [book.isbn, book.author, book.category].filter(Boolean).join(" "),
  }))
}

function toBranchOptions(): BookingComboboxOption[] {
  return fakeBranches.map((branch) => ({
    value: branch.id,
    label: branch.branchName,
    searchText: [branch.email, branch.address].filter(Boolean).join(" "),
  }))
}

function createInitialBookingForm(defaultBookId: string): BookingFormState {
  if (!defaultBookId) return INITIAL_BOOKING_FORM

  const book = fakeBooks.find((item) => item.id === defaultBookId)
  return {
    ...INITIAL_BOOKING_FORM,
    bookId: defaultBookId,
    branchId: book?.branchId ?? "",
  }
}

function toMemberOptions(branchId: string): BookingComboboxOption[] {
  const members = branchId
    ? fakeMembers.filter((member) => member.branchId === branchId)
    : fakeMembers

  return members.map((member) => ({
    value: member.id,
    label: member.memberName,
    searchText: [member.memberId, member.membershipNumber, member.email]
      .filter(Boolean)
      .join(" "),
  }))
}

export function CreateBookingScreen() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const defaultBookId = searchParams.get("bookId") ?? ""
  const returnTo = searchParams.get("returnTo") ?? "/dashboard/bookings"
  const isBookLocked = Boolean(defaultBookId)

  const [bookingForm, setBookingForm] = useState<BookingFormState>(() =>
    createInitialBookingForm(defaultBookId)
  )

  const lockedBookTitle = useMemo(() => {
    if (!isBookLocked) return ""
    return fakeBooks.find((book) => book.id === defaultBookId)?.title ?? ""
  }, [defaultBookId, isBookLocked])

  const bookOptions = useMemo(() => toBookOptions(), [])
  const branchOptions = useMemo(() => toBranchOptions(), [])
  const memberOptions = useMemo(
    () => toMemberOptions(bookingForm.branchId),
    [bookingForm.branchId]
  )

  const isFormValid =
    Boolean(bookingForm.bookId) &&
    Boolean(bookingForm.branchId) &&
    Boolean(bookingForm.memberId) &&
    Boolean(bookingForm.bookingType) &&
    Boolean(bookingForm.dueDate)

  const goBack = () => {
    router.push(returnTo)
  }

  const handleSave = () => {
    if (!isFormValid) return
    goBack()
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
                  <BreadcrumbLink href="/dashboard/bookings">
                    Bookings
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Add Booking</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
          <section className="flex items-center justify-between pt-4">
            <div>
              <h1 className="text-2xl font-semibold tracking-normal">
                Add Booking
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Create a new booking for a member.
              </p>
            </div>
            <Button variant="outline" onClick={goBack}>
              <ArrowLeftIcon />
              Back
            </Button>
          </section>

          <Card className="rounded-lg">
            <CardHeader>
              <CardTitle>Booking Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 py-2">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="booking-book">Book *</Label>
                    {isBookLocked ? (
                      <Input
                        id="booking-book"
                        value={lockedBookTitle}
                        disabled
                      />
                    ) : (
                      <BookingSearchCombobox
                        id="booking-book"
                        options={bookOptions}
                        value={bookingForm.bookId}
                        onValueChange={(bookId) =>
                          setBookingForm((previous) => ({ ...previous, bookId }))
                        }
                        placeholder="Search book..."
                        createHref={CREATE_BOOK_HREF}
                        addLabel="Add book"
                      />
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="booking-branch">Branch *</Label>
                    <BookingSearchCombobox
                      id="booking-branch"
                      options={branchOptions}
                      value={bookingForm.branchId}
                      onValueChange={(branchId) =>
                        setBookingForm((previous) => ({
                          ...previous,
                          branchId,
                          memberId: "",
                        }))
                      }
                      placeholder="Search branch..."
                      createHref={CREATE_BRANCH_HREF}
                      addLabel="Add branch"
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

                <Separator />

                <div className="flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={goBack}>
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={handleSave}
                    disabled={!isFormValid}
                  >
                    <PlusIcon />
                    Create Booking
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
