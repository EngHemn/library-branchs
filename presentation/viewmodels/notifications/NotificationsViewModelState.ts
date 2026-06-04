"use client"

import type { Notification } from "@/domain/entities/notification/Notification"
import type { NotificationsUseCase } from "@/domain/usecases/notifications/NotificationsUseCase"

export type NotificationsViewModelState = {
  notifications: Notification[]
  unreadNotifications: Notification[]
  readNotifications: Notification[]
  unreadCount: number
  readCount: number
  isLoading: boolean
  isError: boolean
  error: string | null
}
