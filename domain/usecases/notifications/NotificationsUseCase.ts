import type { Notification } from "@/domain/entities/notification/Notification"
import type { NotificationRepository } from "@/domain/repositories/NotificationRepository"
import type { Result } from "@/domain/result/Result"

export class NotificationsUseCase {
  constructor(
    private readonly notificationRepository: NotificationRepository
  ) {}

  getNotifications(): Promise<Result<Notification[]>> {
    return this.notificationRepository.getNotifications()
  }

  markAsRead(id: string): Promise<Result<Notification>> {
    return this.notificationRepository.markAsRead(id)
  }

  markAllAsRead(): Promise<Result<Notification[]>> {
    return this.notificationRepository.markAllAsRead()
  }
}
