import type { Booking } from "@/domain/entities/booking/Booking"
import type { BookingFormOptions } from "@/domain/entities/booking/BookingFormOptions"
import type { UpdateBookingInput } from "@/domain/entities/booking/UpdateBookingInput"
import type { Result } from "@/domain/result/Result"

export interface BookingManagementRepository {
  getBookings(): Promise<Result<Booking[]>>
  getBookingById(bookingId: string): Promise<Result<Booking>>
  getBookingFormOptions(): Promise<Result<BookingFormOptions>>
  updateBooking(input: UpdateBookingInput): Promise<Result<Booking>>
  returnBooking(bookingId: string): Promise<Result<Booking>>
  extendBooking(bookingId: string): Promise<Result<Booking>>
  cancelBooking(bookingId: string): Promise<Result<Booking>>
  deleteBooking(bookingId: string): Promise<Result<null>>
}
