import type { Notification } from "@/domain/entities/notification/Notification"
import type { Result } from "@/domain/result/Result"
import { getFakeNotifications, markAllFakeNotificationsAsRead, markFakeNotificationAsRead } from "@/data/fake/fakeNotifications"

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export class NotificationsFakeDataSource {
  async getNotifications(): Promise<Result<Notification[]>> {
    await delay(300)
    return { success: true, data: [...getFakeNotifications()] }
  }

  async markAsRead(id: string): Promise<Result<Notification>> {
    await delay(200)
    const updated = markFakeNotificationAsRead(id)

    if (!updated) {
      return { success: false, error: `Notification ${id} not found` }
    }

    return { success: true, data: updated }
  }

  async markAllAsRead(): Promise<Result<Notification[]>> {
    await delay(200)
    return { success: true, data: [...markAllFakeNotificationsAsRead()] }
  }
}
