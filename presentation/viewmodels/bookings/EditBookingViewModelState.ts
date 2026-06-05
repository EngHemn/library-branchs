"use client"

import type { Booking } from "@/domain/entities/booking/Booking"
import type { BookingFormOption } from "@/domain/entities/booking/BookingFormOptions"
import type { BookingManagementUseCase } from "@/domain/usecases/bookings/BookingManagementUseCase"
import type { BookingComboboxOption } from "@/presentation/components/bookings/BookingSearchCombobox"

export type EditBookingStatus =
  | "idle"
  | "loading"
  | "ready"
  | "not-found"
  | "error"
  | "saving"
  | "saved"

export type EditBookingViewModelState = {
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
