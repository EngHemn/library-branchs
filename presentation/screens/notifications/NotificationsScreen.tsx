"use client"

import { BellIcon, CheckCheckIcon, RefreshCwIcon } from "lucide-react"
import { toast } from "sonner"

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
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import type { Notification } from "@/domain/entities/notification/Notification"
import type { NotificationsUseCase } from "@/domain/usecases/notifications/NotificationsUseCase"
import { useDashboardBreadcrumbs } from "@/presentation/hooks/useDashboardBreadcrumbs"
import { useTranslation } from "@/presentation/i18n/useTranslation"
import { useNotificationsViewModel } from "@/presentation/viewmodels/notifications/useNotificationsViewModel"
import {
  translateNotificationTitle,
  translateNotificationMessage,
} from "@/presentation/i18n/translateNotification"

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
  t,
}: {
  notification: Notification
  onMarkRead: (id: string) => void
  t: any
}) {
  const displayTitle = translateNotificationTitle(notification.title, t)
  const displayMessage = translateNotificationMessage(notification.message, t)

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
            {displayTitle}
          </p>
          <Badge variant={typeBadgeVariant[notification.type]}>
            {notification.type === "info"
              ? t("notifications.priorities.low")
              : notification.type === "warning"
                ? t("notifications.priorities.critical")
                : t("bookingStatus.returned")}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{displayMessage}</p>
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
          {t("notifications.markRead")}
        </Button>
      )}
    </div>
  )
}

function NotificationList({
  notifications,
  emptyMessage,
  onMarkRead,
  t,
}: {
  notifications: Notification[]
  emptyMessage: string
  onMarkRead: (id: string) => void
  t: any
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
      t={t}
    />
  ))
}

function LoadingNotificationsScreen({ t }: { t: any }) {
  return (
    <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
      <div className="space-y-2 pt-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>
      <Skeleton className="h-10 w-48" />
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-lg" />
        ))}
      </div>
    </div>
  )
}

export function NotificationsScreen({ notificationsUseCase }: NotificationsScreenProps) {
  const { t } = useTranslation()
  const { state, markAsRead, markAllAsRead } = useNotificationsViewModel(notificationsUseCase)

  useDashboardBreadcrumbs([
    { label: t("breadcrumbs.workspace"), href: "/dashboard" },
    { label: t("notifications.title") },
  ])

  const handleMarkAsRead = (id: string) => {
    markAsRead(id, {
      onSuccess: () => {
        toast.success(t("notifications.markAsReadSuccess"))
      },
      onError: () => {
        toast.error(t("notifications.markAsReadError"))
      },
    })
  }

  const handleMarkAllAsRead = () => {
    markAllAsRead({
      onSuccess: () => {
        toast.success(t("notifications.markAllAsReadSuccess"))
      },
      onError: () => {
        toast.error(t("notifications.markAllAsReadError"))
      },
    })
  }

  if (state.isLoading) {
    return <LoadingNotificationsScreen t={t} />
  }

  if (state.isError) {
    return (
      <div className="flex flex-1 items-center justify-center p-4">
        <Card className="w-full max-w-md rounded-lg border-destructive/40">
          <CardHeader>
            <CardTitle>{t("notifications.unavailable")}</CardTitle>
            <CardDescription>
              {state.error ?? t("notifications.loadError")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => window.location.reload()}>
              <RefreshCwIcon className="mr-2 h-4 w-4 animate-spin-once" />
              {t("common.retry")}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
      <div className="flex flex-col gap-4 pt-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            {t("notifications.title")}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t("notifications.subtitle")}
          </p>
        </div>
        {state.unreadCount > 0 && (
          <Button type="button" variant="outline" size="sm" onClick={handleMarkAllAsRead}>
            <CheckCheckIcon className="mr-2 h-4 w-4" />
            {t("notifications.markAllAsRead")}
          </Button>
        )}
      </div>

      <Tabs defaultValue="unread" className="space-y-4">
        <TabsList>
          <TabsTrigger value="unread">
            {t("notifications.unreadTab")}
            {state.unreadCount > 0 && (
              <Badge variant="secondary" className="ml-1.5">
                {state.unreadCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="read">
            {t("notifications.readTab")}
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
                <CardTitle className="text-base">{t("notifications.unreadTab")}</CardTitle>
              </div>
              <CardDescription>
                {state.unreadCount === 1
                  ? t("notifications.unreadDescription", { count: state.unreadCount })
                  : t("notifications.unreadDescriptionPlural", { count: state.unreadCount })}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <NotificationList
                notifications={state.unreadNotifications}
                emptyMessage={t("notifications.emptyUnread")}
                onMarkRead={handleMarkAsRead}
                t={t}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="read">
          <Card className="rounded-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <BellIcon className="size-4 text-muted-foreground" />
                <CardTitle className="text-base">{t("notifications.readTab")}</CardTitle>
              </div>
              <CardDescription>
                {state.readCount === 1
                  ? t("notifications.readDescription", { count: state.readCount })
                  : t("notifications.readDescriptionPlural", { count: state.readCount })}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <NotificationList
                notifications={state.readNotifications}
                emptyMessage={t("notifications.emptyRead")}
                onMarkRead={handleMarkAsRead}
                t={t}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
