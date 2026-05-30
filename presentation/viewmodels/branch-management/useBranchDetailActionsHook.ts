"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"

import type { BranchDetailUseCase } from "@/domain/usecases/branch/BranchDetailUseCase"

type BranchDetailActions = {
  deleteSubBranch: (branchId: string) => Promise<void>
  toggleSubBranchStatus: (branchId: string) => Promise<void>
  deleteBook: (bookId: string) => Promise<void>
  toggleBookStatus: (bookId: string) => Promise<void>
  deleteAuthor: (authorId: string) => Promise<void>
  toggleAuthorStatus: (authorId: string) => Promise<void>
  deleteTranslator: (translatorId: string) => Promise<void>
  toggleTranslatorStatus: (translatorId: string) => Promise<void>
  deleteStaff: (staffId: string) => Promise<void>
  toggleStaffStatus: (staffId: string) => Promise<void>
  deleteMember: (memberId: string) => Promise<void>
  toggleMemberStatus: (memberId: string) => Promise<void>
}

export function useBranchDetailActionsHook(
  branchId: string,
  branchDetailUseCase: BranchDetailUseCase
): BranchDetailActions {
  const queryClient = useQueryClient()

  function invalidate(): void {
    void queryClient.invalidateQueries({ queryKey: ["branchDetail", branchId] })
  }

  const deleteSubBranchMutation = useMutation({
    mutationFn: async (id: string) => {
      const result = await branchDetailUseCase.deleteSubBranch(id)
      return result.success
    },
    onSuccess: (ok) => { if (ok) invalidate() },
  })

  const toggleSubBranchStatusMutation = useMutation({
    mutationFn: async (id: string) => {
      const result = await branchDetailUseCase.toggleSubBranchStatus(id)
      return result.success
    },
    onSuccess: (ok) => { if (ok) invalidate() },
  })

  const deleteBookMutation = useMutation({
    mutationFn: async (id: string) => {
      const result = await branchDetailUseCase.deleteBook(id)
      return result.success
    },
    onSuccess: (ok) => { if (ok) invalidate() },
  })

  const toggleBookStatusMutation = useMutation({
    mutationFn: async (id: string) => {
      const result = await branchDetailUseCase.toggleBookStatus(id)
      return result.success
    },
    onSuccess: (ok) => { if (ok) invalidate() },
  })

  const deleteAuthorMutation = useMutation({
    mutationFn: async (id: string) => {
      const result = await branchDetailUseCase.deleteAuthor(id)
      return result.success
    },
    onSuccess: (ok) => { if (ok) invalidate() },
  })

  const toggleAuthorStatusMutation = useMutation({
    mutationFn: async (id: string) => {
      const result = await branchDetailUseCase.toggleAuthorStatus(id)
      return result.success
    },
    onSuccess: (ok) => { if (ok) invalidate() },
  })

  const deleteTranslatorMutation = useMutation({
    mutationFn: async (id: string) => {
      const result = await branchDetailUseCase.deleteTranslator(id)
      return result.success
    },
    onSuccess: (ok) => { if (ok) invalidate() },
  })

  const toggleTranslatorStatusMutation = useMutation({
    mutationFn: async (id: string) => {
      const result = await branchDetailUseCase.toggleTranslatorStatus(id)
      return result.success
    },
    onSuccess: (ok) => { if (ok) invalidate() },
  })

  const deleteStaffMutation = useMutation({
    mutationFn: async (id: string) => {
      const result = await branchDetailUseCase.deleteStaff(id)
      return result.success
    },
    onSuccess: (ok) => { if (ok) invalidate() },
  })

  const toggleStaffStatusMutation = useMutation({
    mutationFn: async (id: string) => {
      const result = await branchDetailUseCase.toggleStaffStatus(id)
      return result.success
    },
    onSuccess: (ok) => { if (ok) invalidate() },
  })

  const deleteMemberMutation = useMutation({
    mutationFn: async (id: string) => {
      const result = await branchDetailUseCase.deleteMember(id)
      return result.success
    },
    onSuccess: (ok) => { if (ok) invalidate() },
  })

  const toggleMemberStatusMutation = useMutation({
    mutationFn: async (id: string) => {
      const result = await branchDetailUseCase.toggleMemberStatus(id)
      return result.success
    },
    onSuccess: (ok) => { if (ok) invalidate() },
  })

  async function deleteSubBranch(id: string): Promise<void> {
    deleteSubBranchMutation.mutate(id)
  }

  async function toggleSubBranchStatus(id: string): Promise<void> {
    toggleSubBranchStatusMutation.mutate(id)
  }

  async function deleteBook(id: string): Promise<void> {
    deleteBookMutation.mutate(id)
  }

  async function toggleBookStatus(id: string): Promise<void> {
    toggleBookStatusMutation.mutate(id)
  }

  async function deleteAuthor(id: string): Promise<void> {
    deleteAuthorMutation.mutate(id)
  }

  async function toggleAuthorStatus(id: string): Promise<void> {
    toggleAuthorStatusMutation.mutate(id)
  }

  async function deleteTranslator(id: string): Promise<void> {
    deleteTranslatorMutation.mutate(id)
  }

  async function toggleTranslatorStatus(id: string): Promise<void> {
    toggleTranslatorStatusMutation.mutate(id)
  }

  async function deleteStaff(id: string): Promise<void> {
    deleteStaffMutation.mutate(id)
  }

  async function toggleStaffStatus(id: string): Promise<void> {
    toggleStaffStatusMutation.mutate(id)
  }

  async function deleteMember(id: string): Promise<void> {
    deleteMemberMutation.mutate(id)
  }

  async function toggleMemberStatus(id: string): Promise<void> {
    toggleMemberStatusMutation.mutate(id)
  }

  return {
    deleteSubBranch,
    toggleSubBranchStatus,
    deleteBook,
    toggleBookStatus,
    deleteAuthor,
    toggleAuthorStatus,
    deleteTranslator,
    toggleTranslatorStatus,
    deleteStaff,
    toggleStaffStatus,
    deleteMember,
    toggleMemberStatus,
  }
}
