export type BookingStatus =
  | "reserved"
  | "borrowed"
  | "returned"
  | "overdue"
  | "cancelled"

export type BookingType = "inside" | "outside"

export type Booking = {
  id: string
  bookingId: string
  bookId: string
  bookTitle: string
  memberId: string
  memberName: string
  branchId: string
  branchName: string
  type: BookingType
  bookingDate: string
  dueDate: string
  returnDate: string | null
  status: BookingStatus
}

export type BookingStats = {
  reserved: number
  borrowed: number
  returned: number
  overdue: number
  cancelled: number
  inside: number
  outside: number
}
