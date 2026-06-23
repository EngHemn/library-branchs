import type {
  BookingStatus,
  BookingType,
} from "@/domain/entities/booking/Booking"

export type UpdateBookingInput = {
  id: string
  bookId: string
  branchId: string
  memberId: string
  type: BookingType
  dueDate: string
  status: BookingStatus
}
