"use client"

import { useEffect, useState } from "react"
import { useMutation, useQuery } from "@tanstack/react-query"

import type {
  Branch,
  BranchType,
  MainBranchRequest,
} from "@/domain/entities/branch/Branch"
import type { CreateBranchInput } from "@/domain/repositories/BranchManagementRepository"
import type { BranchManagementUseCase } from "@/domain/usecases/branch/BranchManagementUseCase"
import {
  type CreateBranchFormErrors,
  getCreateBranchFieldErrors,
  validateCreateBranchForm,
} from "@/domain/validators/branch/validateCreateBranchForm"
import { generatePassword } from "@/lib/generatePassword"

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
  password: string
}

type CreateBranchViewModelState = {
  status: CreateBranchStatus
  form: CreateBranchFormState
  fieldErrors: CreateBranchFormErrors
  mainBranches: Branch[]
  mainBranchRequests: MainBranchRequest[]
  appliedRequestId: string | null
  savedBranchId: string | null
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
  applyMainBranchRequest: (requestId: string) => void
  autoGeneratePassword: () => void
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
  password: "",
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
  password: null,
}

function isValidBranchType(value: string): value is BranchType {
  return value === "main" || value === "sub"
}

function formToCreateInput(form: CreateBranchFormState): CreateBranchInput {
  return {
    branchName: form.branchName,
    type: isValidBranchType(form.type) ? form.type : "main",
    email: form.email,
    adminName: form.adminName,
    parentBranch: form.type === "sub" ? form.parentBranch : null,
    address: form.address,
    phone: form.phone,
    latitude: form.latitude,
    longitude: form.longitude,
    password: form.password,
  }
}

function requestToFormState(
  request: MainBranchRequest,
  currentForm: CreateBranchFormState
): CreateBranchFormState {
  return {
    ...currentForm,
    type: "main",
    branchName: request.branchName,
    email: request.email,
    adminName: request.adminName,
    phone: request.phone,
    parentBranch: null,
    password: currentForm.password || generatePassword(),
  }
}

export function useCreateBranchViewModel(
  branchManagementUseCase: BranchManagementUseCase,
  initialRequestId?: string | null
): CreateBranchViewModel {
  const [form, setForm] = useState<CreateBranchFormState>(emptyForm)
  const [appliedRequestId, setAppliedRequestId] = useState<string | null>(null)
  const [savedBranchId, setSavedBranchId] = useState<string | null>(null)
  const [showFieldErrors, setShowFieldErrors] = useState(false)
  const [hasAppliedInitialRequest, setHasAppliedInitialRequest] = useState(false)

  const { data: prereqs, isPending: isLoadingPrereqs } = useQuery({
    queryKey: ["createBranchPrerequisites", initialRequestId ?? ""],
    queryFn: async () => {
      const [branchesResult, requestsResult] = await Promise.all([
        branchManagementUseCase.getBranches(),
        branchManagementUseCase.getMainBranchRequests(),
      ])

      const mainBranches = branchesResult.success
        ? branchesResult.data.filter((b) => b.type === "main")
        : []

      const mainBranchRequests = requestsResult.success ? requestsResult.data : []

      let initialRequest: MainBranchRequest | null = null
      if (initialRequestId) {
        const requestResult = await branchManagementUseCase.getMainBranchRequestById(initialRequestId)
        if (requestResult.success && requestResult.data) {
          initialRequest = requestResult.data
        }
      }

      return { mainBranches, mainBranchRequests, initialRequest }
    },
  })

  useEffect(() => {
    if (prereqs?.initialRequest && !hasAppliedInitialRequest) {
      setForm((currentForm) => requestToFormState(prereqs.initialRequest!, currentForm))
      setAppliedRequestId(prereqs.initialRequest.id)
      setHasAppliedInitialRequest(true)
    }
  }, [prereqs?.initialRequest, hasAppliedInitialRequest])

  const saveMutation = useMutation({
    mutationFn: async (input: CreateBranchInput) => {
      const result = await branchManagementUseCase.createBranch(input)
      if (!result.success) throw new Error(result.error)

      if (appliedRequestId) {
        await branchManagementUseCase.dismissMainBranchRequest(appliedRequestId)
      }

      return result.data
    },
    onSuccess: (branch) => {
      setSavedBranchId(branch.id)
    },
  })

  function setField(field: keyof CreateBranchFormState, value: string | null): void {
    if (field === "type" && value !== "main") {
      setAppliedRequestId(null)
    }

    setForm((currentForm) => {
      const updated = { ...currentForm, [field]: value }
      if (field === "type" && value !== "sub") {
        updated.parentBranch = null
      }
      return updated
    })
  }

  function setLocation(latitude: number | null, longitude: number | null): void {
    setForm((currentForm) => ({ ...currentForm, latitude, longitude }))
  }

  function applyMainBranchRequest(requestId: string): void {
    const request = (prereqs?.mainBranchRequests ?? []).find((item) => item.id === requestId)
    if (!request) return
    setForm((currentForm) => requestToFormState(request, currentForm))
    setAppliedRequestId(requestId)
  }

  function autoGeneratePassword(): void {
    setForm((currentForm) => ({ ...currentForm, password: generatePassword() }))
  }

  async function save(): Promise<void> {
    setShowFieldErrors(true)

    if (!isValidBranchType(form.type)) return

    const input = formToCreateInput(form)
    const validationResult = validateCreateBranchForm(input)
    if (!validationResult.success) return

    saveMutation.mutate(validationResult.data)
  }

  const fieldErrors: CreateBranchFormErrors = (() => {
    if (!isValidBranchType(form.type)) {
      return { ...emptyFieldErrors, type: showFieldErrors ? "Branch type is required" : null }
    }
    return getCreateBranchFieldErrors(formToCreateInput(form))
  })()

  const status: CreateBranchStatus = isLoadingPrereqs
    ? "loading"
    : saveMutation.isPending
    ? "saving"
    : savedBranchId !== null
    ? "saved"
    : "ready"

  const state: CreateBranchViewModelState = {
    status,
    form,
    fieldErrors: showFieldErrors ? fieldErrors : emptyFieldErrors,
    mainBranches: prereqs?.mainBranches ?? [],
    mainBranchRequests: prereqs?.mainBranchRequests ?? [],
    appliedRequestId,
    savedBranchId,
    error: saveMutation.isError
      ? (saveMutation.error instanceof Error ? saveMutation.error.message : null)
      : null,
    isLoading: status === "loading",
    isReady: status === "ready",
    isSaving: status === "saving",
    isSaved: status === "saved",
    isError: false,
  }

  return {
    state,
    setField,
    setLocation,
    applyMainBranchRequest,
    autoGeneratePassword,
    save,
  }
}
