"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import type { NotificationsUseCase } from "@/domain/usecases/notifications/NotificationsUseCase"
import type { NotificationsViewModelState } from "./NotificationsViewModelState"

type NotificationsViewModel = {
  state: NotificationsViewModelState
  markAsRead: (id: string, options?: any) => void
  markAllAsRead: (options?: any) => void
}

export function useNotificationsViewModel(
  notificationsUseCase: NotificationsUseCase
): NotificationsViewModel {
  const queryClient = useQueryClient()

  const { data: notifications, isLoading, isError, error } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const result = await notificationsUseCase.getNotifications()
      if (!result.success) throw new Error(result.error)
      return result.data
    },
  })

  const markAsReadMutation = useMutation({
    mutationFn: async (id: string) => {
      const result = await notificationsUseCase.markAsRead(id)
      if (!result.success) throw new Error(result.error)
      return result.data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  })

  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      const result = await notificationsUseCase.markAllAsRead()
      if (!result.success) throw new Error(result.error)
      return result.data
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  })

  const all = notifications ?? []
  const sorted = [...all].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
  const unreadNotifications = sorted.filter((n) => !n.read)
  const readNotifications = sorted.filter((n) => n.read)

  return {
    state: {
      notifications: sorted,
      unreadNotifications,
      readNotifications,
      unreadCount: unreadNotifications.length,
      readCount: readNotifications.length,
      isLoading,
      isError,
      error: isError ? (error as Error).message : null,
    },
    markAsRead: (id: string, options?: any) => markAsReadMutation.mutate(id, options),
    markAllAsRead: (options?: any) => markAllAsReadMutation.mutate(undefined, options),
  }
}
