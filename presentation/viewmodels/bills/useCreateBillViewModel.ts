"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery } from "@tanstack/react-query"

import type { BillBookOption, BillBranchOption } from "@/domain/repositories/BillManagementRepository"
import {
  billFormSchema,
  type BillFormValues,
} from "@/domain/schemas/billFormSchema"
import type { GetBillsUseCase } from "@/domain/usecases/bills/GetBillsUseCase"
import type { CreateBillStatus, CreateBillViewModelState } from "./CreateBillViewModelState"

type CreateBillViewModel = {
  state: CreateBillViewModelState
  form: ReturnType<typeof useForm<BillFormValues>>
  save: (values: BillFormValues) => Promise<void>
}

export function useCreateBillViewModel(
  getBillsUseCase: GetBillsUseCase
): CreateBillViewModel {
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

  const optionsQuery = useQuery({
    queryKey: ["bill-form-options"],
    queryFn: async () => {
      const result = await getBillsUseCase.getBillFormOptions()
      if (!result.success) throw new Error(result.error)
      return result.data
    },
    refetchOnMount: "always",
  })

  const {
    mutateAsync,
    isPending: isSaving,
    isSuccess: isSaved,
    error: mutationError,
  } = useMutation({
    mutationFn: async (values: BillFormValues) => {
      const result = await getBillsUseCase.createBill(values)
      if (!result.success) throw new Error(result.error)
      return result.data
    },
  })

  async function save(values: BillFormValues): Promise<void> {
    try {
      await mutateAsync(values)
    } catch {
      // error captured in mutationError state
    }
  }

  const status: CreateBillStatus = optionsQuery.isPending
    ? "loading"
    : isSaved
      ? "saved"
      : isSaving
        ? "saving"
        : "ready"

  const state: CreateBillViewModelState = {
    status,
    branchOptions: optionsQuery.data?.branches ?? [],
    bookOptions: optionsQuery.data?.books ?? [],
    error: mutationError?.message ?? optionsQuery.error?.message ?? null,
    isLoading: status === "loading",
    isReady: status === "ready",
    isSaving,
    isSaved,
  }

  return { state, form, save }
}
