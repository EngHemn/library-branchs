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
import { useTranslation } from "@/presentation/i18n/useTranslation"
import {
  translateNotificationTitle,
  translateNotificationMessage,
} from "@/presentation/i18n/translateNotification"

type NotificationsDropdownProps = {
  unreadCount?: number
  recentNotifications?: Notification[]
}

function formatNotificationTime(
  value: string,
  t: any
): string {
  const date = new Date(value)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))

  if (diffHours < 1) return t("notifications.justNow")
  if (diffHours < 24) return t("notifications.hoursAgo", { hours: diffHours })
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" })
}

function NotificationPreview({
  notification,
  t,
}: {
  notification: Notification
  t: any
}) {
  const displayTitle = translateNotificationTitle(notification.title, t)
  const displayMessage = translateNotificationMessage(notification.message, t)

  return (
    <div className="flex flex-col gap-0.5 text-left">
      <span className={cn("text-sm leading-snug", !notification.read && "font-medium")}>
        {displayTitle}
      </span>
      <span className="line-clamp-2 text-xs text-muted-foreground">{displayMessage}</span>
      <span className="text-xs text-muted-foreground">
        {formatNotificationTime(notification.createdAt, t)}
      </span>
    </div>
  )
}

export function NotificationsDropdown({
  unreadCount = 0,
  recentNotifications = [],
}: NotificationsDropdownProps) {
  const hydrated = useHydrated()
  const { t } = useTranslation()

  const trigger = (
    <Button
      variant="outline"
      size="sm"
      className="relative gap-1.5"
      aria-label={t("header.notifications")}
    >
      <BellIcon />
      <span className="hidden sm:inline">{t("header.notifications")}</span>
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
          <span>{t("header.notifications")}</span>
          {unreadCount > 0 && (
            <span className="text-xs font-normal text-muted-foreground">
              {t("notifications.unread", { count: unreadCount })}
            </span>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {recentNotifications.length === 0 ? (
          <div className="px-2 py-6 text-center text-sm text-muted-foreground">
            {t("notifications.empty")}
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
                <NotificationPreview notification={notification} t={t} />
              </Link>
            </DropdownMenuItem>
          ))
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="justify-center font-medium">
          <Link href="/dashboard/notifications">{t("notifications.viewAll")}</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
