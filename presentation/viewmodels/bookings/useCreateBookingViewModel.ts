"use client"

import { useEffect } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  bookingFormSchema,
  type BookingFormValues,
} from "@/domain/schemas/bookingFormSchema"
import type { BookingManagementUseCase } from "@/domain/usecases/bookings/BookingManagementUseCase"
import type { AuthUseCase } from "@/domain/usecases/auth/AuthUseCase"
import { resolveUserBranchId } from "@/lib/dashboardBranchScope"
import type { CreateBookingViewModelState } from "./CreateBookingViewModelState"

type CreateBookingViewModel = {
  state: CreateBookingViewModelState
  form: ReturnType<typeof useForm<BookingFormValues>>
  save: (values: BookingFormValues) => void
}

type CreateBookingViewModelOptions = {
  initialBookId?: string
  onSuccess?: () => void
}

export function useCreateBookingViewModel(
  authUseCase: AuthUseCase,
  bookingManagementUseCase: BookingManagementUseCase,
  options: CreateBookingViewModelOptions = {}
): CreateBookingViewModel {
  const { initialBookId = "", onSuccess } = options
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

  const userQuery = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const result = await authUseCase.getCurrentUser()
      if (!result.success) throw new Error(result.error)
      return result.data
    },
  })

  const formOptionsQuery = useQuery({
    queryKey: ["bookingFormOptions"],
    queryFn: async () => {
      const result = await bookingManagementUseCase.getBookingFormOptions()
      if (!result.success) throw new Error(result.error)
      return result.data
    },
  })

  const {
    mutate: createBooking,
    isPending: isSaving,
    isSuccess: isSaved,
  } = useMutation({
    mutationFn: async (_values: BookingFormValues) => {
      return { success: true }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["bookings"] })
      onSuccess?.()
    },
  })

  const user = userQuery.data ?? null
  const userBranchId = user ? resolveUserBranchId(user) : ""
  const bookOptions = formOptionsQuery.data?.books ?? []
  const allMembers = formOptionsQuery.data?.members ?? []
  const memberOptions = userBranchId
    ? allMembers.filter((member) => member.branchId === userBranchId)
    : []

  useEffect(() => {
    if (!userBranchId) return
    if (form.getValues("branchId") === userBranchId) return
    form.setValue("branchId", userBranchId, { shouldValidate: true })
    form.setValue("memberId", "")
  }, [userBranchId, form])

  useEffect(() => {
    if (!initialBookId) return
    if (form.getValues("bookId") === initialBookId) return
    form.setValue("bookId", initialBookId, { shouldValidate: true })
  }, [initialBookId, form])

  const isLoading = userQuery.isLoading || formOptionsQuery.isLoading
  const isError = userQuery.isError || formOptionsQuery.isError
  const error = isError
    ? (userQuery.error?.message ?? formOptionsQuery.error?.message ?? null)
    : null

  return {
    state: {
      bookOptions,
      memberOptions,
      isLoading,
      isError,
      isSaving,
      isSaved,
      error,
    },
    form,
    save: createBooking,
  }
}
