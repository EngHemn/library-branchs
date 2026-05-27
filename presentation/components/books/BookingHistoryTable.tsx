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

type BookingHistoryTableProps = {
  bookings: BookingRecord[]
}

const statusVariants: Record<BookingStatus, "default" | "secondary" | "outline" | "destructive"> = {
  active: "default",
  returned: "secondary",
  overdue: "destructive",
  cancelled: "outline",
}

const statusLabels: Record<BookingStatus, string> = {
  active: "Active",
  returned: "Returned",
  overdue: "Overdue",
  cancelled: "Cancelled",
}

const typeLabels: Record<string, string> = {
  borrow: "Borrow",
  reserve: "Reserve",
}

export function BookingHistoryTable({ bookings }: BookingHistoryTableProps) {
  return (
    <Card className="rounded-lg">
      <CardHeader>
        <CardTitle>Booking History</CardTitle>
      </CardHeader>
      <CardContent>
        {bookings.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            No booking history for this book.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <Table className="min-w-[900px]">
              <TableHeader>
                <TableRow>
                  <TableHead>Booking ID</TableHead>
                  <TableHead>Member</TableHead>
                  <TableHead>Branch</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Due</TableHead>
                  <TableHead>Returned</TableHead>
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
                      {booking.memberName}
                    </TableCell>
                    <TableCell>{booking.branchName}</TableCell>
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
