"use client"

import type { BranchType } from "@/domain/entities/branch/Branch"
import type { User } from "@/domain/entities/User"

export type LoginFormState = {
  username: string
  password: string
  branchType: BranchType
}

export type LoginAsyncStatus = "idle" | "loading" | "success" | "error"

export type LoginViewModelState = LoginFormState & {
  status: LoginAsyncStatus
  user: User | null
  error: string | null
  isLoading: boolean
  successMessage: string | null
}
