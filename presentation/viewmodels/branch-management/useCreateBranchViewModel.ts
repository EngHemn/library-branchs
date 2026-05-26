"use client"

import { useCallback, useEffect, useMemo, useState } from "react"

import type { Branch, BranchType } from "@/domain/entities/branch/Branch"
import type { CreateBranchInput } from "@/domain/repositories/BranchManagementRepository"
import type { BranchManagementUseCase } from "@/domain/usecases/branch/BranchManagementUseCase"
import {
  type CreateBranchFormErrors,
  getCreateBranchFieldErrors,
  validateCreateBranchForm,
} from "@/domain/validators/branch/validateCreateBranchForm"

type CreateBranchStatus =
  | "idle"
  | "loading"
  | "ready"
  | "saving"
  | "saved"
  | "error"

type CreateBranchFormState = {
  branchName: string
  type: BranchType | ""
  email: string
  adminName: string
  parentBranch: string | null
  address: string
  phone: string
  latitude: number | null
  longitude: number | null
}

type CreateBranchViewModelState = {
  status: CreateBranchStatus
  form: CreateBranchFormState
  fieldErrors: CreateBranchFormErrors
  mainBranches: Branch[]
  error: string | null
  isLoading: boolean
  isReady: boolean
  isSaving: boolean
  isSaved: boolean
  isError: boolean
}

type CreateBranchViewModel = {
  state: CreateBranchViewModelState
  setField: (field: keyof CreateBranchFormState, value: string | null) => void
  setLocation: (latitude: number | null, longitude: number | null) => void
  save: () => Promise<void>
}

const emptyForm: CreateBranchFormState = {
  branchName: "",
  type: "",
  email: "",
  adminName: "",
  parentBranch: null,
  address: "",
  phone: "",
  latitude: null,
  longitude: null,
}

const emptyFieldErrors: CreateBranchFormErrors = {
  branchName: null,
  type: null,
  email: null,
  adminName: null,
  address: null,
  phone: null,
  parentBranch: null,
  location: null,
}

function formToCreateInput(form: CreateBranchFormState): CreateBranchInput {
  return {
    branchName: form.branchName,
    type: (form.type || "main") as BranchType,
    email: form.email,
    adminName: form.adminName,
    parentBranch: form.type === "sub" ? form.parentBranch : null,
    address: form.address,
    phone: form.phone,
    latitude: form.latitude,
    longitude: form.longitude,
  }
}

export function useCreateBranchViewModel(
  branchManagementUseCase: BranchManagementUseCase
): CreateBranchViewModel {
  const [status, setStatus] = useState<CreateBranchStatus>("idle")
  const [form, setForm] = useState<CreateBranchFormState>(emptyForm)
  const [mainBranches, setMainBranches] = useState<Branch[]>([])
  const [error, setError] = useState<string | null>(null)
  const [showFieldErrors, setShowFieldErrors] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function loadMainBranches(): Promise<void> {
      setStatus("loading")

      const result = await branchManagementUseCase.getBranches()

      if (cancelled) {
        return
      }

      if (result.success) {
        setMainBranches(result.data.filter((branch) => branch.type === "main"))
      }

      setStatus("ready")
    }

    void loadMainBranches()

    return () => {
      cancelled = true
    }
  }, [branchManagementUseCase])

  const fieldErrors = useMemo<CreateBranchFormErrors>(() => {
    if (!form.type) {
      return {
        ...emptyFieldErrors,
        type: showFieldErrors ? "Branch type is required" : null,
      }
    }

    return getCreateBranchFieldErrors(formToCreateInput(form))
  }, [form, showFieldErrors])

  const setField = useCallback(
    (field: keyof CreateBranchFormState, value: string | null): void => {
      setForm((currentForm) => {
        const updated = { ...currentForm, [field]: value }

        if (field === "type" && value !== "sub") {
          updated.parentBranch = null
        }

        return updated
      })
    },
    []
  )

  const setLocation = useCallback(
    (latitude: number | null, longitude: number | null): void => {
      setForm((currentForm) => ({
        ...currentForm,
        latitude,
        longitude,
      }))
    },
    []
  )

  const save = useCallback(async (): Promise<void> => {
    setShowFieldErrors(true)

    if (!form.type) {
      return
    }

    const input = formToCreateInput(form)
    const validationResult = validateCreateBranchForm(input)

    if (!validationResult.success) {
      return
    }

    setStatus("saving")
    setError(null)

    const result = await branchManagementUseCase.createBranch(
      validationResult.data
    )

    if (!result.success) {
      setStatus("ready")
      setError(result.error)
      return
    }

    setStatus("saved")
  }, [branchManagementUseCase, form])

  const state = useMemo<CreateBranchViewModelState>(
    () => ({
      status,
      form,
      fieldErrors: showFieldErrors ? fieldErrors : emptyFieldErrors,
      mainBranches,
      error,
      isLoading: status === "idle" || status === "loading",
      isReady: status === "ready",
      isSaving: status === "saving",
      isSaved: status === "saved",
      isError: status === "error",
    }),
    [error, fieldErrors, form, mainBranches, showFieldErrors, status]
  )

  return {
    state,
    setField,
    setLocation,
    save,
  }
}
