"use client"

import { useEffect } from "react"
import { CalendarIcon, PlusIcon } from "lucide-react"
import { format } from "date-fns"
import { Controller } from "react-hook-form"

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
import type { AuthUseCase } from "@/domain/usecases/auth/AuthUseCase"
import type { BookingManagementUseCase } from "@/domain/usecases/bookings/BookingManagementUseCase"
import { cn } from "@/lib/utils"
import { BookingSearchCombobox } from "@/presentation/components/bookings/BookingSearchCombobox"
import { useTranslation } from "@/presentation/i18n/useTranslation"
import { useCreateBookingViewModel } from "@/presentation/viewmodels/bookings/useCreateBookingViewModel"

const CREATE_BOOK_HREF = "/dashboard/books/create"
const CREATE_MEMBER_HREF = "/dashboard/members/create"

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

type CreateBookingDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  authUseCase: AuthUseCase
  bookingManagementUseCase: BookingManagementUseCase
  initialBookId?: string
  isBookLocked?: boolean
}

export function CreateBookingDialog({
  open,
  onOpenChange,
  authUseCase,
  bookingManagementUseCase,
  initialBookId = "",
  isBookLocked = false,
}: CreateBookingDialogProps) {
  const { t } = useTranslation()
  const { state, form, save } = useCreateBookingViewModel(
    authUseCase,
    bookingManagementUseCase,
    { initialBookId }
  )

  function handleOpenChange(isOpen: boolean) {
    if (!isOpen) {
      form.reset()
    }
    onOpenChange(isOpen)
  }

  function handleNavigateToCreate() {
    handleOpenChange(false)
  }

  useEffect(() => {
    if (state.isSaved) {
      form.reset()
      onOpenChange(false)
    }
  }, [state.isSaved, form, onOpenChange])

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="min-w-2xl"
        onPointerDownOutside={preventDialogDismissForCombobox}
        onInteractOutside={preventDialogDismissForCombobox}
        onFocusOutside={preventDialogDismissForCombobox}
      >
        <DialogHeader>
          <DialogTitle>{t("bookings.dialog.createTitle")}</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(save)}>
          <div className="grid gap-4 py-2">
            <div className="grid gap-4 sm:grid-cols-2">
              {!isBookLocked ? (
                <div className="space-y-2">
                  <Label htmlFor="booking-book">{t("bookings.fields.book")} *</Label>
                  <Controller
                    control={form.control}
                    name="bookId"
                    render={({ field }) => (
                      <BookingSearchCombobox
                        key={`booking-book-${open}`}
                        id="booking-book"
                        options={state.bookOptions}
                        value={field.value}
                        onValueChange={field.onChange}
                        placeholder={t("bookings.placeholders.searchBook")}
                        disabled={state.isLoading}
                        createHref={CREATE_BOOK_HREF}
                        addLabel={t("bookings.placeholders.addBook")}
                        onNavigateToCreate={handleNavigateToCreate}
                      />
                    )}
                  />
                </div>
              ) : null}

              <div className={cn("space-y-2", isBookLocked && "sm:col-span-2")}>
                <Label htmlFor="booking-member">{t("bookings.fields.member")} *</Label>
                <Controller
                  control={form.control}
                  name="memberId"
                  render={({ field }) => (
                    <BookingSearchCombobox
                      key={`booking-member-${open}`}
                      id="booking-member"
                      options={state.memberOptions}
                      value={field.value}
                      onValueChange={field.onChange}
                      placeholder={t("bookings.placeholders.searchMember")}
                      disabled={state.isLoading}
                      createHref={CREATE_MEMBER_HREF}
                      addLabel={t("bookings.placeholders.addMember")}
                      onNavigateToCreate={handleNavigateToCreate}
                    />
                  )}
                />
                <p className="text-xs text-muted-foreground">
                  {t("bookings.dialog.memberHint")}
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="booking-type">{t("bookings.fields.bookingType")} *</Label>
                <Controller
                  control={form.control}
                  name="bookingType"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="booking-type" className="w-full">
                        <SelectValue placeholder={t("bookings.placeholders.selectType")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="outside">{t("bookings.types.outside")}</SelectItem>
                        <SelectItem value="inside">{t("bookings.types.inside")}</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label>{t("bookings.fields.dueDate")} *</Label>
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
                            {dateValue
                              ? format(dateValue, "MM/dd/yyyy")
                              : t("bookings.placeholders.pickDate")}
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
                <Label htmlFor="booking-status">{t("bookings.fields.status")}</Label>
                <Controller
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="booking-status" className="w-full">
                        <SelectValue placeholder={t("bookings.placeholders.selectStatus")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="reserved">{t("bookings.statuses.reserved")}</SelectItem>
                        <SelectItem value="borrowed">{t("bookings.statuses.borrowed")}</SelectItem>
                        <SelectItem value="returned">{t("bookings.statuses.returned")}</SelectItem>
                        <SelectItem value="overdue">{t("bookings.statuses.overdue")}</SelectItem>
                        <SelectItem value="cancelled">{t("bookings.statuses.cancelled")}</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="booking-notes">{t("bookings.fields.notes")}</Label>
              <Textarea
                id="booking-notes"
                placeholder={t("bookings.placeholders.notes")}
                {...form.register("notes")}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
            >
              {t("common.cancel")}
            </Button>
            <Button type="submit" disabled={state.isSaving || !form.formState.isValid}>
              <PlusIcon />
              {t("bookings.dialog.createButton")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
