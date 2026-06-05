import type { Notification } from "@/domain/entities/notification/Notification"
import type { Result } from "@/domain/result/Result"
import { fakeNotifications } from "@/data/fake/fakeNotifications"

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export class NotificationsFakeDataSource {
  private notifications: Notification[] = fakeNotifications.map((n) => ({ ...n }))

  async getNotifications(): Promise<Result<Notification[]>> {
    await delay(300)
    return { success: true, data: [...this.notifications] }
  }

  async markAsRead(id: string): Promise<Result<Notification>> {
    await delay(200)
    const index = this.notifications.findIndex((n) => n.id === id)

    if (index === -1) {
      return { success: false, error: `Notification ${id} not found` }
    }

    this.notifications[index] = { ...this.notifications[index], read: true }
    return { success: true, data: this.notifications[index] }
  }

  async markAllAsRead(): Promise<Result<Notification[]>> {
    await delay(200)
    this.notifications = this.notifications.map((n) => ({ ...n, read: true }))
    return { success: true, data: [...this.notifications] }
  }
}
