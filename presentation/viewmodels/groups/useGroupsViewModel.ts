"use client"

import { useState } from "react"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import type { GroupListItem } from "@/domain/entities/group/Group"

import type { AuthUseCase } from "@/domain/usecases/auth/AuthUseCase"

import type { GroupManagementUseCase } from "@/domain/usecases/groups/GroupManagementUseCase"

import {
  buildScopedGroupSummary,
  filterGroupsByBranchScope,
} from "@/lib/groupBranchScope"

import type { GroupStatusFilter } from "@/presentation/components/groups/GroupsFilters"

import type { AsyncStatus, GroupsViewModelState } from "./GroupsViewModelState"

type GroupsViewModel = {
  state: GroupsViewModelState

  setSearchQuery: (value: string) => void

  setStatusFilter: (value: GroupStatusFilter) => void

  openDeleteGroupDialog: (groupId: string, groupName: string) => void

  closeDeleteGroupDialog: () => void

  confirmDeleteGroup: () => Promise<void>

  reload: () => Promise<void>
}

function matchesSearch(group: GroupListItem, query: string): boolean {
  const normalizedQuery = query.trim().toLowerCase()

  if (!normalizedQuery) return true

  return (
    group.name.toLowerCase().includes(normalizedQuery) ||
    group.description.toLowerCase().includes(normalizedQuery) ||
    group.id.toLowerCase().includes(normalizedQuery)
  )
}

function filterGroups(
  groups: GroupListItem[],

  searchQuery: string,

  statusFilter: GroupStatusFilter
): GroupListItem[] {
  return groups.filter((group) => {
    if (statusFilter !== "all" && group.status !== statusFilter) {
      return false
    }

    return matchesSearch(group, searchQuery)
  })
}

export function useGroupsViewModel(
  authUseCase: AuthUseCase,

  groupManagementUseCase: GroupManagementUseCase
): GroupsViewModel {
  const queryClient = useQueryClient()

  const [searchQuery, setSearchQuery] = useState("")

  const [statusFilter, setStatusFilter] = useState<GroupStatusFilter>("all")

  const [deleteGroupDialog, setDeleteGroupDialog] = useState<{
    groupId: string

    groupName: string
  } | null>(null)

  const [deleteGroupError, setDeleteGroupError] = useState<string | null>(null)

  const userQuery = useQuery({
    queryKey: ["currentUser"],

    queryFn: async () => {
      const result = await authUseCase.getCurrentUser()

      if (!result.success) throw new Error(result.error)

      return result.data ?? null
    },
  })

  const groupsQuery = useQuery({
    queryKey: ["groups"],

    queryFn: async () => {
      const result = await groupManagementUseCase.getGroups()

      if (!result.success) throw new Error(result.error)

      return result.data
    },

    enabled: userQuery.isSuccess,
  })

  const deleteMutation = useMutation({
    mutationFn: async (groupId: string) => {
      const result = await groupManagementUseCase.deleteGroup(groupId)

      if (!result.success) throw new Error(result.error)

      return groupId
    },

    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["groups"] })

      setDeleteGroupDialog(null)

      setDeleteGroupError(null)
    },

    onError: (err: Error) => setDeleteGroupError(err.message),
  })

  const user = userQuery.data ?? null

  const allGroups = groupsQuery.data ?? []

  const scopedGroups =
    user !== null ? filterGroupsByBranchScope(allGroups, user) : []

  const summary = user !== null ? buildScopedGroupSummary(scopedGroups) : null

  const groupsStatus: AsyncStatus =
    userQuery.isPending || groupsQuery.isPending
      ? "loading"
      : groupsQuery.isSuccess
        ? "success"
        : groupsQuery.isError
          ? "error"
          : "loading"

  const summaryStatus: AsyncStatus =
    userQuery.isSuccess && groupsQuery.isSuccess
      ? "success"
      : userQuery.isPending || groupsQuery.isPending
        ? "loading"
        : userQuery.isError || groupsQuery.isError
          ? "error"
          : "idle"

  const filteredGroups = filterGroups(scopedGroups, searchQuery, statusFilter)

  function openDeleteGroupDialog(groupId: string, groupName: string): void {
    setDeleteGroupError(null)

    setDeleteGroupDialog({ groupId, groupName })
  }

  function closeDeleteGroupDialog(): void {
    if (deleteMutation.isPending) return

    setDeleteGroupDialog(null)

    setDeleteGroupError(null)
  }

  async function confirmDeleteGroup(): Promise<void> {
    if (!deleteGroupDialog) return

    await deleteMutation
      .mutateAsync(deleteGroupDialog.groupId)
      .catch(() => undefined)
  }

  async function reload(): Promise<void> {
    await Promise.all([userQuery.refetch(), groupsQuery.refetch()])
  }

  return {
    state: {
      groups: scopedGroups,

      groupsStatus,

      groupsError:
        groupsQuery.error?.message ?? userQuery.error?.message ?? null,

      summary,

      summaryStatus,

      searchQuery,

      statusFilter,

      filteredGroups,

      deleteGroupDialog,

      deleteGroupError,

      isDeletingGroup: deleteMutation.isPending,

      isLoading: groupsStatus === "loading",

      isReady: groupsStatus === "success",
    },

    setSearchQuery,

    setStatusFilter,

    openDeleteGroupDialog,

    closeDeleteGroupDialog,

    confirmDeleteGroup,

    reload,
  }
}
