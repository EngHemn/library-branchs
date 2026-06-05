import type { Notification } from "@/domain/entities/notification/Notification"
import type { Result } from "@/domain/result/Result"

export interface NotificationRepository {
  getNotifications(): Promise<Result<Notification[]>>
  markAsRead(id: string): Promise<Result<Notification>>
  markAllAsRead(): Promise<Result<Notification[]>>
}
