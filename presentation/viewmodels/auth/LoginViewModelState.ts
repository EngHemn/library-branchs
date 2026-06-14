"use client"

import type { LoginType } from "@/domain/entities/LoginType"
import type { User } from "@/domain/entities/User"

export type LoginFormState = {
  username: string
  password: string
  loginType: LoginType
}

export type LoginAsyncStatus = "idle" | "loading" | "success" | "error"

export type LoginViewModelState = LoginFormState & {
  status: LoginAsyncStatus
  user: User | null
  error: string | null
  isLoading: boolean
  successMessage: string | null
}
