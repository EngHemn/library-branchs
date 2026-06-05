"use client"

import type { BookingFormOption } from "@/domain/entities/booking/BookingFormOptions"
import type { BookingManagementUseCase } from "@/domain/usecases/bookings/BookingManagementUseCase"

export type CreateBookingViewModelState = {
  bookOptions: BookingFormOption[]
  memberOptions: BookingFormOption[]
  isLoading: boolean
  isError: boolean
  isSaving: boolean
  isSaved: boolean
  error: string | null
}
