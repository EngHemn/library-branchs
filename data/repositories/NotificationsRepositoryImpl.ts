import type { Notification } from "@/domain/entities/notification/Notification"
import type { NotificationsFakeDataSource } from "@/data/datasources/NotificationsFakeDataSource"
import type { NotificationRepository } from "@/domain/repositories/NotificationRepository"
import type { Result } from "@/domain/result/Result"

export class NotificationsRepositoryImpl implements NotificationRepository {
  constructor(private readonly dataSource: NotificationsFakeDataSource) {}

  getNotifications(): Promise<Result<Notification[]>> {
    return this.dataSource.getNotifications()
  }

  markAsRead(id: string): Promise<Result<Notification>> {
    return this.dataSource.markAsRead(id)
  }

  markAllAsRead(): Promise<Result<Notification[]>> {
    return this.dataSource.markAllAsRead()
  }
}
