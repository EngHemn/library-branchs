"use client"

import type { Branch } from "@/domain/entities/branch/Branch"
import type { CreateMemberInput } from "@/domain/repositories/MemberManagementRepository"
import type { BranchManagementUseCase } from "@/domain/usecases/branch/BranchManagementUseCase"
import type { MemberManagementUseCase } from "@/domain/usecases/members/MemberManagementUseCase"

export type CreateMemberStatus =
  | "idle"
  | "loading"
  | "ready"
  | "saving"
  | "saved"
  | "error"

export type CreateMemberViewModelState = {
  status: CreateMemberStatus
  branches: Branch[]
  error: string | null
  isLoading: boolean
  isReady: boolean
  isSaving: boolean
  isSaved: boolean
}
