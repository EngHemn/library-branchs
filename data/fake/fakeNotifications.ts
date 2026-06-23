import type { Notification } from "@/domain/entities/notification/Notification"

const initialNotifications: Notification[] = [
  {
    id: "NTF-001",
    title: "Overdue book reminder",
    message: "Member MBR-0182 has 2 books past due date.",
    createdAt: "2026-05-29T09:45:00.000Z",
    read: false,
    type: "warning",
  },
  {
    id: "NTF-002",
    title: "New member registered",
    message: "Sara Al-Masri joined Central Library & Bookshop.",
    createdAt: "2026-05-29T09:12:00.000Z",
    read: false,
    type: "success",
  },
  {
    id: "NTF-003",
    title: "Low stock alert",
    message: '"The Silent Patient" has only 2 copies left at BR-002.',
    createdAt: "2026-05-29T08:30:00.000Z",
    read: false,
    type: "warning",
  },
  {
    id: "NTF-004",
    title: "New need request",
    message: "Network Switch Upgrade requested at Northside Books (Critical).",
    createdAt: "2026-05-29T08:15:00.000Z",
    read: false,
    type: "info",
  },
  {
    id: "NTF-005",
    title: "Daily sales summary",
    message: "Yesterday's sales totaled $1,240.50 across all branches.",
    createdAt: "2026-05-28T07:00:00.000Z",
    read: true,
    type: "info",
  },
  {
    id: "NTF-006",
    title: "Permission update",
    message: "Staff role permissions were updated for Brian Foster.",
    createdAt: "2026-05-27T14:22:00.000Z",
    read: true,
    type: "info",
  },
]

let notificationStore: Notification[] = initialNotifications.map((n) => ({
  ...n,
}))

export function getFakeNotifications(): Notification[] {
  return notificationStore
}

export function resetFakeNotifications(): void {
  notificationStore = initialNotifications.map((n) => ({ ...n }))
}

let notificationCounter = 100

export type DispatchNotificationInput = {
  title: string
  message: string
  type: Notification["type"]
  sendEmail?: boolean
}

export function dispatchFakeNotification(
  input: DispatchNotificationInput
): Notification {
  notificationCounter += 1
  const notification: Notification = {
    id: `NTF-${notificationCounter}`,
    title: input.title,
    message: input.message,
    createdAt: new Date().toISOString(),
    read: false,
    type: input.type,
  }

  notificationStore = [notification, ...notificationStore]

  if (input.sendEmail !== false) {
    // Simulated email dispatch for demo purposes.
    console.info(`[Email Notification] ${input.title}: ${input.message}`)
  }

  return notification
}

export function markFakeNotificationAsRead(id: string): Notification | null {
  const index = notificationStore.findIndex((n) => n.id === id)
  if (index === -1) return null
  notificationStore[index] = { ...notificationStore[index], read: true }
  return notificationStore[index]
}

export function markAllFakeNotificationsAsRead(): Notification[] {
  notificationStore = notificationStore.map((n) => ({ ...n, read: true }))
  return [...notificationStore]
}

export const fakeNotifications = initialNotifications

export function getUnreadNotificationCount(
  notifications: Notification[] = notificationStore
): number {
  return notifications.filter((n) => !n.read).length
}

export function getRecentNotifications(
  limit = 5,
  notifications: Notification[] = notificationStore
): Notification[] {
  return [...notifications]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, limit)
}
