"use client"

import { useEffect } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import type { Booking } from "@/domain/entities/booking/Booking"
import type { BookingFormOption } from "@/domain/entities/booking/BookingFormOptions"
import {
  bookingFormSchema,
  type BookingFormValues,
} from "@/domain/schemas/bookingFormSchema"
import type { BookingManagementUseCase } from "@/domain/usecases/bookings/BookingManagementUseCase"
import type { BookingComboboxOption } from "@/presentation/components/bookings/BookingSearchCombobox"

type EditBookingStatus =
  | "idle"
  | "loading"
  | "ready"
  | "not-found"
  | "error"
  | "saving"
  | "saved"

type EditBookingViewModelState = {
  status: EditBookingStatus
  booking: Booking | null
  bookOptions: BookingComboboxOption[]
  branchOptions: BookingComboboxOption[]
  memberFormOptions: BookingFormOption[]
  error: string | null
  isLoading: boolean
  isReady: boolean
  isNotFound: boolean
  isError: boolean
  isSaving: boolean
  isSaved: boolean
}

type EditBookingViewModel = {
  state: EditBookingViewModelState
  form: ReturnType<typeof useForm<BookingFormValues>>
  save: (values: BookingFormValues) => Promise<void>
  reload: () => void
}

type EditBookingQueryData = {
  booking: Booking
  options: {
    books: BookingFormOption[]
    branches: BookingFormOption[]
    members: BookingFormOption[]
  }
} | null

function toComboboxOptions(options: BookingFormOption[]): BookingComboboxOption[] {
  return options.map((option) => ({
    value: option.value,
    label: option.label,
    searchText: option.searchText,
  }))
}

export function useEditBookingViewModel(
  bookingId: string,
  bookingManagementUseCase: BookingManagementUseCase
): EditBookingViewModel {
  const queryClient = useQueryClient()

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      bookId: "",
      branchId: "",
      memberId: "",
      bookingType: "outside",
      dueDate: "",
      status: "reserved",
      notes: "",
    },
  })

  const editDataQuery = useQuery<EditBookingQueryData>({
    queryKey: ["booking-edit-data", bookingId],
    queryFn: async () => {
      const [bookingResult, optionsResult] = await Promise.all([
        bookingManagementUseCase.getBookingById(bookingId),
        bookingManagementUseCase.getBookingFormOptions(),
      ])

      if (!bookingResult.success) {
        if (bookingResult.error === "Booking not found") {
          return null
        }
        throw new Error(bookingResult.error)
      }

      if (!optionsResult.success) {
        throw new Error(optionsResult.error)
      }

      return {
        booking: bookingResult.data,
        options: optionsResult.data,
      }
    },
  })

  useEffect(() => {
    if (editDataQuery.data) {
      const { booking } = editDataQuery.data
      form.reset({
        bookId: booking.bookId,
        branchId: booking.branchId,
        memberId: booking.memberId,
        bookingType: booking.type,
        dueDate: booking.dueDate,
        status: booking.status,
        notes: "",
      })
    }
  }, [editDataQuery.data, form])

  const saveMutation = useMutation({
    mutationFn: async (values: BookingFormValues) => {
      const result = await bookingManagementUseCase.updateBooking({
        id: bookingId,
        bookId: values.bookId,
        branchId: values.branchId,
        memberId: values.memberId,
        type: values.bookingType,
        dueDate: values.dueDate,
        status: values.status,
      })
      if (!result.success) throw new Error(result.error)
      return result.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] })
      queryClient.invalidateQueries({ queryKey: ["booking-edit-data", bookingId] })
    },
  })

  const isNotFound = editDataQuery.isSuccess && editDataQuery.data === null

  const status: EditBookingStatus = editDataQuery.isPending
    ? "loading"
    : editDataQuery.isError
      ? "error"
      : isNotFound
        ? "not-found"
        : saveMutation.isPending
          ? "saving"
          : saveMutation.isSuccess
            ? "saved"
            : "ready"

  const error = editDataQuery.isError
    ? editDataQuery.error instanceof Error
      ? editDataQuery.error.message
      : String(editDataQuery.error)
    : saveMutation.isError
      ? saveMutation.error instanceof Error
        ? saveMutation.error.message
        : String(saveMutation.error)
      : null

  async function save(values: BookingFormValues): Promise<void> {
    await saveMutation.mutateAsync(values)
  }

  function reload(): void {
    void editDataQuery.refetch()
  }

  const state: EditBookingViewModelState = {
    status,
    booking: editDataQuery.data?.booking ?? null,
    bookOptions: editDataQuery.data
      ? toComboboxOptions(editDataQuery.data.options.books)
      : [],
    branchOptions: editDataQuery.data
      ? toComboboxOptions(editDataQuery.data.options.branches)
      : [],
    memberFormOptions: editDataQuery.data?.options.members ?? [],
    error,
    isLoading: status === "loading",
    isReady: status === "ready",
    isNotFound: status === "not-found",
    isError: status === "error",
    isSaving: status === "saving",
    isSaved: status === "saved",
  }

  return { state, form, save, reload }
}
