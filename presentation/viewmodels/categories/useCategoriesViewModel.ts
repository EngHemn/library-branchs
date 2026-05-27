"use client"

import { useEffect, useState } from "react"
import { useForm, type UseFormReturn } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

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

export function useCategoriesViewModel(
  getCategoriesUseCase: GetCategoriesUseCase
): CategoriesViewModel {
  const [status, setStatus] = useState<CategoriesStatus>("idle")
  const [categories, setCategories] = useState<Category[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">(
    "all"
  )
  const [formMode, setFormMode] = useState<CategoryFormMode>(null)
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(
    null
  )
  const [error, setError] = useState<string | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isConcatOpen, setIsConcatOpen] = useState(false)
  const [isConcating, setIsConcating] = useState(false)
  const [concatError, setConcatError] = useState<string | null>(null)

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema as never),
    defaultValues: {
      name: "",
      description: "",
    },
  })

  const concatForm = useForm<ConcatCategoryFormValues>({
    resolver: zodResolver(concatCategoryFormSchema as never),
    defaultValues: {
      sourceCategoryIds: [],
      name: "",
      description: "",
      status: "active",
    },
  })

  async function loadCategories(): Promise<void> {
    await Promise.resolve()
    setStatus("loading")
    setError(null)
    const result = await getCategoriesUseCase.getCategories()
    if (!result.success) {
      setCategories([])
      setStatus("error")
      setError(result.error)
      return
    }
    setCategories(result.data)
    setStatus("ready")
  }

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
    setIsSaving(true)
    setFormError(null)

    const result =
      formMode === "edit" && editingCategoryId
        ? await getCategoriesUseCase.updateCategory({
            id: editingCategoryId,
            ...values,
          })
        : await getCategoriesUseCase.createCategory(values)

    if (!result.success) {
      setIsSaving(false)
      setFormError(result.error)
      return
    }

    closeFormDialog()
    await loadCategories()
    setIsSaving(false)
  }

  async function concatCategories(
    values: ConcatCategoryFormValues
  ): Promise<void> {
    setIsConcating(true)
    setConcatError(null)

    const result = await getCategoriesUseCase.concatCategories(values)
    if (!result.success) {
      setIsConcating(false)
      setConcatError(result.error)
      return
    }

    closeConcatDialog()
    await loadCategories()
    setIsConcating(false)
  }

  async function deleteCategory(categoryId: string): Promise<void> {
    setIsDeleting(true)
    setError(null)
    const result = await getCategoriesUseCase.deleteCategory(categoryId)
    if (!result.success) {
      setIsDeleting(false)
      setError(result.error)
      return
    }

    await loadCategories()
    setIsDeleting(false)
  }

  useEffect(() => {
    void loadCategories()
  }, [getCategoriesUseCase])

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

  const state: CategoriesViewModelState = {
    status,
    categories,
    filteredCategories,
    searchQuery,
    statusFilter,
    formMode,
    editingCategoryId,
    error,
    formError,
    isLoading: status === "idle" || status === "loading",
    isReady: status === "ready",
    isSaving,
    isDeleting,
    isFormOpen: formMode !== null,
    isConcatOpen,
    isConcating,
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
    reload: loadCategories,
  }
}
