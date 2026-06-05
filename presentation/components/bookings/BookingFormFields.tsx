"use client"

import type { UseFormReturn } from "react-hook-form"
import { format, parseISO } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
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
import type { BookingFormOption } from "@/domain/entities/booking/BookingFormOptions"
import type { BookingFormValues } from "@/domain/schemas/bookingFormSchema"
import { cn } from "@/lib/utils"
import {
  BookingSearchCombobox,
  type BookingComboboxOption,
} from "@/presentation/components/bookings/BookingSearchCombobox"

const CREATE_BOOK_HREF = "/dashboard/books/create"
const CREATE_BRANCH_HREF = "/dashboard/branches/create"
const CREATE_MEMBER_HREF = "/dashboard/members/create"

type BookingFormFieldsProps = {
  form: UseFormReturn<BookingFormValues>
  bookOptions: BookingComboboxOption[]
  branchOptions?: BookingComboboxOption[]
  memberFormOptions: BookingFormOption[]
  showBranchField?: boolean
  disabled: boolean
  onSubmit: (values: BookingFormValues) => void
  children: React.ReactNode
}

export function BookingFormFields({
  form,
  bookOptions,
  branchOptions = [],
  memberFormOptions,
  showBranchField = true,
  disabled,
  onSubmit,
  children,
}: BookingFormFieldsProps) {
  const branchId = form.watch("branchId")

  const memberOptionsForBranch: BookingComboboxOption[] = branchId
    ? memberFormOptions
        .filter((member) => member.branchId === branchId)
        .map((member) => ({ value: member.value, label: member.label, searchText: member.searchText }))
    : []

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-2">
        <div
          className={
            showBranchField ? "grid gap-4 sm:grid-cols-2" : "grid gap-4"
          }
        >
          <FormField
            control={form.control}
            name="bookId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Book *</FormLabel>
                <FormControl>
                  <BookingSearchCombobox
                    id="booking-book"
                    options={bookOptions}
                    value={field.value}
                    onValueChange={field.onChange}
                    placeholder="Search book..."
                    disabled={disabled}
                    createHref={CREATE_BOOK_HREF}
                    addLabel="Add book"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {showBranchField ? (
            <FormField
              control={form.control}
              name="branchId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Branch *</FormLabel>
                  <FormControl>
                    <BookingSearchCombobox
                      id="booking-branch"
                      options={branchOptions}
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value)
                        form.setValue("memberId", "")
                      }}
                      placeholder="Search branch..."
                      disabled={disabled}
                      createHref={CREATE_BRANCH_HREF}
                      addLabel="Add branch"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ) : null}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="memberId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Member *</FormLabel>
                <FormControl>
                  <BookingSearchCombobox
                    id="booking-member"
                    options={memberOptionsForBranch}
                    value={field.value}
                    onValueChange={field.onChange}
                    placeholder="Search member..."
                    disabled={disabled || !branchId}
                    createHref={CREATE_MEMBER_HREF}
                    addLabel="Add member"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bookingType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Booking Type *</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={disabled}
                >
                  <FormControl>
                    <SelectTrigger id="booking-type" className="w-full">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="outside">Outside</SelectItem>
                    <SelectItem value="inside">Inside</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Due Date *</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        type="button"
                        variant="outline"
                        disabled={disabled}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 size-4" />
                        {field.value
                          ? format(parseISO(field.value), "MM/dd/yyyy")
                          : "Pick a date"}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value ? parseISO(field.value) : undefined}
                      onSelect={(date) =>
                        field.onChange(date ? format(date, "yyyy-MM-dd") : "")
                      }
                      disabled={disabled}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={disabled}
                >
                  <FormControl>
                    <SelectTrigger id="booking-status" className="w-full">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="reserved">Reserved</SelectItem>
                    <SelectItem value="borrowed">Borrowed</SelectItem>
                    <SelectItem value="returned">Returned</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  id="booking-notes"
                  placeholder="Add any notes about this booking..."
                  disabled={disabled}
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {children}
      </form>
    </Form>
  )
}
