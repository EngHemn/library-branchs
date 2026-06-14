import { Badge } from "@/components/ui/badge"
import type { ActivityLogAction } from "@/domain/entities/activity-log/ActivityLog"
import type { TranslationKey } from "@/presentation/i18n/messages"
import { useTranslation } from "@/presentation/i18n/useTranslation"

type ActivityLogActionBadgeProps = {
  action: ActivityLogAction
}

const actionConfig: Record<
  ActivityLogAction,
  { label: string; className: string }
> = {
  create: {
    label: "Create",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  update: {
    label: "Update",
    className: "bg-blue-50 text-blue-700 border-blue-200",
  },
  delete: {
    label: "Delete",
    className: "bg-red-50 text-red-700 border-red-200",
  },
  login: {
    label: "Login",
    className: "bg-slate-50 text-slate-700 border-slate-200",
  },
  logout: {
    label: "Logout",
    className: "bg-slate-50 text-slate-600 border-slate-200",
  },
  sale: {
    label: "Sale",
    className: "bg-violet-50 text-violet-700 border-violet-200",
  },
  booking: {
    label: "Booking",
    className: "bg-teal-50 text-teal-700 border-teal-200",
  },
  stock_update: {
    label: "Stock Update",
    className: "bg-orange-50 text-orange-700 border-orange-200",
  },
  transfer: {
    label: "Transfer",
    className: "bg-indigo-50 text-indigo-700 border-indigo-200",
  },
  permission_change: {
    label: "Permission Change",
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
  export: {
    label: "Export",
    className: "bg-zinc-50 text-zinc-700 border-zinc-200",
  },
  import: {
    label: "Import",
    className: "bg-zinc-50 text-zinc-700 border-zinc-200",
  },
}

export function ActivityLogActionBadge({ action }: ActivityLogActionBadgeProps) {
  const { t } = useTranslation()
  const config = actionConfig[action]

  return (
    <Badge variant="outline" className={config.className}>
      {t(`activityLogs.actions.${action}` as TranslationKey)}
    </Badge>
  )
}
