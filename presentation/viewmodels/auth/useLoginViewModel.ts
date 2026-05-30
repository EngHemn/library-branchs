"use client"

import { useState } from "react"
import { useMutation } from "@tanstack/react-query"

import type { User } from "@/domain/entities/User"
import type { AuthUseCase } from "@/domain/usecases/auth/AuthUseCase"

type LoginFormState = {
  username: string
  password: string
}

type LoginAsyncStatus = "idle" | "loading" | "success" | "error"

type LoginViewModelState = LoginFormState & {
  status: LoginAsyncStatus
  user: User | null
  error: string | null
  isLoading: boolean
  successMessage: string | null
}

type LoginViewModel = {
  state: LoginViewModelState
  updateUsername: (value: string) => void
  updatePassword: (value: string) => void
  submit: () => Promise<void>
  logout: () => Promise<void>
}

const emptyForm: LoginFormState = { username: "", password: "" }

export function useLoginViewModel(authUseCase: AuthUseCase): LoginViewModel {
  const [formState, setFormState] = useState<LoginFormState>(emptyForm)

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginFormState) => {
      const result = await authUseCase.login(credentials)
      if (!result.success) throw new Error(result.error)
      return result.data
    },
  })

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const result = await authUseCase.logout()
      if (!result.success) throw new Error(result.error)
    },
  })

  function updateUsername(value: string): void {
    setFormState((prev) => ({ ...prev, username: value }))
    loginMutation.reset()
  }

  function updatePassword(value: string): void {
    setFormState((prev) => ({ ...prev, password: value }))
    loginMutation.reset()
  }

  async function submit(): Promise<void> {
    await loginMutation.mutateAsync(formState)
  }

  async function logout(): Promise<void> {
    await logoutMutation.mutateAsync()
    setFormState(emptyForm)
    loginMutation.reset()
    logoutMutation.reset()
  }

  const status: LoginAsyncStatus = (() => {
    if (loginMutation.isPending || logoutMutation.isPending) return "loading"
    if (loginMutation.isSuccess) return "success"
    if (loginMutation.isError || logoutMutation.isError) return "error"
    return "idle"
  })()

  const loginError =
    loginMutation.isError && loginMutation.error instanceof Error
      ? loginMutation.error.message
      : null
  const logoutError =
    logoutMutation.isError && logoutMutation.error instanceof Error
      ? logoutMutation.error.message
      : null

  const state: LoginViewModelState = {
    ...formState,
    status,
    user: loginMutation.isSuccess ? loginMutation.data : null,
    error: loginError ?? logoutError,
    isLoading: loginMutation.isPending || logoutMutation.isPending,
    successMessage: loginMutation.isSuccess
      ? `Welcome back, ${loginMutation.data.fullName}`
      : null,
  }

  return { state, updateUsername, updatePassword, submit, logout }
}
