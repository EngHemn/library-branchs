"use client"

import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"

import type { StaffManagementUseCase } from "@/domain/usecases/staff/StaffManagementUseCase"

type StaffDeleteDialogState = {
  staffId: string
  staffName: string
}

type StaffDeleteDialogOptions = {
  staffManagementUseCase: StaffManagementUseCase
}

export type StaffDeleteDialogResult = {
  deleteStaffDialog: StaffDeleteDialogState | null
  deleteStaffError: string | null
  isDeletingStaff: boolean
  openDeleteStaffDialog: (staffId: string, staffName: string) => void
  closeDeleteStaffDialog: () => void
  confirmDeleteStaff: () => Promise<void>
}

export function useStaffDeleteDialog(
  options: StaffDeleteDialogOptions
): StaffDeleteDialogResult {
  const queryClient = useQueryClient()
  const [deleteStaffDialog, setDeleteStaffDialog] =
    useState<StaffDeleteDialogState | null>(null)
  const [deleteStaffError, setDeleteStaffError] = useState<string | null>(null)

  const { mutateAsync: deleteStaffAsync, isPending: isDeletingStaff } = useMutation({
    mutationFn: async (staffId: string) => {
      const result = await options.staffManagementUseCase.deleteStaff(staffId)
      if (!result.success) throw new Error(result.error)
      return staffId
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["staff"] })
      setDeleteStaffDialog(null)
      setDeleteStaffError(null)
    },
    onError: (err: Error) => setDeleteStaffError(err.message),
  })

  function openDeleteStaffDialog(staffId: string, staffName: string): void {
    setDeleteStaffError(null)
    setDeleteStaffDialog({ staffId, staffName })
  }

  function closeDeleteStaffDialog(): void {
    if (isDeletingStaff) return
    setDeleteStaffDialog(null)
    setDeleteStaffError(null)
  }

  async function confirmDeleteStaff(): Promise<void> {
    if (!deleteStaffDialog) return
    await deleteStaffAsync(deleteStaffDialog.staffId).catch(() => undefined)
  }

  return {
    deleteStaffDialog,
    deleteStaffError,
    isDeletingStaff,
    openDeleteStaffDialog,
    closeDeleteStaffDialog,
    confirmDeleteStaff,
  }
}
