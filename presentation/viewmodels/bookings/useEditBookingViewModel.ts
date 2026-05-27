"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

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
  const [status, setStatus] = useState<EditBookingStatus>("idle")
  const [booking, setBooking] = useState<Booking | null>(null)
  const [bookOptions, setBookOptions] = useState<BookingComboboxOption[]>([])
  const [branchOptions, setBranchOptions] = useState<BookingComboboxOption[]>([])
  const [memberFormOptions, setMemberFormOptions] = useState<BookingFormOption[]>(
    []
  )
  const [error, setError] = useState<string | null>(null)
  const [reloadToken, setReloadToken] = useState(0)

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema as never),
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

  const reload = useCallback(() => {
    setReloadToken((value) => value + 1)
  }, [])

  useEffect(() => {
    let cancelled = false

    async function loadData(): Promise<void> {
      setStatus("loading")
      setError(null)

      const [bookingResult, optionsResult] = await Promise.all([
        bookingManagementUseCase.getBookingById(bookingId),
        bookingManagementUseCase.getBookingFormOptions(),
      ])

      if (cancelled) return

      if (!bookingResult.success) {
        if (bookingResult.error === "Booking not found") {
          setStatus("not-found")
          return
        }

        setStatus("error")
        setError(bookingResult.error)
        return
      }

      if (!optionsResult.success) {
        setStatus("error")
        setError(optionsResult.error)
        return
      }

      setBooking(bookingResult.data)
      setBookOptions(toComboboxOptions(optionsResult.data.books))
      setBranchOptions(toComboboxOptions(optionsResult.data.branches))
      setMemberFormOptions(optionsResult.data.members)

      form.reset({
        bookId: bookingResult.data.bookId,
        branchId: bookingResult.data.branchId,
        memberId: bookingResult.data.memberId,
        bookingType: bookingResult.data.type,
        dueDate: bookingResult.data.dueDate,
        status: bookingResult.data.status,
        notes: "",
      })

      setStatus("ready")
    }

    void loadData()

    return () => {
      cancelled = true
    }
  }, [bookingId, bookingManagementUseCase, form, reloadToken])

  const save = useCallback(
    async (values: BookingFormValues): Promise<void> => {
      setStatus("saving")
      setError(null)

      const result = await bookingManagementUseCase.updateBooking({
        id: bookingId,
        bookId: values.bookId,
        branchId: values.branchId,
        memberId: values.memberId,
        type: values.bookingType,
        dueDate: values.dueDate,
        status: values.status,
      })

      if (!result.success) {
        setStatus("ready")
        setError(result.error)
        return
      }

      setBooking(result.data)
      setStatus("saved")
    },
    [bookingId, bookingManagementUseCase]
  )

  const state = useMemo<EditBookingViewModelState>(
    () => ({
      status,
      booking,
      bookOptions,
      branchOptions,
      memberFormOptions,
      error,
      isLoading: status === "idle" || status === "loading",
      isReady: status === "ready",
      isNotFound: status === "not-found",
      isError: status === "error",
      isSaving: status === "saving",
      isSaved: status === "saved",
    }),
    [
      bookOptions,
      booking,
      branchOptions,
      error,
      memberFormOptions,
      status,
    ]
  )

  return { state, form, save, reload }
}
