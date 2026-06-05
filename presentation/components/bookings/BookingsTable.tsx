"use client"

import {
  BookLink,
  MemberLink,
} from "@/presentation/components/shared/DashboardEntityLink"
import { BranchLink } from "@/presentation/components/branch-management/BranchLink"
import {
  CalendarPlusIcon,
  CornerDownLeftIcon,
  PencilIcon,
  Trash2Icon,
  XIcon,
} from "lucide-react"
import { IoSettingsOutline } from "react-icons/io5"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type {
  Booking,
  BookingStatus,
  BookingType,
} from "@/domain/entities/booking/Booking"

type BookingsTableProps = {
  bookings: Booking[]
  isActionPending: boolean
  showBranchColumn?: boolean
  onReturn: (booking: Booking) => void
  onExtend: (booking: Booking) => void
  onCancel: (booking: Booking) => void
  onEdit: (booking: Booking) => void
  onDelete: (booking: Booking) => void
}

const statusClassNames: Record<BookingStatus, string> = {
  reserved:
    "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300",
  borrowed:
    "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900 dark:bg-sky-950 dark:text-sky-300",
  returned:
    "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300",
  overdue:
    "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-300",
  cancelled:
    "border-muted bg-muted text-muted-foreground",
}

const typeClassNames: Record<BookingType, string> = {
  inside:
    "border-lime-200 bg-lime-50 text-lime-700 dark:border-lime-900 dark:bg-lime-950 dark:text-lime-300",
  outside:
    "border-teal-200 bg-teal-50 text-teal-700 dark:border-teal-900 dark:bg-teal-950 dark:text-teal-300",
}

function BookingStatusBadge({ status }: { status: BookingStatus }) {
  return (
    <Badge variant="outline" className={statusClassNames[status]}>
      {status}
    </Badge>
  )
}

function BookingTypeBadge({ type }: { type: BookingType }) {
  return (
    <Badge variant="outline" className={typeClassNames[type]}>
      {type}
    </Badge>
  )
}

function canReturnOrExtend(status: BookingStatus): boolean {
  return status === "borrowed" || status === "overdue"
}

function canCancel(status: BookingStatus): boolean {
  return (
    status === "reserved" || status === "borrowed" || status === "overdue"
  )
}

type BookingActionsMenuProps = {
  booking: Booking
  isActionPending: boolean
  onReturn: (booking: Booking) => void
  onExtend: (booking: Booking) => void
  onCancel: (booking: Booking) => void
  onEdit: (booking: Booking) => void
  onDelete: (booking: Booking) => void
}

function BookingActionsMenu({
  booking,
  isActionPending,
  onReturn,
  onExtend,
  onCancel,
  onEdit,
  onDelete,
}: BookingActionsMenuProps) {
  const showReturnOrExtend = canReturnOrExtend(booking.status)
  const showCancel = canCancel(booking.status)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          aria-label="Booking actions"
          disabled={isActionPending}
        >
          <IoSettingsOutline className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40 gap-4">
        {showReturnOrExtend ? (
          <>
            <DropdownMenuItem onClick={() => onReturn(booking)}>
              <CornerDownLeftIcon />
              Return
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onExtend(booking)}>
              <CalendarPlusIcon />
              Extend
            </DropdownMenuItem>
          </>
        ) : null}
        {showCancel ? (
          <DropdownMenuItem onClick={() => onCancel(booking)}>
            <XIcon />
            Cancel
          </DropdownMenuItem>
        ) : null}
        <DropdownMenuItem onClick={() => onEdit(booking)}>
          <PencilIcon />
          Edit
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onClick={() => onDelete(booking)}
        >
          <Trash2Icon />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function BookingsTable({
  bookings,
  isActionPending,
  showBranchColumn = false,
  onReturn,
  onExtend,
  onCancel,
  onEdit,
  onDelete,
}: BookingsTableProps) {
  return (
    <Card className="rounded-lg">
      <CardHeader>
        <CardTitle>Bookings</CardTitle>
        <CardDescription>
          {bookings.length.toLocaleString()} booking records
        </CardDescription>
      </CardHeader>
      <CardContent>
        {bookings.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No bookings found. Try changing or clearing the active filters.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <Table className={showBranchColumn ? "min-w-[980px]" : "min-w-[820px]"}>
              <TableHeader>
                <TableRow>
                  <TableHead>Book</TableHead>
                  <TableHead>Member</TableHead>
                  {showBranchColumn ? <TableHead>Branch</TableHead> : null}
                  <TableHead>Type</TableHead>
                  <TableHead>Booking Date</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Return Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="max-w-[180px] truncate font-medium">
                      <BookLink
                        bookId={booking.bookId}
                        title={booking.bookTitle}
                        className="block truncate"
                      />
                    </TableCell>
                    <TableCell>
                      <MemberLink
                        memberId={booking.memberId}
                        name={booking.memberName}
                      />
                    </TableCell>
                    {showBranchColumn ? (
                      <TableCell className="max-w-[160px] truncate">
                        <BranchLink
                          branchId={booking.branchId}
                          branchName={booking.branchName}
                          className="block truncate"
                        />
                      </TableCell>
                    ) : null}
                    <TableCell>
                      <BookingTypeBadge type={booking.type} />
                    </TableCell>
                    <TableCell>{booking.bookingDate}</TableCell>
                    <TableCell>{booking.dueDate}</TableCell>
                    <TableCell>{booking.returnDate ?? "—"}</TableCell>
                    <TableCell>
                      <BookingStatusBadge status={booking.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <BookingActionsMenu
                        booking={booking}
                        isActionPending={isActionPending}
                        onReturn={onReturn}
                        onExtend={onExtend}
                        onCancel={onCancel}
                        onEdit={onEdit}
                        onDelete={onDelete}
                      />
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
