"use client"

import { BellIcon, CheckCheckIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import type { Notification } from "@/domain/entities/notification/Notification"
import type { NotificationsUseCase } from "@/domain/usecases/notifications/NotificationsUseCase"
import { useDashboardBreadcrumbs } from "@/presentation/hooks/useDashboardBreadcrumbs"
import { useNotificationsViewModel } from "@/presentation/viewmodels/notifications/useNotificationsViewModel"

type NotificationsScreenProps = {
  notificationsUseCase: NotificationsUseCase
}

const typeBadgeVariant: Record<
  Notification["type"],
  "default" | "secondary" | "destructive" | "outline"
> = {
  info: "secondary",
  success: "default",
  warning: "destructive",
}

function formatTimestamp(value: string): string {
  return new Date(value).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })
}

function NotificationRow({
  notification,
  onMarkRead,
}: {
  notification: Notification
  onMarkRead: (id: string) => void
}) {
  return (
    <div
      className={cn(
        "flex gap-3 rounded-lg border p-4 transition-colors",
        !notification.read && "border-primary/30 bg-primary/5"
      )}
    >
      <span
        className={cn(
          "mt-2 size-2 shrink-0 rounded-full",
          notification.read ? "bg-muted" : "bg-primary"
        )}
        aria-hidden
      />
      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className={cn("text-sm", !notification.read && "font-semibold")}>
            {notification.title}
          </p>
          <Badge variant={typeBadgeVariant[notification.type]}>
            {notification.type}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{notification.message}</p>
        <p className="text-xs text-muted-foreground">
          {formatTimestamp(notification.createdAt)}
        </p>
      </div>
      {!notification.read && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="shrink-0"
          onClick={() => onMarkRead(notification.id)}
        >
          Mark read
        </Button>
      )}
    </div>
  )
}

function NotificationList({
  notifications,
  emptyMessage,
  onMarkRead,
}: {
  notifications: Notification[]
  emptyMessage: string
  onMarkRead: (id: string) => void
}) {
  if (notifications.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        {emptyMessage}
      </p>
    )
  }

  return notifications.map((notification) => (
    <NotificationRow
      key={notification.id}
      notification={notification}
      onMarkRead={onMarkRead}
    />
  ))
}

export function NotificationsScreen({ notificationsUseCase }: NotificationsScreenProps) {
  const { state, markAsRead, markAllAsRead } = useNotificationsViewModel(notificationsUseCase)

  useDashboardBreadcrumbs([
    { label: "Workspace", href: "/dashboard" },
    { label: "Notifications" },
  ])

  return (
    <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
      <div className="flex flex-col gap-4 pt-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Notifications</h1>
          <p className="text-sm text-muted-foreground">
            Stay up to date with library alerts, member activity, and system events.
          </p>
        </div>
        {state.unreadCount > 0 && (
          <Button type="button" variant="outline" size="sm" onClick={markAllAsRead}>
            <CheckCheckIcon />
            Mark all as read
          </Button>
        )}
      </div>

      <Tabs defaultValue="unread" className="space-y-4">
        <TabsList>
          <TabsTrigger value="unread">
            Unread
            {state.unreadCount > 0 && (
              <Badge variant="secondary" className="ml-1.5">
                {state.unreadCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="read">
            Read
            {state.readCount > 0 && (
              <Badge variant="secondary" className="ml-1.5">
                {state.readCount}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="unread">
          <Card className="rounded-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <BellIcon className="size-4 text-muted-foreground" />
                <CardTitle className="text-base">Unread</CardTitle>
              </div>
              <CardDescription>
                {state.unreadCount} unread notification
                {state.unreadCount === 1 ? "" : "s"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <NotificationList
                notifications={state.unreadNotifications}
                emptyMessage="You're all caught up. No unread notifications."
                onMarkRead={markAsRead}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="read">
          <Card className="rounded-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <BellIcon className="size-4 text-muted-foreground" />
                <CardTitle className="text-base">Read</CardTitle>
              </div>
              <CardDescription>
                {state.readCount} read notification
                {state.readCount === 1 ? "" : "s"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <NotificationList
                notifications={state.readNotifications}
                emptyMessage="No read notifications yet."
                onMarkRead={markAsRead}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
