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
import type { GetBillsUseCase } from "@/domain/usecases/bills/GetBillsUseCase"
import type { EditBillStatus, EditBillViewModelState } from "./EditBillViewModelState"

type EditBillViewModel = {
  state: EditBillViewModelState
  form: ReturnType<typeof useForm<BillFormValues>>
  save: (values: BillFormValues) => Promise<void>
}

export function useEditBillViewModel(
  billId: string,
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

  const detailQuery = useQuery({
    queryKey: ["bills", billId],
    queryFn: async () => {
      const result = await getBillsUseCase.getBillById(billId)
      if (!result.success) throw new Error(result.error)
      return result.data ?? null
    },
  })

  const optionsQuery = useQuery({
    queryKey: ["bill-form-options"],
    queryFn: async () => {
      const result = await getBillsUseCase.getBillFormOptions()
      if (!result.success) throw new Error(result.error)
      return result.data
    },
    refetchOnMount: "always",
  })

  useEffect(() => {
    if (detailQuery.data) {
      form.reset({
        branchId: detailQuery.data.branchId,
        companyName: detailQuery.data.companyName,
        billDate: detailQuery.data.billDate,
        phoneNumber: detailQuery.data.phoneNumber,
        price: detailQuery.data.price,
        imageUrl: detailQuery.data.imageUrl ?? null,
        bookIds: [...detailQuery.data.bookIds],
      })
    }
  }, [detailQuery.data, form])

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

  const queryError = detailQuery.error ?? optionsQuery.error

  const status: EditBillStatus = isSaved
    ? "saved"
    : isSaving
      ? "saving"
      : detailQuery.isError || optionsQuery.isError
        ? "error"
        : detailQuery.isPending || optionsQuery.isPending
          ? "loading"
          : detailQuery.data === null
            ? "not-found"
            : "ready"

  const state: EditBillViewModelState = {
    status,
    branchOptions: optionsQuery.data?.branches ?? [],
    bookOptions: optionsQuery.data?.books ?? [],
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
