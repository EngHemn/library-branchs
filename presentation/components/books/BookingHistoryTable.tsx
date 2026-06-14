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
import type { BookingRecord, BookingStatus } from "@/domain/entities/book/BookDetail"
import { BranchLink } from "@/presentation/components/branch-management/BranchLink"
import { MemberLink } from "@/presentation/components/shared/DashboardEntityLink"
import { useTranslation } from "@/presentation/i18n/useTranslation"

type BookingHistoryTableProps = {
  bookings: BookingRecord[]
  showBranchColumn?: boolean
}

const statusVariants: Record<BookingStatus, "default" | "secondary" | "outline" | "destructive"> = {
  active: "default",
  returned: "secondary",
  overdue: "destructive",
  cancelled: "outline",
}

export function BookingHistoryTable({
  bookings,
  showBranchColumn = true,
}: BookingHistoryTableProps) {
  const { t } = useTranslation()

  const statusLabels: Record<BookingStatus, string> = {
    active: t("books.bookingHistory.statuses.active"),
    returned: t("books.bookingHistory.statuses.returned"),
    overdue: t("books.bookingHistory.statuses.overdue"),
    cancelled: t("books.bookingHistory.statuses.cancelled"),
  }

  const typeLabels: Record<string, string> = {
    borrow: t("books.bookingHistory.types.borrow"),
    reserve: t("books.bookingHistory.types.reserve"),
  }

  return (
    <Card className="rounded-lg">
      <CardHeader>
        <CardTitle>{t("books.bookingHistory.title")}</CardTitle>
      </CardHeader>
      <CardContent>
        {bookings.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            {t("books.bookingHistory.empty")}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <Table className={showBranchColumn ? "min-w-[900px]" : "min-w-[760px]"}>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("books.bookingHistory.bookingId")}</TableHead>
                  <TableHead>{t("books.bookingHistory.member")}</TableHead>
                  {showBranchColumn ? (
                    <TableHead>{t("books.bookingHistory.branch")}</TableHead>
                  ) : null}
                  <TableHead>{t("books.bookingHistory.type")}</TableHead>
                  <TableHead>{t("books.bookingHistory.date")}</TableHead>
                  <TableHead>{t("books.bookingHistory.due")}</TableHead>
                  <TableHead>{t("books.bookingHistory.returned")}</TableHead>
                  <TableHead>{t("books.bookingHistory.status")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((booking) => (
                  <TableRow key={booking.bookingId}>
                    <TableCell className="font-mono text-xs">
                      {booking.bookingId}
                    </TableCell>
                    <TableCell className="font-medium">
                      {booking.memberId ? (
                        <MemberLink
                          memberId={booking.memberId}
                          name={booking.memberName}
                        />
                      ) : (
                        booking.memberName
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
                    <TableCell>
                      {typeLabels[booking.type] ?? booking.type}
                    </TableCell>
                    <TableCell>{booking.date}</TableCell>
                    <TableCell>{booking.due}</TableCell>
                    <TableCell>{booking.returned ?? "—"}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariants[booking.status]}>
                        {statusLabels[booking.status]}
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
