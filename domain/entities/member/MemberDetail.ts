import type { Member } from "@/domain/entities/member/Member"

export type MemberBookingStatus =
  | "active"
  | "returned"
  | "overdue"
  | "cancelled"

export type MemberBookingType = "borrow" | "reserve"

export type MemberBooking = {
  bookingId: string
  bookTitle: string
  isbn: string
  branchName: string
  type: MemberBookingType
  borrowedDate: string
  dueDate: string
  returnedDate: string | null
  status: MemberBookingStatus
  daysOverdue: number | null
}

export type MemberAddedBy = {
  staffId: string
  staffName: string
}

export type MemberBookings = {
  active: MemberBooking[]
  lateReturns: MemberBooking[]
  history: MemberBooking[]
}

export type MemberDetail = Member & {
  address: string
  addedBy: MemberAddedBy
  bookings: MemberBookings
}
