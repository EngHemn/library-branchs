"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeftIcon, CalendarIcon, PlusIcon } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import type { BookingManagementUseCase } from "@/domain/usecases/bookings/BookingManagementUseCase"
import {
  BookingSearchCombobox,
  type BookingComboboxOption,
} from "@/presentation/components/bookings/BookingSearchCombobox"
import { buildCreateHrefWithReturn } from "@/presentation/components/shared/DashboardEntityLink"
import { useDashboardBreadcrumbs } from "@/presentation/hooks/useDashboardBreadcrumbs"
import { useCreateBookingViewModel } from "@/presentation/viewmodels/bookings/useCreateBookingViewModel"
import { Controller } from "react-hook-form"

const CREATE_BOOK_PATH = "/dashboard/books/create"
const CREATE_BRANCH_PATH = "/dashboard/branches/create"
const CREATE_MEMBER_PATH = "/dashboard/members/create"

type CreateBookingScreenProps = {
  bookingManagementUseCase: BookingManagementUseCase
}

export function CreateBookingScreen({ bookingManagementUseCase }: CreateBookingScreenProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const defaultBookId = searchParams.get("bookId") ?? ""
  const returnTo = searchParams.get("returnTo") ?? "/dashboard/bookings"
  const isBookLocked = Boolean(defaultBookId)

  const currentPath = (() => {
    const params = new URLSearchParams()
    if (defaultBookId) params.set("bookId", defaultBookId)
    params.set("returnTo", returnTo)
    return `/dashboard/bookings/create?${params.toString()}`
  })()

  const createBookHref = buildCreateHrefWithReturn(CREATE_BOOK_PATH, currentPath)
  const createBranchHref = buildCreateHrefWithReturn(CREATE_BRANCH_PATH, currentPath)
  const createMemberHref = buildCreateHrefWithReturn(CREATE_MEMBER_PATH, currentPath)

  const { state, form, save } = useCreateBookingViewModel(bookingManagementUseCase, returnTo)

  const watchedBranchId = form.watch("branchId")
  const watchedBookId = form.watch("bookId")
  const memberOptions: BookingComboboxOption[] = state.memberOptions(watchedBranchId)

  const lockedBookTitle = isBookLocked
    ? (state.bookOptions.find((b) => b.value === defaultBookId)?.label ?? "")
    : ""

  useDashboardBreadcrumbs([
    { label: "Workspace", href: "/dashboard" },
    { label: "Bookings", href: "/dashboard/bookings" },
    { label: "Add Booking" },
  ])

  function goBack(): void {
    router.push(returnTo)
  }

  return (
    <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
      <section className="flex items-center justify-between pt-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-normal">Add Booking</h1>
          <p className="mt-1 text-sm text-muted-foreground">Create a new booking for a member.</p>
        </div>
        <Button variant="outline" onClick={goBack}>
          <ArrowLeftIcon />
          Back
        </Button>
      </section>

      <form onSubmit={form.handleSubmit(save)}>
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
                    <Input id="booking-book" value={lockedBookTitle} disabled />
                  ) : (
                    <Controller
                      control={form.control}
                      name="bookId"
                      render={({ field }) => (
                        <BookingSearchCombobox
                          id="booking-book"
                          options={state.bookOptions}
                          value={field.value}
                          onValueChange={field.onChange}
                          placeholder="Search book..."
                          createHref={createBookHref}
                          addLabel="Add book"
                        />
                      )}
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="booking-branch">Branch *</Label>
                  <Controller
                    control={form.control}
                    name="branchId"
                    render={({ field }) => (
                      <BookingSearchCombobox
                        id="booking-branch"
                        options={state.branchOptions}
                        value={field.value}
                        onValueChange={(value) => {
                          field.onChange(value)
                          form.setValue("memberId", "")
                        }}
                        placeholder="Search branch..."
                        createHref={createBranchHref}
                        addLabel="Add branch"
                      />
                    )}
                  />
                  <p className="text-xs text-muted-foreground">
                    Choose the branch where this booking happens.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="booking-member">Member *</Label>
                  <Controller
                    control={form.control}
                    name="memberId"
                    render={({ field }) => (
                      <BookingSearchCombobox
                        id="booking-member"
                        options={memberOptions}
                        value={field.value}
                        onValueChange={field.onChange}
                        placeholder="Search member..."
                        disabled={!watchedBranchId}
                        createHref={createMemberHref}
                        addLabel="Add member"
                      />
                    )}
                  />
                  <p className="text-xs text-muted-foreground">
                    Only members linked to the selected branch are available.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="booking-type">Booking Type *</Label>
                  <Controller
                    control={form.control}
                    name="bookingType"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger id="booking-type" className="w-full">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="outside">Outside</SelectItem>
                          <SelectItem value="inside">Inside</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Due Date *</Label>
                  <Controller
                    control={form.control}
                    name="dueDate"
                    render={({ field }) => {
                      const dateValue = field.value ? new Date(field.value) : undefined
                      return (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              type="button"
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 size-4" />
                              {dateValue ? format(dateValue, "MM/dd/yyyy") : "Pick a date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={dateValue}
                              onSelect={(date) =>
                                field.onChange(date ? date.toISOString() : "")
                              }
                            />
                          </PopoverContent>
                        </Popover>
                      )
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="booking-status">Status</Label>
                  <Controller
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
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
                    )}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="booking-notes">Notes</Label>
                <Textarea
                  id="booking-notes"
                  placeholder="Add any notes about this booking..."
                  {...form.register("notes")}
                  rows={3}
                />
              </div>

              <Separator />

              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={goBack}>
                  Cancel
                </Button>
                <Button type="submit" disabled={state.isSaving || !form.formState.isValid}>
                  <PlusIcon />
                  Create Booking
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
