"use client"

import Link from "next/link"
import { BellIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useHydrated } from "@/hooks/use-hydrated"
import { cn } from "@/lib/utils"
import type { Notification } from "@/domain/entities/notification/Notification"

type NotificationsDropdownProps = {
  unreadCount?: number
  recentNotifications?: Notification[]
}

function formatNotificationTime(value: string): string {
  const date = new Date(value)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))

  if (diffHours < 1) return "Just now"
  if (diffHours < 24) return `${diffHours}h ago`
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" })
}

function NotificationPreview({ notification }: { notification: Notification }) {
  return (
    <div className="flex flex-col gap-0.5 text-left">
      <span className={cn("text-sm leading-snug", !notification.read && "font-medium")}>
        {notification.title}
      </span>
      <span className="line-clamp-2 text-xs text-muted-foreground">{notification.message}</span>
      <span className="text-xs text-muted-foreground">
        {formatNotificationTime(notification.createdAt)}
      </span>
    </div>
  )
}

export function NotificationsDropdown({
  unreadCount = 0,
  recentNotifications = [],
}: NotificationsDropdownProps) {
  const hydrated = useHydrated()

  const trigger = (
    <Button
      variant="outline"
      size="sm"
      className="relative gap-1.5"
      aria-label="Notifications"
    >
      <BellIcon />
      <span className="hidden sm:inline">Notifications</span>
      {unreadCount > 0 && (
        <Badge
          variant="destructive"
          className="absolute -top-1.5 -right-1.5 flex size-4 items-center justify-center rounded-full p-0 text-[10px]"
        >
          {unreadCount > 9 ? "9+" : unreadCount}
        </Badge>
      )}
    </Button>
  )

  if (!hydrated) {
    return trigger
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <span className="text-xs font-normal text-muted-foreground">{unreadCount} unread</span>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {recentNotifications.length === 0 ? (
          <div className="px-2 py-6 text-center text-sm text-muted-foreground">
            No notifications yet
          </div>
        ) : (
          recentNotifications.map((notification) => (
            <DropdownMenuItem
              key={notification.id}
              className="cursor-pointer items-start py-2"
              asChild
            >
              <Link href="/dashboard/notifications" className="flex w-full gap-2">
                <span
                  className={cn(
                    "mt-1.5 size-2 shrink-0 rounded-full",
                    notification.read ? "bg-transparent" : "bg-primary"
                  )}
                  aria-hidden
                />
                <NotificationPreview notification={notification} />
              </Link>
            </DropdownMenuItem>
          ))
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="justify-center font-medium">
          <Link href="/dashboard/notifications">View all notifications</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
