"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"

import type {
  PermissionCode,
  PermissionConfig,
  PermissionStaffMember,
} from "@/domain/entities/permission/Permission"
import type { User } from "@/domain/entities/User"
import type { AuthUseCase } from "@/domain/usecases/auth/AuthUseCase"
import type { PermissionManagementUseCase } from "@/domain/usecases/permission/PermissionManagementUseCase"

type PermissionsPageStatus =
  | "idle"
  | "loading"
  | "success"
  | "unauthenticated"
  | "error"

type PermissionsViewModelState = {
  status: PermissionsPageStatus
  user: User | null
  staff: PermissionStaffMember[]
  filteredStaff: PermissionStaffMember[]
  config: PermissionConfig | null
  selectedStaffId: string | null
  selectedStaff: PermissionStaffMember | null
  draftPermissions: PermissionCode[]
  searchQuery: string
  isSaving: boolean
  error: string | null
  isLoading: boolean
  isReady: boolean
  isUnauthenticated: boolean
  isDirty: boolean
  selectedCount: number
  totalCount: number
}

type PermissionsViewModel = {
  state: PermissionsViewModelState
  reload: () => Promise<void>
  logout: () => Promise<void>
  selectStaff: (staffId: string) => void
  setSearchQuery: (query: string) => void
  togglePermission: (permission: PermissionCode) => void
  selectAllInCategory: (categoryName: string) => void
  deselectAllInCategory: (categoryName: string) => void
  resetPermissions: () => void
  savePermissions: () => Promise<void>
}

export function usePermissionsViewModel(
  authUseCase: AuthUseCase,
  permissionManagementUseCase: PermissionManagementUseCase
): PermissionsViewModel {
  const [status, setStatus] = useState<PermissionsPageStatus>("idle")
  const [user, setUser] = useState<User | null>(null)
  const [staff, setStaff] = useState<PermissionStaffMember[]>([])
  const [config, setConfig] = useState<PermissionConfig | null>(null)
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null)
  const [draftPermissions, setDraftPermissions] = useState<PermissionCode[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const initialSelectionDone = useRef(false)

  const reload = useCallback(async (): Promise<void> => {
    setStatus("loading")
    setError(null)

    const currentUserResult = await authUseCase.getCurrentUser()

    if (!currentUserResult.success) {
      setStatus("error")
      setUser(null)
      setError(currentUserResult.error)
      return
    }

    if (!currentUserResult.data) {
      setStatus("unauthenticated")
      setUser(null)
      return
    }

    const [staffResult, configResult] = await Promise.all([
      permissionManagementUseCase.getPermissionStaff(),
      permissionManagementUseCase.getPermissionConfig(),
    ])

    if (!staffResult.success) {
      setStatus("error")
      setError(staffResult.error)
      return
    }

    if (!configResult.success) {
      setStatus("error")
      setError(configResult.error)
      return
    }

    setUser(currentUserResult.data)
    setStaff(staffResult.data)
    setConfig(configResult.data)

    if (staffResult.data.length > 0 && !initialSelectionDone.current) {
      initialSelectionDone.current = true
      const firstStaff = staffResult.data[0]
      setSelectedStaffId(firstStaff.id)
      setDraftPermissions([...firstStaff.assignedPermissions])
    }

    setStatus("success")
  }, [authUseCase, permissionManagementUseCase])

  const logout = useCallback(async (): Promise<void> => {
    setStatus("loading")

    const result = await authUseCase.logout()

    if (!result.success) {
      setStatus("error")
      setError(result.error)
      return
    }

    setUser(null)
    setStatus("unauthenticated")
  }, [authUseCase])

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void reload()
    }, 0)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [reload])

  const selectStaff = useCallback(
    (staffId: string): void => {
      const member = staff.find((s) => s.id === staffId)
      if (member) {
        setSelectedStaffId(staffId)
        setDraftPermissions([...member.assignedPermissions])
      }
    },
    [staff]
  )

  const filteredStaff = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase()
    if (!normalizedQuery) return staff

    return staff.filter(
      (member) =>
        member.name.toLowerCase().includes(normalizedQuery) ||
        member.role.toLowerCase().includes(normalizedQuery) ||
        member.branch.toLowerCase().includes(normalizedQuery)
    )
  }, [staff, searchQuery])

  const selectedStaff = useMemo(
    () => staff.find((s) => s.id === selectedStaffId) ?? null,
    [staff, selectedStaffId]
  )

  const togglePermission = useCallback(
    (permission: PermissionCode): void => {
      setDraftPermissions((current) =>
        current.includes(permission)
          ? current.filter((p) => p !== permission)
          : [...current, permission]
      )
    },
    []
  )

  const selectAllInCategory = useCallback(
    (categoryName: string): void => {
      if (!config) return

      const category = config.categories.find((c) => c.name === categoryName)
      if (!category) return

      setDraftPermissions((current) => {
        const withoutCategory = current.filter(
          (p) => !category.permissions.includes(p)
        )
        return [...withoutCategory, ...category.permissions]
      })
    },
    [config]
  )

  const deselectAllInCategory = useCallback(
    (categoryName: string): void => {
      if (!config) return

      const category = config.categories.find((c) => c.name === categoryName)
      if (!category) return

      setDraftPermissions((current) =>
        current.filter((p) => !category.permissions.includes(p))
      )
    },
    [config]
  )

  const resetPermissions = useCallback((): void => {
    if (selectedStaff) {
      setDraftPermissions([...selectedStaff.assignedPermissions])
    }
  }, [selectedStaff])

  const savePermissions = useCallback(async (): Promise<void> => {
    if (!selectedStaffId) return

    setIsSaving(true)

    const result = await permissionManagementUseCase.savePermissions(
      selectedStaffId,
      draftPermissions
    )

    setIsSaving(false)

    if (!result.success) {
      setError(result.error)
      return
    }

    setStaff((current) =>
      current.map((s) => (s.id === result.data.id ? result.data : s))
    )
  }, [selectedStaffId, draftPermissions, permissionManagementUseCase])

  const isDirty = useMemo(() => {
    if (!selectedStaff) return false

    const original = [...selectedStaff.assignedPermissions].sort()
    const draft = [...draftPermissions].sort()

    if (original.length !== draft.length) return true
    return original.some((p, i) => p !== draft[i])
  }, [selectedStaff, draftPermissions])

  const state = useMemo<PermissionsViewModelState>(
    () => ({
      status,
      user,
      staff,
      filteredStaff,
      config,
      selectedStaffId,
      selectedStaff,
      draftPermissions,
      searchQuery,
      isSaving,
      error: status === "error" ? error : null,
      isLoading: status === "idle" || status === "loading",
      isReady: status === "success",
      isUnauthenticated: status === "unauthenticated",
      isDirty,
      selectedCount: draftPermissions.length,
      totalCount: config?.totalPermissions ?? 0,
    }),
    [
      status,
      user,
      staff,
      filteredStaff,
      config,
      selectedStaffId,
      selectedStaff,
      draftPermissions,
      searchQuery,
      isSaving,
      error,
      isDirty,
    ]
  )

  return {
    state,
    reload,
    logout,
    selectStaff,
    setSearchQuery,
    togglePermission,
    selectAllInCategory,
    deselectAllInCategory,
    resetPermissions,
    savePermissions,
  }
}
