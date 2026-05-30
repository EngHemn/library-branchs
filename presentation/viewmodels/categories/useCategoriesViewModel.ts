"use client"

import { useState } from "react"
import { useForm, type UseFormReturn } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import type { Category } from "@/domain/entities/category/Category"
import {
  categoryFormSchema,
  type CategoryFormValues,
} from "@/domain/schemas/categoryFormSchema"
import {
  concatCategoryFormSchema,
  type ConcatCategoryFormValues,
} from "@/domain/schemas/concatCategoryFormSchema"
import type { GetCategoriesUseCase } from "@/domain/usecases/categories/GetCategoriesUseCase"

type CategoriesStatus = "idle" | "loading" | "ready" | "error"
type CategoryFormMode = "create" | "edit" | null

type CategoriesViewModelState = {
  status: CategoriesStatus
  categories: Category[]
  filteredCategories: Category[]
  searchQuery: string
  statusFilter: "all" | "active" | "inactive"
  formMode: CategoryFormMode
  editingCategoryId: string | null
  error: string | null
  formError: string | null
  isLoading: boolean
  isReady: boolean
  isSaving: boolean
  isDeleting: boolean
  isFormOpen: boolean
  isConcatOpen: boolean
  isConcating: boolean
  concatError: string | null
}

type CategoriesViewModel = {
  state: CategoriesViewModelState
  form: UseFormReturn<CategoryFormValues>
  concatForm: UseFormReturn<ConcatCategoryFormValues>
  setSearchQuery: (value: string) => void
  setStatusFilter: (value: "all" | "active" | "inactive") => void
  openCreateDialog: () => void
  openEditDialog: (category: Category) => void
  closeFormDialog: () => void
  openConcatDialog: () => void
  closeConcatDialog: () => void
  saveCategory: (values: CategoryFormValues) => Promise<void>
  concatCategories: (values: ConcatCategoryFormValues) => Promise<void>
  deleteCategory: (categoryId: string) => Promise<void>
  reload: () => Promise<void>
}

type SaveCategoryInput = {
  values: CategoryFormValues
  mode: CategoryFormMode
  categoryId: string | null
}

export function useCategoriesViewModel(
  getCategoriesUseCase: GetCategoriesUseCase
): CategoriesViewModel {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">(
    "all"
  )
  const [formMode, setFormMode] = useState<CategoryFormMode>(null)
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(
    null
  )
  const [formError, setFormError] = useState<string | null>(null)
  const [operationError, setOperationError] = useState<string | null>(null)
  const [isConcatOpen, setIsConcatOpen] = useState(false)
  const [concatError, setConcatError] = useState<string | null>(null)

  const queryClient = useQueryClient()

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  })

  const concatForm = useForm<ConcatCategoryFormValues>({
    resolver: zodResolver(concatCategoryFormSchema),
    defaultValues: {
      sourceCategoryIds: [],
      name: "",
      description: "",
      status: "active",
    },
  })

  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const result = await getCategoriesUseCase.getCategories()
      if (!result.success) throw new Error(result.error)
      return result.data
    },
  })

  const saveMutation = useMutation({
    mutationFn: async ({ values, mode, categoryId }: SaveCategoryInput) => {
      const result =
        mode === "edit" && categoryId
          ? await getCategoriesUseCase.updateCategory({
              id: categoryId,
              ...values,
            })
          : await getCategoriesUseCase.createCategory(values)
      if (!result.success) throw new Error(result.error)
      return result.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] })
      closeFormDialog()
    },
    onError: (err: Error) => setFormError(err.message),
  })

  const deleteMutation = useMutation({
    mutationFn: async (categoryId: string) => {
      const result = await getCategoriesUseCase.deleteCategory(categoryId)
      if (!result.success) throw new Error(result.error)
      return result.data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["categories"] }),
    onError: (err: Error) => setOperationError(err.message),
  })

  const concatMutation = useMutation({
    mutationFn: async (values: ConcatCategoryFormValues) => {
      const result = await getCategoriesUseCase.concatCategories(values)
      if (!result.success) throw new Error(result.error)
      return result.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] })
      closeConcatDialog()
    },
    onError: (err: Error) => setConcatError(err.message),
  })

  const categories = categoriesQuery.data ?? []

  const status: CategoriesStatus = categoriesQuery.isSuccess
    ? "ready"
    : categoriesQuery.isError
      ? "error"
      : "loading"

  const filteredCategories = categories.filter((category) => {
    const normalizedSearch = searchQuery.trim().toLowerCase()
    const matchesSearch =
      normalizedSearch.length === 0 ||
      category.name.toLowerCase().includes(normalizedSearch) ||
      category.description.toLowerCase().includes(normalizedSearch) ||
      category.id.toLowerCase().includes(normalizedSearch)

    const matchesStatus =
      statusFilter === "all" ? true : category.status === statusFilter

    return matchesSearch && matchesStatus
  })

  function openCreateDialog(): void {
    setFormMode("create")
    setEditingCategoryId(null)
    setFormError(null)
    form.reset({ name: "", description: "" })
  }

  function openEditDialog(category: Category): void {
    setFormMode("edit")
    setEditingCategoryId(category.id)
    setFormError(null)
    form.reset({
      name: category.name,
      description: category.description,
    })
  }

  function closeFormDialog(): void {
    setFormMode(null)
    setEditingCategoryId(null)
    setFormError(null)
    form.reset({ name: "", description: "" })
  }

  function openConcatDialog(): void {
    setConcatError(null)
    concatForm.reset({
      sourceCategoryIds: [],
      name: "",
      description: "",
      status: "active",
    })
    setIsConcatOpen(true)
  }

  function closeConcatDialog(): void {
    setConcatError(null)
    concatForm.reset({
      sourceCategoryIds: [],
      name: "",
      description: "",
      status: "active",
    })
    setIsConcatOpen(false)
  }

  async function saveCategory(values: CategoryFormValues): Promise<void> {
    setFormError(null)
    try {
      await saveMutation.mutateAsync({ values, mode: formMode, categoryId: editingCategoryId })
    } catch {
      // error handled in onError callback
    }
  }

  async function concatCategories(
    values: ConcatCategoryFormValues
  ): Promise<void> {
    setConcatError(null)
    try {
      await concatMutation.mutateAsync(values)
    } catch {
      // error handled in onError callback
    }
  }

  async function deleteCategory(categoryId: string): Promise<void> {
    setOperationError(null)
    try {
      await deleteMutation.mutateAsync(categoryId)
    } catch {
      // error handled in onError callback
    }
  }

  async function reload(): Promise<void> {
    await categoriesQuery.refetch()
  }

  const state: CategoriesViewModelState = {
    status,
    categories,
    filteredCategories,
    searchQuery,
    statusFilter,
    formMode,
    editingCategoryId,
    error: operationError ?? categoriesQuery.error?.message ?? null,
    formError,
    isLoading: status === "loading",
    isReady: status === "ready",
    isSaving: saveMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isFormOpen: formMode !== null,
    isConcatOpen,
    isConcating: concatMutation.isPending,
    concatError,
  }

  return {
    state,
    form,
    concatForm,
    setSearchQuery,
    setStatusFilter,
    openCreateDialog,
    openEditDialog,
    closeFormDialog,
    openConcatDialog,
    closeConcatDialog,
    saveCategory,
    concatCategories,
    deleteCategory,
    reload,
  }
}
