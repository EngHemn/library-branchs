"use client"

import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type {
  DashboardBooking,
  DashboardBookingStatus,
} from "@/domain/entities/dashboard/DashboardSummary"
import { BranchDetailLink } from "@/presentation/components/shared/DashboardEntityLink"
import { useTranslation } from "@/presentation/i18n/useTranslation"

type DashboardRecentBookingsTableProps = {
  bookings: DashboardBooking[]
  showBranchColumn?: boolean
}

const statusVariant: Record<
  DashboardBookingStatus,
  "default" | "secondary" | "outline" | "destructive"
> = {
  reserved: "secondary",
  borrowed: "default",
  returned: "outline",
  overdue: "destructive",
  cancelled: "outline",
}

export function DashboardRecentBookingsTable({
  bookings,
  showBranchColumn = false,
}: DashboardRecentBookingsTableProps) {
  const { t } = useTranslation()

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-24">
            {t("dashboard.tables.bookingId")}
          </TableHead>
          <TableHead>{t("dashboard.tables.bookTitle")}</TableHead>
          <TableHead>{t("dashboard.tables.member")}</TableHead>
          {showBranchColumn ? (
            <TableHead className="hidden md:table-cell">
              {t("dashboard.tables.branch")}
            </TableHead>
          ) : null}
          <TableHead className="hidden lg:table-cell">
            {t("dashboard.tables.type")}
          </TableHead>
          <TableHead className="hidden sm:table-cell">
            {t("dashboard.tables.dueDate")}
          </TableHead>
          <TableHead>{t("common.status")}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {bookings.map((booking) => (
          <TableRow key={booking.id}>
            <TableCell className="font-mono text-xs text-muted-foreground">
              {booking.bookingId}
            </TableCell>
            <TableCell className="max-w-[180px] truncate font-medium">
              {booking.bookTitle}
            </TableCell>
            <TableCell className="text-sm">{booking.memberName}</TableCell>
            {showBranchColumn ? (
              <TableCell className="hidden max-w-[160px] truncate md:table-cell">
                <BranchDetailLink
                  branchId={booking.branchId}
                  branchName={booking.branchName}
                  className="block truncate text-sm"
                />
              </TableCell>
            ) : null}
            <TableCell className="hidden lg:table-cell">
              <Badge variant="outline" className="text-xs">
                {t(`dashboard.bookingType.${booking.type}`)}
              </Badge>
            </TableCell>
            <TableCell className="hidden text-sm text-muted-foreground sm:table-cell">
              {booking.dueDate}
            </TableCell>
            <TableCell>
              <Badge
                variant={statusVariant[booking.status]}
                className="text-xs"
              >
                {t(`dashboard.bookingStatus.${booking.status}`)}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
