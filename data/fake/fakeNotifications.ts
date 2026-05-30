import type { Notification } from "@/domain/entities/notification/Notification"

export const fakeNotifications: Notification[] = [
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
    message: "\"The Silent Patient\" has only 2 copies left at BR-002.",
    createdAt: "2026-05-29T08:30:00.000Z",
    read: false,
    type: "warning",
  },
  {
    id: "NTF-004",
    title: "Event starting soon",
    message: "Author meet & greet begins in 1 hour at the main hall.",
    createdAt: "2026-05-28T16:00:00.000Z",
    read: true,
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

export function getUnreadNotificationCount(
  notifications: Notification[] = fakeNotifications
): number {
  return notifications.filter((n) => !n.read).length
}

export function getRecentNotifications(
  limit = 5,
  notifications: Notification[] = fakeNotifications
): Notification[] {
  return [...notifications]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, limit)
}
