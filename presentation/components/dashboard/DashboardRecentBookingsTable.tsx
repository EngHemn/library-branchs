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
  DashboardBookingType,
} from "@/domain/entities/dashboard/DashboardSummary"
import { BranchDetailLink } from "@/presentation/components/shared/DashboardEntityLink"

type DashboardRecentBookingsTableProps = {
  bookings: DashboardBooking[]
  showBranchColumn?: boolean
}

const statusLabel: Record<DashboardBookingStatus, string> = {
  reserved: "Reserved",
  borrowed: "Borrowed",
  returned: "Returned",
  overdue: "Overdue",
  cancelled: "Cancelled",
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

const typeLabel: Record<DashboardBookingType, string> = {
  inside: "Inside",
  outside: "Outside",
}

export function DashboardRecentBookingsTable({
  bookings,
  showBranchColumn = false,
}: DashboardRecentBookingsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-24">Booking ID</TableHead>
          <TableHead>Book Title</TableHead>
          <TableHead>Member</TableHead>
          {showBranchColumn ? (
            <TableHead className="hidden md:table-cell">Branch</TableHead>
          ) : null}
          <TableHead className="hidden lg:table-cell">Type</TableHead>
          <TableHead className="hidden sm:table-cell">Due Date</TableHead>
          <TableHead>Status</TableHead>
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
                {typeLabel[booking.type]}
              </Badge>
            </TableCell>
            <TableCell className="hidden text-sm text-muted-foreground sm:table-cell">
              {booking.dueDate}
            </TableCell>
            <TableCell>
              <Badge variant={statusVariant[booking.status]} className="text-xs">
                {statusLabel[booking.status]}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
