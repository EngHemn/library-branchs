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

type MemberBookingsTableProps = {
  title: string
  bookings: MemberBooking[]
  emptyMessage: string
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

const statusLabels: Record<MemberBookingStatus, string> = {
  active: "Active",
  returned: "Returned",
  overdue: "Overdue",
  cancelled: "Cancelled",
}

const typeLabels: Record<MemberBookingType, string> = {
  borrow: "Borrow",
  reserve: "Reserve",
}

export function MemberBookingsTable({
  title,
  bookings,
  emptyMessage,
  showDaysOverdue = false,
  showReturnedDate = false,
}: MemberBookingsTableProps) {
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
            <Table className="min-w-[860px]">
              <TableHeader>
                <TableRow>
                  <TableHead>Booking ID</TableHead>
                  <TableHead>Book Title</TableHead>
                  <TableHead>Branch</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Borrowed</TableHead>
                  <TableHead>Due</TableHead>
                  {showReturnedDate ? (
                    <TableHead>Returned</TableHead>
                  ) : null}
                  {showDaysOverdue ? (
                    <TableHead>Days Overdue</TableHead>
                  ) : null}
                  <TableHead>Status</TableHead>
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
                    <TableCell>{typeLabels[booking.type]}</TableCell>
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
