"use client"

import { useCallback, useMemo, useState } from "react"

import type { User } from "@/domain/entities/User"
import type { AuthUseCase } from "@/domain/usecases/auth/AuthUseCase"

type LoginAsyncState =
  | {
      status: "idle"
      data: null
      error: null
    }
  | {
      status: "loading"
      data: null
      error: null
    }
  | {
      status: "success"
      data: User
      error: null
    }
  | {
      status: "error"
      data: null
      error: string
    }

type LoginFormState = {
  username: string
  password: string
}

type LoginViewModelState = LoginFormState & {
  status: LoginAsyncState["status"]
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

const idleState: LoginAsyncState = {
  status: "idle",
  data: null,
  error: null,
}

export function useLoginViewModel(authUseCase: AuthUseCase): LoginViewModel {
  const [formState, setFormState] = useState<LoginFormState>({
    username: "",
    password: "",
  })
  const [asyncState, setAsyncState] = useState<LoginAsyncState>(idleState)

  const updateUsername = useCallback((value: string): void => {
    setFormState((currentState) => ({
      ...currentState,
      username: value,
    }))
    setAsyncState(idleState)
  }, [])

  const updatePassword = useCallback((value: string): void => {
    setFormState((currentState) => ({
      ...currentState,
      password: value,
    }))
    setAsyncState(idleState)
  }, [])

  const submit = useCallback(async (): Promise<void> => {
    setAsyncState({
      status: "loading",
      data: null,
      error: null,
    })

    const result = await authUseCase.login(formState)

    if (!result.success) {
      setAsyncState({
        status: "error",
        data: null,
        error: result.error,
      })
      return
    }

    setAsyncState({
      status: "success",
      data: result.data,
      error: null,
    })
  }, [formState, authUseCase])

  const logout = useCallback(async (): Promise<void> => {
    setAsyncState({
      status: "loading",
      data: null,
      error: null,
    })

    const result = await authUseCase.logout()

    if (!result.success) {
      setAsyncState({
        status: "error",
        data: null,
        error: result.error,
      })
      return
    }

    setFormState({
      username: "",
      password: "",
    })
    setAsyncState(idleState)
  }, [authUseCase])

  const state = useMemo<LoginViewModelState>(
    () => ({
      ...formState,
      status: asyncState.status,
      user: asyncState.status === "success" ? asyncState.data : null,
      error: asyncState.status === "error" ? asyncState.error : null,
      isLoading: asyncState.status === "loading",
      successMessage:
        asyncState.status === "success"
          ? `Welcome back, ${asyncState.data.fullName}`
          : null,
    }),
    [asyncState, formState]
  )

  return {
    state,
    updateUsername,
    updatePassword,
    submit,
    logout,
  }
}
