"use client"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type {
  MemberBooking,
  MemberBookingStatus,
  MemberBookingType,
} from "@/domain/entities/member/MemberDetail"
import { BranchLink } from "@/presentation/components/branch-management/BranchLink"
import { BookLink } from "@/presentation/components/shared/DashboardEntityLink"
import type { TranslationKey } from "@/presentation/i18n/messages"
import { useTranslation } from "@/presentation/i18n/useTranslation"

type MemberBookingsTableProps = {
  title: string
  bookings: MemberBooking[]
  emptyMessage: string
  showBranchColumn?: boolean
  showDaysOverdue?: boolean
  showReturnedDate?: boolean
}

const statusVariants: Record<
  MemberBookingStatus,
  "default" | "secondary" | "outline" | "destructive"
> = {
  active: "default",
  returned: "secondary",
  overdue: "destructive",
  cancelled: "outline",
}

const STATUS_KEYS: Record<MemberBookingStatus, TranslationKey> = {
  active: "members.bookings.statuses.active",
  returned: "members.bookings.statuses.returned",
  overdue: "members.bookings.statuses.overdue",
  cancelled: "members.bookings.statuses.cancelled",
}

const TYPE_KEYS: Record<MemberBookingType, TranslationKey> = {
  borrow: "members.bookings.types.borrow",
  reserve: "members.bookings.types.reserve",
}

export function MemberBookingsTable({
  title,
  bookings,
  emptyMessage,
  showBranchColumn = true,
  showDaysOverdue = false,
  showReturnedDate = false,
}: MemberBookingsTableProps) {
  const { t } = useTranslation()

  return (
    <Card className="rounded-lg">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {bookings.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            {emptyMessage}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <Table className={showBranchColumn ? "min-w-[860px]" : "min-w-[720px]"}>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("members.bookings.bookingId")}</TableHead>
                  <TableHead>{t("members.bookings.bookTitle")}</TableHead>
                  {showBranchColumn ? <TableHead>{t("members.bookings.branch")}</TableHead> : null}
                  <TableHead>{t("members.bookings.type")}</TableHead>
                  <TableHead>{t("members.bookings.borrowed")}</TableHead>
                  <TableHead>{t("members.bookings.due")}</TableHead>
                  {showReturnedDate ? (
                    <TableHead>{t("members.bookings.returned")}</TableHead>
                  ) : null}
                  {showDaysOverdue ? (
                    <TableHead>{t("members.bookings.daysOverdue")}</TableHead>
                  ) : null}
                  <TableHead>{t("members.bookings.status")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((booking) => (
                  <TableRow key={booking.bookingId}>
                    <TableCell className="font-mono text-xs">
                      {booking.bookingId}
                    </TableCell>
                    <TableCell className="font-medium">
                      {booking.bookId ? (
                        <BookLink
                          bookId={booking.bookId}
                          title={booking.bookTitle}
                        />
                      ) : (
                        booking.bookTitle
                      )}
                    </TableCell>
                    {showBranchColumn ? (
                      <TableCell>
                        {booking.branchId ? (
                          <BranchLink
                            branchId={booking.branchId}
                            branchName={booking.branchName}
                          />
                        ) : (
                          booking.branchName
                        )}
                      </TableCell>
                    ) : null}
                    <TableCell>{t(TYPE_KEYS[booking.type])}</TableCell>
                    <TableCell>{booking.borrowedDate}</TableCell>
                    <TableCell>{booking.dueDate}</TableCell>
                    {showReturnedDate ? (
                      <TableCell>{booking.returnedDate ?? "—"}</TableCell>
                    ) : null}
                    {showDaysOverdue ? (
                      <TableCell>
                        {booking.daysOverdue !== null
                          ? booking.daysOverdue.toLocaleString()
                          : "—"}
                      </TableCell>
                    ) : null}
                    <TableCell>
                      <Badge variant={statusVariants[booking.status]}>
                        {t(STATUS_KEYS[booking.status])}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
