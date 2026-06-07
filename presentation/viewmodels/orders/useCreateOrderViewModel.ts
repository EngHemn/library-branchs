"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery } from "@tanstack/react-query"

import {
  orderFormSchema,
  type OrderFormValues,
} from "@/domain/schemas/orderFormSchema"
import type { AuthUseCase } from "@/domain/usecases/auth/AuthUseCase"
import type { GetOrdersUseCase } from "@/domain/usecases/orders/GetOrdersUseCase"
import { resolveUserBranchId } from "@/lib/dashboardBranchScope"
import type {
  CreateOrderStatus,
  CreateOrderViewModelState,
} from "./CreateOrderViewModelState"

type CreateOrderViewModel = {
  state: CreateOrderViewModelState
  form: ReturnType<typeof useForm<OrderFormValues>>
  save: (values: OrderFormValues) => Promise<void>
}

export function useCreateOrderViewModel(
  authUseCase: AuthUseCase,
  getOrdersUseCase: GetOrdersUseCase
): CreateOrderViewModel {
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

  const {
    mutateAsync,
    isPending: isSaving,
    isSuccess: isSaved,
    error: mutationError,
  } = useMutation({
    mutationFn: async (values: OrderFormValues) => {
      const result = await getOrdersUseCase.createOrder({
        ...values,
        supplierEmail: values.supplierEmail || null,
        notes: values.notes || null,
      })
      if (!result.success) throw new Error(result.error)
      return result.data
    },
  })

  async function save(values: OrderFormValues): Promise<void> {
    try {
      await mutateAsync(values)
    } catch {
      // error captured in mutationError state
    }
  }

  const user = userQuery.data ?? null
  const showBranchField = user?.branchType !== "sub"
  const userBranchId = user ? resolveUserBranchId(user) : ""

  useEffect(() => {
    if (!user || user.branchType !== "sub" || form.getValues("branchId")) return
    form.setValue("branchId", userBranchId)
    const branch = optionsQuery.data?.branches.find((item) => item.id === userBranchId)
    if (branch) {
      form.setValue("latitude", branch.latitude)
      form.setValue("longitude", branch.longitude)
    }
  }, [user, userBranchId, form, optionsQuery.data])

  const status: CreateOrderStatus =
    userQuery.isPending || optionsQuery.isPending
      ? "loading"
      : isSaved
        ? "saved"
        : isSaving
          ? "saving"
          : "ready"

  const state: CreateOrderViewModelState = {
    status,
    branchOptions: optionsQuery.data?.branches ?? [],
    bookOptions: optionsQuery.data?.books ?? [],
    showBranchField,
    error:
      mutationError?.message ??
      optionsQuery.error?.message ??
      userQuery.error?.message ??
      null,
    isLoading: status === "loading",
    isReady: status === "ready",
    isSaving,
    isSaved,
  }

  return { state, form, save }
}
