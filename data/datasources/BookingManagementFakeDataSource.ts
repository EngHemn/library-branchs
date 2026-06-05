import { fakeBookings } from "@/data/fake/fakeBookings"
import { fakeBooks } from "@/data/fake/fakeBooks"
import { fakeBranches } from "@/data/fake/fakeBranches"
import { fakeMembers } from "@/data/fake/fakeMembers"
import type { Booking } from "@/domain/entities/booking/Booking"
import type { BookingFormOptions } from "@/domain/entities/booking/BookingFormOptions"
import type { UpdateBookingInput } from "@/domain/entities/booking/UpdateBookingInput"
import type { Result } from "@/domain/result/Result"

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

function addDays(dateString: string, days: number): string {
  const date = new Date(`${dateString}T00:00:00`)
  date.setDate(date.getDate() + days)
  return date.toISOString().slice(0, 10)
}

function cloneBooking(booking: Booking): Booking {
  return { ...booking }
}

export class BookingManagementFakeDataSource {
  private bookings: Booking[] = fakeBookings.map(cloneBooking)

  async getBookings(): Promise<Result<Booking[]>> {
    try {
      await delay(400)
      return {
        success: true,
        data: this.bookings.map(cloneBooking),
      }
    } catch {
      return {
        success: false,
        error: "Failed to load bookings",
      }
    }
  }

  async getBookingById(bookingId: string): Promise<Result<Booking>> {
    try {
      await delay(300)

      const booking = this.bookings.find((item) => item.id === bookingId)

      if (!booking) {
        return {
          success: false,
          error: "Booking not found",
        }
      }

      return {
        success: true,
        data: cloneBooking(booking),
      }
    } catch {
      return {
        success: false,
        error: "Failed to load booking",
      }
    }
  }

  async getBookingFormOptions(): Promise<Result<BookingFormOptions>> {
    try {
      await delay(300)

      return {
        success: true,
        data: {
          books: fakeBooks.map((book) => ({
            value: book.id,
            label: book.title,
            searchText: [book.isbn, book.author, book.category]
              .filter(Boolean)
              .join(" "),
          })),
          branches: fakeBranches.map((branch) => ({
            value: branch.id,
            label: branch.branchName,
            searchText: [branch.email, branch.address].filter(Boolean).join(" "),
          })),
          members: fakeMembers.map((member) => ({
            value: member.id,
            label: member.memberName,
            branchId: member.branchId,
            searchText: [member.memberId, member.membershipNumber, member.email]
              .filter(Boolean)
              .join(" "),
          })),
        },
      }
    } catch {
      return {
        success: false,
        error: "Failed to load booking form options",
      }
    }
  }

  async updateBooking(input: UpdateBookingInput): Promise<Result<Booking>> {
    try {
      await delay(300)

      const index = this.bookings.findIndex((booking) => booking.id === input.id)

      if (index === -1) {
        return {
          success: false,
          error: "Booking not found",
        }
      }

      const book = fakeBooks.find((item) => item.id === input.bookId)
      const branch = fakeBranches.find((item) => item.id === input.branchId)
      const member = fakeMembers.find((item) => item.id === input.memberId)

      if (!book) {
        return {
          success: false,
          error: "Selected book was not found",
        }
      }

      if (!branch) {
        return {
          success: false,
          error: "Selected branch was not found",
        }
      }

      if (!member) {
        return {
          success: false,
          error: "Selected member was not found",
        }
      }

      if (member.branchId !== input.branchId) {
        return {
          success: false,
          error: "Selected member does not belong to this branch",
        }
      }

      const current = this.bookings[index]
      const updated: Booking = {
        ...current,
        bookId: input.bookId,
        bookTitle: book.title,
        memberId: input.memberId,
        memberName: member.memberName,
        branchId: input.branchId,
        branchName: branch.branchName,
        type: input.type,
        dueDate: input.dueDate,
        status: input.status,
      }

      this.bookings[index] = updated

      return {
        success: true,
        data: cloneBooking(updated),
      }
    } catch {
      return {
        success: false,
        error: "Failed to update booking",
      }
    }
  }

  async returnBooking(bookingId: string): Promise<Result<Booking>> {
    try {
      await delay(300)

      const index = this.bookings.findIndex(
        (booking) => booking.id === bookingId
      )

      if (index === -1) {
        return {
          success: false,
          error: "Booking not found",
        }
      }

      const booking = this.bookings[index]

      if (
        booking.status !== "borrowed" &&
        booking.status !== "overdue"
      ) {
        return {
          success: false,
          error: "Only borrowed or overdue bookings can be returned",
        }
      }

      const today = new Date().toISOString().slice(0, 10)
      const updated: Booking = {
        ...booking,
        status: "returned",
        returnDate: today,
      }

      this.bookings[index] = updated

      return {
        success: true,
        data: cloneBooking(updated),
      }
    } catch {
      return {
        success: false,
        error: "Failed to return booking",
      }
    }
  }

  async extendBooking(bookingId: string): Promise<Result<Booking>> {
    try {
      await delay(300)

      const index = this.bookings.findIndex(
        (booking) => booking.id === bookingId
      )

      if (index === -1) {
        return {
          success: false,
          error: "Booking not found",
        }
      }

      const booking = this.bookings[index]

      if (
        booking.status !== "borrowed" &&
        booking.status !== "overdue"
      ) {
        return {
          success: false,
          error: "Only borrowed or overdue bookings can be extended",
        }
      }

      const updated: Booking = {
        ...booking,
        dueDate: addDays(booking.dueDate, 14),
        status: "borrowed",
      }

      this.bookings[index] = updated

      return {
        success: true,
        data: cloneBooking(updated),
      }
    } catch {
      return {
        success: false,
        error: "Failed to extend booking",
      }
    }
  }

  async cancelBooking(bookingId: string): Promise<Result<Booking>> {
    try {
      await delay(300)

      const index = this.bookings.findIndex(
        (booking) => booking.id === bookingId
      )

      if (index === -1) {
        return {
          success: false,
          error: "Booking not found",
        }
      }

      const booking = this.bookings[index]

      if (
        booking.status !== "reserved" &&
        booking.status !== "borrowed" &&
        booking.status !== "overdue"
      ) {
        return {
          success: false,
          error: "This booking cannot be cancelled",
        }
      }

      const updated: Booking = {
        ...booking,
        status: "cancelled",
      }

      this.bookings[index] = updated

      return {
        success: true,
        data: cloneBooking(updated),
      }
    } catch {
      return {
        success: false,
        error: "Failed to cancel booking",
      }
    }
  }

  async deleteBooking(bookingId: string): Promise<Result<null>> {
    try {
      await delay(300)

      const index = this.bookings.findIndex(
        (booking) => booking.id === bookingId
      )

      if (index === -1) {
        return {
          success: false,
          error: "Booking not found",
        }
      }

      this.bookings.splice(index, 1)

      return {
        success: true,
        data: null,
      }
    } catch {
      return {
        success: false,
        error: "Failed to delete booking",
      }
    }
  }
}
