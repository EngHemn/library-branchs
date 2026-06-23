"use client"

import { useEffect, useState } from "react"
import { useForm, type Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { locationValuesFromParts } from "@/domain/entities/shelf/ShelfLocationOptions"
import {
  shelfFormSchema,
  type ShelfFormValues,
} from "@/domain/schemas/shelfFormSchema"
import type { AuthUseCase } from "@/domain/usecases/auth/AuthUseCase"
import type { ShelfManagementUseCase } from "@/domain/usecases/shelves/ShelfManagementUseCase"
import {
  getShelfBranchFormOptions,
  getShelfDashboardBranchScope,
} from "@/lib/shelfBranchScope"
import type {
  EditShelfStatus,
  EditShelfViewModelState,
  ShelfFormStep,
} from "./EditShelfViewModelState"
import { useShelfLocationOptionsMutations } from "./useShelfLocationOptionsMutations"

type EditShelfViewModel = {
  state: EditShelfViewModelState
  form: ReturnType<typeof useForm<ShelfFormValues>>
  goNext: () => Promise<void>
  goBack: () => void
  save: () => Promise<void>
  addLocationValue: (stepId: string, value: string) => Promise<void>
  updateLocationValue: (
    stepId: string,
    currentValue: string,
    value: string
  ) => Promise<void>
  deleteLocationValue: (stepId: string, value: string) => Promise<void>
  addLocationStep: (label: string) => Promise<void>
  updateLocationStep: (stepId: string, label: string) => Promise<void>
  deleteLocationStep: (stepId: string) => Promise<void>
}

function hasLocationStepValue(
  values: Record<string, string>,
  stepId: string
): boolean {
  return (values[stepId] ?? "").trim().length > 0
}

function hasAllLocationStepValues(
  values: Record<string, string>,
  stepIds: string[]
): boolean {
  return stepIds.every((stepId) => hasLocationStepValue(values, stepId))
}

export function useEditShelfViewModel(
  shelfId: string,
  authUseCase: AuthUseCase,
  shelfManagementUseCase: ShelfManagementUseCase
): EditShelfViewModel {
  const queryClient = useQueryClient()
  const [error, setError] = useState<string | null>(null)
  const [currentStep, setCurrentStep] = useState<ShelfFormStep>(1)
  const [locationStepIndex, setLocationStepIndex] = useState(0)
  const locationMutations = useShelfLocationOptionsMutations(
    shelfManagementUseCase
  )

  const form = useForm<ShelfFormValues>({
    resolver: zodResolver(shelfFormSchema) as Resolver<ShelfFormValues>,
    defaultValues: {
      name: "",
      shelfType: "standard",
      branchId: "",
      capacity: 1,
      status: "active",
      locationValues: {},
    },
  })

  const userQuery = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const result = await authUseCase.getCurrentUser()
      if (!result.success) throw new Error(result.error)
      return result.data ?? null
    },
  })

  const shelfQuery = useQuery({
    queryKey: ["shelf", shelfId],
    queryFn: async () => {
      const result = await shelfManagementUseCase.getShelfById(shelfId)
      if (!result.success) throw new Error(result.error)
      return result.data
    },
    enabled: userQuery.isSuccess,
  })

  const locationOptionsQuery = useQuery({
    queryKey: ["shelfLocationOptions"],
    queryFn: async () => {
      const result = await shelfManagementUseCase.getLocationOptions()
      if (!result.success) throw new Error(result.error)
      return result.data
    },
    enabled: userQuery.isSuccess,
  })

  useEffect(() => {
    const shelf = shelfQuery.data
    if (!shelf) return

    form.reset({
      name: shelf.name,
      shelfType: shelf.shelfType,
      branchId: shelf.branchId,
      capacity: shelf.capacity,
      status: shelf.status,
      locationValues: locationValuesFromParts(shelf.locationParts),
    })
  }, [shelfQuery.data, form])

  const user = userQuery.data ?? null
  const branchScope = user ? getShelfDashboardBranchScope(user) : null
  const branchOptions = user ? getShelfBranchFormOptions(user) : []
  const canSelectBranch = branchScope?.showBranchFilter ?? false
  const locationOptions = locationOptionsQuery.data ?? null

  useEffect(() => {
    if (!locationOptions) return
    if (locationStepIndex >= locationOptions.steps.length) {
      setLocationStepIndex(Math.max(locationOptions.steps.length - 1, 0))
    }
  }, [locationOptions, locationStepIndex])

  const updateMutation = useMutation({
    mutationFn: async (values: ShelfFormValues) => {
      const result = await shelfManagementUseCase.updateShelf({
        id: shelfId,
        ...values,
      })
      if (!result.success) throw new Error(result.error)
      return result.data
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["shelves"] })
      void queryClient.invalidateQueries({ queryKey: ["shelf", shelfId] })
    },
    onError: (err: Error) => setError(err.message),
  })

  const branchId = form.watch("branchId")
  const selectedBranchName =
    branchOptions.find((branch) => branch.id === branchId)?.name ??
    shelfQuery.data?.branchName ??
    ""

  async function addLocationValue(
    stepId: string,
    value: string
  ): Promise<void> {
    locationMutations.clearError()
    const added = await locationMutations.addLocationValue(stepId, value)
    if (added) {
      form.setValue(`locationValues.${stepId}`, added, { shouldValidate: true })
    }
  }

  async function updateLocationValue(
    stepId: string,
    currentValue: string,
    value: string
  ): Promise<void> {
    locationMutations.clearError()
    const updated = await locationMutations.updateLocationValue(
      stepId,
      currentValue,
      value
    )
    if (
      updated &&
      (form.getValues("locationValues")[stepId] ?? "") === currentValue
    ) {
      form.setValue(`locationValues.${stepId}`, updated, {
        shouldValidate: true,
      })
    }
  }

  async function deleteLocationValue(
    stepId: string,
    value: string
  ): Promise<void> {
    locationMutations.clearError()
    await locationMutations.deleteLocationValue(stepId, value)
  }

  async function addLocationStep(label: string): Promise<void> {
    locationMutations.clearError()
    await locationMutations.addLocationStep(label)
  }

  async function updateLocationStep(
    stepId: string,
    label: string
  ): Promise<void> {
    locationMutations.clearError()
    await locationMutations.updateLocationStep(stepId, label)
  }

  async function deleteLocationStep(stepId: string): Promise<void> {
    locationMutations.clearError()
    await locationMutations.deleteLocationStep(stepId)
  }

  async function goNext(): Promise<void> {
    setError(null)
    const steps = locationOptions?.steps ?? []

    if (currentStep === 1) {
      const valid = await form.trigger([
        "name",
        "shelfType",
        "branchId",
        "capacity",
        "status",
      ])
      if (!valid) return
      setCurrentStep(2)
      setLocationStepIndex(0)
      return
    }

    if (currentStep === 2) {
      if (steps.length === 0) {
        setError("Add at least one location step to continue.")
        return
      }

      const currentStepId = steps[locationStepIndex]?.id
      const locationValues = form.getValues("locationValues")

      if (
        !currentStepId ||
        !hasLocationStepValue(locationValues, currentStepId)
      ) {
        setError(
          `Select or add a value for ${steps[locationStepIndex]?.label ?? "this step"}.`
        )
        return
      }

      if (locationStepIndex < steps.length - 1) {
        setLocationStepIndex((index) => index + 1)
        return
      }

      if (
        !hasAllLocationStepValues(
          locationValues,
          steps.map((step) => step.id)
        )
      ) {
        setError("Complete every location step before continuing.")
        return
      }

      setCurrentStep(3)
    }
  }

  function goBack(): void {
    setError(null)
    const steps = locationOptions?.steps ?? []

    if (currentStep === 3) {
      setCurrentStep(2)
      setLocationStepIndex(Math.max(steps.length - 1, 0))
      return
    }

    if (currentStep === 2 && locationStepIndex > 0) {
      setLocationStepIndex((index) => index - 1)
      return
    }

    if (currentStep === 2 && locationStepIndex === 0) {
      setCurrentStep(1)
    }
  }

  async function save(): Promise<void> {
    setError(null)
    const valid = await form.trigger([
      "name",
      "shelfType",
      "branchId",
      "capacity",
      "status",
    ])
    if (!valid) return

    const steps = locationOptions?.steps ?? []
    if (
      !hasAllLocationStepValues(
        form.getValues("locationValues"),
        steps.map((step) => step.id)
      )
    ) {
      setError("Complete every location step before saving.")
      return
    }

    try {
      await updateMutation.mutateAsync(form.getValues())
    } catch {
      // handled in onError
    }
  }

  const isLoading =
    userQuery.isLoading ||
    shelfQuery.isLoading ||
    locationOptionsQuery.isLoading
  const notFound = shelfQuery.isSuccess && shelfQuery.data === null
  const isReady =
    userQuery.isSuccess &&
    shelfQuery.isSuccess &&
    shelfQuery.data !== null &&
    locationOptionsQuery.isSuccess
  const isSaving = updateMutation.isPending
  const isSaved = updateMutation.isSuccess

  let status: EditShelfStatus = "loading"
  if (isSaved) status = "saved"
  else if (isSaving) status = "saving"
  else if (
    userQuery.isError ||
    shelfQuery.isError ||
    locationOptionsQuery.isError
  ) {
    status = "error"
  } else if (notFound) status = "error"
  else if (isReady) status = "ready"

  const state: EditShelfViewModelState = {
    status,
    isLoading,
    isReady,
    isSaving,
    isSaved,
    notFound,
    error:
      error ??
      userQuery.error?.message ??
      shelfQuery.error?.message ??
      locationOptionsQuery.error?.message ??
      (notFound ? "Shelf not found." : null),
    currentStep,
    locationStepIndex,
    branchOptions,
    canSelectBranch,
    locationOptions,
    selectedBranchName,
    locationManageError: locationMutations.error,
    isManagingLocation: locationMutations.isPending,
  }

  return {
    state,
    form,
    goNext,
    goBack,
    save,
    addLocationValue,
    updateLocationValue,
    deleteLocationValue,
    addLocationStep,
    updateLocationStep,
    deleteLocationStep,
  }
}
