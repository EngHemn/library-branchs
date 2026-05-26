"use client"

import { useCallback, useEffect, useMemo, useState } from "react"

import type { Branch } from "@/domain/entities/branch/Branch"
import type { UpdateBranchInput } from "@/domain/repositories/BranchManagementRepository"
import type { BranchManagementUseCase } from "@/domain/usecases/branch/BranchManagementUseCase"
import {
  type BranchFormErrors,
  getFieldErrors,
  validateBranchForm,
} from "@/domain/validators/branch/validateBranchForm"

type EditBranchStatus =
  | "idle"
  | "loading"
  | "loaded"
  | "not-found"
  | "saving"
  | "saved"
  | "error"

type EditBranchFormState = {
  branchName: string
  email: string
  adminName: string
  parentBranch: string | null
  address: string
  phone: string
  latitude: number | null
  longitude: number | null
}

type EditBranchViewModelState = {
  status: EditBranchStatus
  branch: Branch | null
  form: EditBranchFormState
  fieldErrors: BranchFormErrors
  mainBranches: Branch[]
  error: string | null
  showFieldErrors: boolean
  isLoading: boolean
  isLoaded: boolean
  isSaving: boolean
  isSaved: boolean
  isNotFound: boolean
  isError: boolean
}

type EditBranchViewModel = {
  state: EditBranchViewModelState
  setField: (field: keyof EditBranchFormState, value: string | number | null) => void
  setLocation: (latitude: number | null, longitude: number | null) => void
  save: () => Promise<void>
}

const emptyForm: EditBranchFormState = {
  branchName: "",
  email: "",
  adminName: "",
  parentBranch: null,
  address: "",
  phone: "",
  latitude: null,
  longitude: null,
}

const emptyFieldErrors: BranchFormErrors = {
  branchName: null,
  email: null,
  adminName: null,
  address: null,
  phone: null,
  parentBranch: null,
}

function branchToFormState(branch: Branch): EditBranchFormState {
  return {
    branchName: branch.branchName,
    email: branch.email,
    adminName: branch.adminName,
    parentBranch: branch.parentBranch,
    address: branch.address,
    phone: branch.phone,
    latitude: branch.latitude,
    longitude: branch.longitude,
  }
}

function formToUpdateInput(form: EditBranchFormState): UpdateBranchInput {
  return {
    branchName: form.branchName,
    email: form.email,
    adminName: form.adminName,
    parentBranch: form.parentBranch,
    address: form.address,
    phone: form.phone,
    latitude: form.latitude,
    longitude: form.longitude,
  }
}

export function useEditBranchViewModel(
  branchId: string,
  branchManagementUseCase: BranchManagementUseCase
): EditBranchViewModel {
  const [status, setStatus] = useState<EditBranchStatus>("idle")
  const [branch, setBranch] = useState<Branch | null>(null)
  const [form, setForm] = useState<EditBranchFormState>(emptyForm)
  const [mainBranches, setMainBranches] = useState<Branch[]>([])
  const [error, setError] = useState<string | null>(null)
  const [showFieldErrors, setShowFieldErrors] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function loadBranch(): Promise<void> {
      setStatus("loading")
      setError(null)

      const [branchResult, branchesResult] = await Promise.all([
        branchManagementUseCase.getBranchById(branchId),
        branchManagementUseCase.getBranches(),
      ])

      if (cancelled) {
        return
      }

      if (!branchResult.success) {
        setStatus("error")
        setError(branchResult.error)
        return
      }

      if (!branchResult.data) {
        setStatus("not-found")
        return
      }

      if (branchesResult.success) {
        setMainBranches(
          branchesResult.data.filter(
            (item) => item.type === "main" && item.id !== branchId
          )
        )
      }

      setBranch(branchResult.data)
      setForm(branchToFormState(branchResult.data))
      setStatus("loaded")
    }

    void loadBranch()

    return () => {
      cancelled = true
    }
  }, [branchId, branchManagementUseCase])

  const fieldErrors = useMemo<BranchFormErrors>(() => {
    if (!branch) {
      return emptyFieldErrors
    }

    return getFieldErrors(formToUpdateInput(form), branch.type)
  }, [branch, form])

  const setField = useCallback(
    (field: keyof EditBranchFormState, value: string | number | null): void => {
      setForm((currentForm) => ({
        ...currentForm,
        [field]: value,
      }))
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
    if (!branch) {
      return
    }

    setShowFieldErrors(true)

    const input = formToUpdateInput(form)
    const validationResult = validateBranchForm(input, branch.type)

    if (!validationResult.success) {
      return
    }

    setStatus("saving")
    setError(null)

    const result = await branchManagementUseCase.updateBranch(
      branch.id,
      validationResult.data
    )

    if (!result.success) {
      setStatus("loaded")
      setError(result.error)
      return
    }

    setBranch(result.data)
    setStatus("saved")
  }, [branch, branchManagementUseCase, form])

  const state = useMemo<EditBranchViewModelState>(
    () => ({
      status,
      branch,
      form,
      fieldErrors: showFieldErrors ? fieldErrors : emptyFieldErrors,
      mainBranches,
      error,
      showFieldErrors,
      isLoading: status === "idle" || status === "loading",
      isLoaded: status === "loaded",
      isSaving: status === "saving",
      isSaved: status === "saved",
      isNotFound: status === "not-found",
      isError: status === "error",
    }),
    [
      branch,
      error,
      fieldErrors,
      form,
      mainBranches,
      showFieldErrors,
      status,
    ]
  )

  return {
    state,
    setField,
    setLocation,
    save,
  }
}
