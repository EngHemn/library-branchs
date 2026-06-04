"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"

import {
  bookingFormSchema,
  type BookingFormValues,
} from "@/domain/schemas/bookingFormSchema"
import type { BookingFormOption } from "@/domain/entities/booking/BookingFormOptions"
import type { BookingManagementUseCase } from "@/domain/usecases/bookings/BookingManagementUseCase"
import type { CreateBookingViewModelState } from "./CreateBookingViewModelState"

type CreateBookingViewModel = {
  state: CreateBookingViewModelState
  form: ReturnType<typeof useForm<BookingFormValues>>
  save: (values: BookingFormValues) => void
}

export function useCreateBookingViewModel(
  bookingManagementUseCase: BookingManagementUseCase,
  returnTo: string = "/dashboard/bookings"
): CreateBookingViewModel {
  const router = useRouter()
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

  const { data: formOptions, isLoading, isError, error } = useQuery({
    queryKey: ["bookingFormOptions"],
    queryFn: async () => {
      const result = await bookingManagementUseCase.getBookingFormOptions()
      if (!result.success) throw new Error(result.error)
      return result.data
    },
  })

  const { mutate: createBooking, isPending: isSaving, isSuccess: isSaved } = useMutation({
    mutationFn: async (_values: BookingFormValues) => {
      return { success: true }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["bookings"] })
      router.push(returnTo)
    },
  })

  const bookOptions = formOptions?.books ?? []
  const branchOptions = formOptions?.branches ?? []
  const allMembers = formOptions?.members ?? []

  function memberOptions(branchId: string): BookingFormOption[] {
    if (!branchId) return allMembers
    return allMembers.filter((m) => m.branchId === branchId)
  }

  return {
    state: {
      bookOptions,
      branchOptions,
      memberOptions,
      isLoading,
      isError,
      isSaving,
      isSaved,
      error: isError ? (error as Error).message : null,
    },
    form,
    save: createBooking,
  }
}
