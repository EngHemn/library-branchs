import type { Booking, BookingStats } from "@/domain/entities/booking/Booking"
import type { BookingFormOptions } from "@/domain/entities/booking/BookingFormOptions"
import type { UpdateBookingInput } from "@/domain/entities/booking/UpdateBookingInput"
import type { BookingManagementRepository } from "@/domain/repositories/BookingManagementRepository"
import type { Result } from "@/domain/result/Result"

export type BookingListData = {
  bookings: Booking[]
  stats: BookingStats
}

function calculateBookingStats(bookings: Booking[]): BookingStats {
  return {
    reserved: bookings.filter((booking) => booking.status === "reserved").length,
    borrowed: bookings.filter((booking) => booking.status === "borrowed").length,
    returned: bookings.filter((booking) => booking.status === "returned").length,
    overdue: bookings.filter((booking) => booking.status === "overdue").length,
    cancelled: bookings.filter((booking) => booking.status === "cancelled").length,
    inside: bookings.filter((booking) => booking.type === "inside").length,
    outside: bookings.filter((booking) => booking.type === "outside").length,
  }
}

export class BookingManagementUseCase {
  constructor(
    private readonly bookingManagementRepository: BookingManagementRepository
  ) {}

  async getBookings(): Promise<Result<BookingListData>> {
    const result = await this.bookingManagementRepository.getBookings()

    if (!result.success) {
      return result
    }

    return {
      success: true,
      data: {
        bookings: result.data,
        stats: calculateBookingStats(result.data),
      },
    }
  }

  getBookingById(bookingId: string): Promise<Result<Booking>> {
    return this.bookingManagementRepository.getBookingById(bookingId)
  }

  getBookingFormOptions(): Promise<Result<BookingFormOptions>> {
    return this.bookingManagementRepository.getBookingFormOptions()
  }

  updateBooking(input: UpdateBookingInput): Promise<Result<Booking>> {
    return this.bookingManagementRepository.updateBooking(input)
  }

  returnBooking(bookingId: string): Promise<Result<Booking>> {
    return this.bookingManagementRepository.returnBooking(bookingId)
  }

  extendBooking(bookingId: string): Promise<Result<Booking>> {
    return this.bookingManagementRepository.extendBooking(bookingId)
  }

  cancelBooking(bookingId: string): Promise<Result<Booking>> {
    return this.bookingManagementRepository.cancelBooking(bookingId)
  }

  deleteBooking(bookingId: string): Promise<Result<null>> {
    return this.bookingManagementRepository.deleteBooking(bookingId)
  }
}
