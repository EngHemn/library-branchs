export type NotificationType = "info" | "warning" | "success"

export type Notification = {
  id: string
  title: string
  message: string
  createdAt: string
  read: boolean
  type: NotificationType
}
