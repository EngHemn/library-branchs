"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import {
  orderFormSchema,
  type OrderFormValues,
} from "@/domain/schemas/orderFormSchema"
import type { AuthUseCase } from "@/domain/usecases/auth/AuthUseCase"
import type { GetOrdersUseCase } from "@/domain/usecases/orders/GetOrdersUseCase"
import {
  isBranchScopedDashboardUser,
  resolveUserBranchId,
} from "@/lib/dashboardBranchScope"
import { toOrderDateInputValue } from "@/presentation/components/orders/orderDisplay"
import type { EditOrderStatus, EditOrderViewModelState } from "./EditOrderViewModelState"

type EditOrderViewModel = {
  state: EditOrderViewModelState
  form: ReturnType<typeof useForm<OrderFormValues>>
  save: (values: OrderFormValues) => Promise<void>
}

export function useEditOrderViewModel(
  orderId: string,
  authUseCase: AuthUseCase,
  getOrdersUseCase: GetOrdersUseCase
): EditOrderViewModel {
  const queryClient = useQueryClient()

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      branchId: "",
      supplierName: "",
      orderDate: "",
      expectedDeliveryDate: "",
      status: "pending",
      phoneNumber: "",
      supplierEmail: "",
      totalAmount: 0,
      notes: "",
      bookIds: [],
      latitude: null,
      longitude: null,
    },
  })

  const userQuery = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const result = await authUseCase.getCurrentUser()
      if (!result.success) throw new Error(result.error)
      return result.data ?? null
    },
  })

  const detailQuery = useQuery({
    queryKey: ["orders", orderId],
    queryFn: async () => {
      const result = await getOrdersUseCase.getOrderById(orderId)
      if (!result.success) throw new Error(result.error)
      return result.data ?? null
    },
    enabled: userQuery.isSuccess,
  })

  const optionsQuery = useQuery({
    queryKey: ["order-form-options"],
    queryFn: async () => {
      const result = await getOrdersUseCase.getOrderFormOptions()
      if (!result.success) throw new Error(result.error)
      return result.data
    },
    refetchOnMount: "always",
    enabled: userQuery.isSuccess,
  })

  const user = userQuery.data ?? null
  const showBranchField = user ? !isBranchScopedDashboardUser(user) : true
  const userBranchId = user ? resolveUserBranchId(user) : ""

  useEffect(() => {
    if (!detailQuery.data) return

    form.reset({
      branchId: detailQuery.data.branchId,
      supplierName: detailQuery.data.supplierName,
      orderDate: toOrderDateInputValue(detailQuery.data.orderDate),
      expectedDeliveryDate: toOrderDateInputValue(detailQuery.data.expectedDeliveryDate),
      status: detailQuery.data.status,
      phoneNumber: detailQuery.data.phoneNumber,
      supplierEmail: detailQuery.data.supplierEmail ?? "",
      totalAmount: detailQuery.data.totalAmount,
      notes: detailQuery.data.notes ?? "",
      bookIds: [...detailQuery.data.bookIds],
      latitude: detailQuery.data.latitude,
      longitude: detailQuery.data.longitude,
    })
  }, [detailQuery.data, form])

  useEffect(() => {
    if (!user || !isBranchScopedDashboardUser(user) || form.getValues("branchId")) return
    form.setValue("branchId", userBranchId)
  }, [user, userBranchId, form])

  const {
    mutateAsync,
    isPending: isSaving,
    isSuccess: isSaved,
    error: mutationError,
  } = useMutation({
    mutationFn: async (values: OrderFormValues) => {
      const result = await getOrdersUseCase.updateOrder({
        id: orderId,
        ...values,
        supplierEmail: values.supplierEmail || null,
        notes: values.notes || null,
      })
      if (!result.success) throw new Error(result.error)
      return result.data
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["orders"] })
      void queryClient.invalidateQueries({ queryKey: ["orders", orderId] })
    },
  })

  async function save(values: OrderFormValues): Promise<void> {
    try {
      await mutateAsync(values)
    } catch {
      // error captured in mutationError state
    }
  }

  const queryError = detailQuery.error ?? optionsQuery.error ?? userQuery.error

  const status: EditOrderStatus = isSaved
    ? "saved"
    : isSaving
      ? "saving"
      : detailQuery.isError || optionsQuery.isError || userQuery.isError
        ? "error"
        : detailQuery.isPending || optionsQuery.isPending || userQuery.isPending
          ? "loading"
          : detailQuery.data === null
            ? "not-found"
            : "ready"

  const state: EditOrderViewModelState = {
    status,
    branchOptions: optionsQuery.data?.branches ?? [],
    bookOptions: optionsQuery.data?.books ?? [],
    showBranchField,
    error: mutationError?.message ?? queryError?.message ?? null,
    isLoading: status === "loading",
    isReady: status === "ready",
    isNotFound: status === "not-found",
    isError: status === "error",
    isSaving,
    isSaved,
  }

  return { state, form, save }
}
