import { BookingManagementFakeDataSource } from "@/data/datasources/BookingManagementFakeDataSource"
import type { Booking } from "@/domain/entities/booking/Booking"
import type { BookingFormOptions } from "@/domain/entities/booking/BookingFormOptions"
import type { UpdateBookingInput } from "@/domain/entities/booking/UpdateBookingInput"
import type { BookingManagementRepository } from "@/domain/repositories/BookingManagementRepository"
import type { Result } from "@/domain/result/Result"

export class BookingManagementRepositoryImpl implements BookingManagementRepository {
  constructor(
    private readonly bookingManagementFakeDataSource: BookingManagementFakeDataSource
  ) {}

  getBookings(): Promise<Result<Booking[]>> {
    return this.bookingManagementFakeDataSource.getBookings()
  }

  getBookingById(bookingId: string): Promise<Result<Booking>> {
    return this.bookingManagementFakeDataSource.getBookingById(bookingId)
  }

  getBookingFormOptions(): Promise<Result<BookingFormOptions>> {
    return this.bookingManagementFakeDataSource.getBookingFormOptions()
  }

  updateBooking(input: UpdateBookingInput): Promise<Result<Booking>> {
    return this.bookingManagementFakeDataSource.updateBooking(input)
  }

  returnBooking(bookingId: string): Promise<Result<Booking>> {
    return this.bookingManagementFakeDataSource.returnBooking(bookingId)
  }

  extendBooking(bookingId: string): Promise<Result<Booking>> {
    return this.bookingManagementFakeDataSource.extendBooking(bookingId)
  }

  cancelBooking(bookingId: string): Promise<Result<Booking>> {
    return this.bookingManagementFakeDataSource.cancelBooking(bookingId)
  }

  deleteBooking(bookingId: string): Promise<Result<null>> {
    return this.bookingManagementFakeDataSource.deleteBooking(bookingId)
  }
}
