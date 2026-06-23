"use client"

import { useState } from "react"
import { useMutation } from "@tanstack/react-query"

import type { LoginType } from "@/domain/entities/LoginType"
import type { User } from "@/domain/entities/User"
import type { AuthUseCase } from "@/domain/usecases/auth/AuthUseCase"
import type { Result } from "@/domain/result/Result"
import type {
  LoginAsyncStatus,
  LoginFormState,
  LoginViewModelState,
} from "./LoginViewModelState"

type LoginViewModel = {
  state: LoginViewModelState
  updateUsername: (value: string) => void
  updatePassword: (value: string) => void
  updateLoginType: (value: LoginType) => void
  submit: () => Promise<void>
  logout: () => Promise<void>
}

const emptyForm: LoginFormState = {
  username: "",
  password: "",
  loginType: "main",
}

export function useLoginViewModel(authUseCase: AuthUseCase): LoginViewModel {
  const [formState, setFormState] = useState<LoginFormState>(emptyForm)

  const loginMutation = useMutation({
    throwOnError: false,
    mutationFn: async (credentials: LoginFormState): Promise<Result<User>> => {
      try {
        return await authUseCase.login(credentials)
      } catch (cause) {
        const message =
          cause instanceof Error
            ? cause.message
            : "Something went wrong. Please try again."
        return { success: false, error: message }
      }
    },
  })

  const logoutMutation = useMutation({
    throwOnError: false,
    mutationFn: async (): Promise<Result<null>> => authUseCase.logout(),
  })

  function updateUsername(value: string): void {
    setFormState((prev) => ({ ...prev, username: value }))
    loginMutation.reset()
  }

  function updatePassword(value: string): void {
    setFormState((prev) => ({ ...prev, password: value }))
    loginMutation.reset()
  }

  function updateLoginType(value: LoginType): void {
    setFormState((prev) => ({ ...prev, loginType: value }))
    loginMutation.reset()
  }

  function submit(): Promise<void> {
    return new Promise((resolve) => {
      loginMutation.mutate(
        {
          username: formState.username,
          password: formState.password,
          loginType: formState.loginType,
        },
        { onSettled: () => resolve() }
      )
    })
  }

  async function logout(): Promise<void> {
    const result = await logoutMutation.mutateAsync()
    if (!result.success) return
    setFormState(emptyForm)
    loginMutation.reset()
    logoutMutation.reset()
  }

  const loginResult = loginMutation.data
  const loginSucceeded =
    loginMutation.isSuccess && loginResult !== undefined && loginResult.success
  const loggedInUser: User | null = loginSucceeded ? loginResult.data : null

  const status: LoginAsyncStatus = (() => {
    if (loginMutation.isPending || logoutMutation.isPending) return "loading"
    if (loginSucceeded) return "success"
    if (
      (loginMutation.isSuccess &&
        loginResult !== undefined &&
        !loginResult.success) ||
      loginMutation.isError ||
      (logoutMutation.isSuccess &&
        logoutMutation.data !== undefined &&
        !logoutMutation.data.success) ||
      logoutMutation.isError
    ) {
      return "error"
    }
    return "idle"
  })()

  const loginError =
    loginMutation.isSuccess && loginResult !== undefined && !loginResult.success
      ? loginResult.error
      : loginMutation.isError
        ? "Something went wrong. Please try again."
        : null
  const logoutError =
    logoutMutation.isSuccess &&
    logoutMutation.data !== undefined &&
    !logoutMutation.data.success
      ? logoutMutation.data.error
      : logoutMutation.isError
        ? "Something went wrong. Please try again."
        : null

  const state: LoginViewModelState = {
    ...formState,
    status,
    user: loggedInUser,
    error: loginError ?? logoutError,
    isLoading: loginMutation.isPending || logoutMutation.isPending,
    successMessage:
      loginSucceeded && loggedInUser
        ? `Welcome back, ${loggedInUser.fullName}`
        : null,
  }

  return {
    state,
    updateUsername,
    updatePassword,
    updateLoginType,
    submit,
    logout,
  }
}
