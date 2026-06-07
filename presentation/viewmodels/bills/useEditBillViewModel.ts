"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import type { BillBookOption, BillBranchOption } from "@/domain/repositories/BillManagementRepository"
import {
  billFormSchema,
  type BillFormValues,
} from "@/domain/schemas/billFormSchema"
import type { AuthUseCase } from "@/domain/usecases/auth/AuthUseCase"
import type { GetBillsUseCase } from "@/domain/usecases/bills/GetBillsUseCase"
import { resolveUserBranchId } from "@/lib/dashboardBranchScope"
import { toBillDateInputValue } from "@/presentation/components/bills/billDisplay"

type EditBillViewModel = {
  state: EditBillViewModelState
  form: ReturnType<typeof useForm<BillFormValues>>
  save: (values: BillFormValues) => Promise<void>
}

export function useEditBillViewModel(
  billId: string,
  authUseCase: AuthUseCase,
  getBillsUseCase: GetBillsUseCase
): EditBillViewModel {
  const queryClient = useQueryClient()

  const form = useForm<BillFormValues>({
    resolver: zodResolver(billFormSchema),
    defaultValues: {
      branchId: "",
      companyName: "",
      billDate: "",
      phoneNumber: "",
      price: 0,
      imageUrl: null,
      bookIds: [],
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
    queryKey: ["bills", billId],
    queryFn: async () => {
      const result = await getBillsUseCase.getBillById(billId)
      if (!result.success) throw new Error(result.error)
      return result.data ?? null
    },
    enabled: userQuery.isSuccess,
  })

  const optionsQuery = useQuery({
    queryKey: ["bill-form-options"],
    queryFn: async () => {
      const result = await getBillsUseCase.getBillFormOptions()
      if (!result.success) throw new Error(result.error)
      return result.data
    },
    refetchOnMount: "always",
    enabled: userQuery.isSuccess,
  })

  const user = userQuery.data ?? null
  const showBranchField = user?.branchType !== "sub"
  const userBranchId = user ? resolveUserBranchId(user) : ""

  useEffect(() => {
    if (!detailQuery.data) return

    form.reset({
      branchId: detailQuery.data.branchId,
      companyName: detailQuery.data.companyName,
      billDate: toBillDateInputValue(detailQuery.data.billDate),
      phoneNumber: detailQuery.data.phoneNumber,
      price: detailQuery.data.price,
      imageUrl: detailQuery.data.imageUrl ?? null,
      bookIds: [...detailQuery.data.bookIds],
    })
  }, [detailQuery.data, form])

  useEffect(() => {
    if (!user || user.branchType !== "sub" || form.getValues("branchId")) return
    form.setValue("branchId", userBranchId)
  }, [user, userBranchId, form])

  const {
    mutateAsync,
    isPending: isSaving,
    isSuccess: isSaved,
    error: mutationError,
  } = useMutation({
    mutationFn: async (values: BillFormValues) => {
      const result = await getBillsUseCase.updateBill({ id: billId, ...values })
      if (!result.success) throw new Error(result.error)
      return result.data
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["bills"] })
      void queryClient.invalidateQueries({ queryKey: ["bills", billId] })
    },
  })

  async function save(values: BillFormValues): Promise<void> {
    try {
      await mutateAsync(values)
    } catch {
      // error captured in mutationError state
    }
  }

  const queryError = detailQuery.error ?? optionsQuery.error ?? userQuery.error

  const status: EditBillStatus = isSaved
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

  const state: EditBillViewModelState = {
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
