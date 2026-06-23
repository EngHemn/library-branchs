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
import type { TranslationKey } from "@/presentation/i18n/messages"
import { useTranslation } from "@/presentation/i18n/useTranslation"

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
  cancelled: "border-muted bg-muted text-muted-foreground",
}

const typeClassNames: Record<BookingType, string> = {
  inside:
    "border-lime-200 bg-lime-50 text-lime-700 dark:border-lime-900 dark:bg-lime-950 dark:text-lime-300",
  outside:
    "border-teal-200 bg-teal-50 text-teal-700 dark:border-teal-900 dark:bg-teal-950 dark:text-teal-300",
}

const STATUS_KEYS: Record<BookingStatus, TranslationKey> = {
  reserved: "bookings.statuses.reserved",
  borrowed: "bookings.statuses.borrowed",
  returned: "bookings.statuses.returned",
  overdue: "bookings.statuses.overdue",
  cancelled: "bookings.statuses.cancelled",
}

const TYPE_KEYS: Record<BookingType, TranslationKey> = {
  inside: "bookings.types.inside",
  outside: "bookings.types.outside",
}

function BookingStatusBadge({ status }: { status: BookingStatus }) {
  const { t } = useTranslation()

  return (
    <Badge variant="outline" className={statusClassNames[status]}>
      {t(STATUS_KEYS[status])}
    </Badge>
  )
}

function BookingTypeBadge({ type }: { type: BookingType }) {
  const { t } = useTranslation()

  return (
    <Badge variant="outline" className={typeClassNames[type]}>
      {t(TYPE_KEYS[type])}
    </Badge>
  )
}

function canReturnOrExtend(status: BookingStatus): boolean {
  return status === "borrowed" || status === "overdue"
}

function canCancel(status: BookingStatus): boolean {
  return status === "reserved" || status === "borrowed" || status === "overdue"
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
  const { t } = useTranslation()
  const showReturnOrExtend = canReturnOrExtend(booking.status)
  const showCancel = canCancel(booking.status)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          aria-label={t("bookings.actions.bookingActions")}
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
              {t("bookings.actions.return")}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onExtend(booking)}>
              <CalendarPlusIcon />
              {t("bookings.actions.extend")}
            </DropdownMenuItem>
          </>
        ) : null}
        {showCancel ? (
          <DropdownMenuItem onClick={() => onCancel(booking)}>
            <XIcon />
            {t("bookings.actions.cancel")}
          </DropdownMenuItem>
        ) : null}
        <DropdownMenuItem onClick={() => onEdit(booking)}>
          <PencilIcon />
          {t("bookings.actions.edit")}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          onClick={() => onDelete(booking)}
        >
          <Trash2Icon />
          {t("bookings.actions.delete")}
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
  const { t } = useTranslation()

  return (
    <Card className="rounded-lg">
      <CardHeader>
        <CardTitle>{t("bookings.table.title")}</CardTitle>
        <CardDescription>
          {t("bookings.table.recordCount", { count: bookings.length })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {bookings.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            {t("bookings.table.emptyDescription")}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <Table
              className={showBranchColumn ? "min-w-[980px]" : "min-w-[820px]"}
            >
              <TableHeader>
                <TableRow>
                  <TableHead>{t("bookings.table.book")}</TableHead>
                  <TableHead>{t("bookings.table.member")}</TableHead>
                  {showBranchColumn ? (
                    <TableHead>{t("bookings.table.branch")}</TableHead>
                  ) : null}
                  <TableHead>{t("bookings.table.type")}</TableHead>
                  <TableHead>{t("bookings.table.bookingDate")}</TableHead>
                  <TableHead>{t("bookings.table.dueDate")}</TableHead>
                  <TableHead>{t("bookings.table.returnDate")}</TableHead>
                  <TableHead>{t("bookings.table.status")}</TableHead>
                  <TableHead className="text-right">
                    {t("bookings.table.actions")}
                  </TableHead>
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
                    <TableCell>
                      {booking.returnDate ?? t("bookings.table.noReturnDate")}
                    </TableCell>
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
