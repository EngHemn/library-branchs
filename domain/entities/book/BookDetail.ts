import type { Book } from "@/domain/entities/book/Book"

export type BranchStock = {
  branchId: string
  branchName: string
  available: number
  reserved: number
  borrowed: number
  event: number
  sold: number
  damaged: number
  lost: number
}

export type BookingStatus = "active" | "returned" | "overdue" | "cancelled"
export type BookingType = "borrow" | "reserve"

export type BookingRecord = {
  bookingId: string
  memberId?: string
  memberName: string
  branchId?: string
  branchName: string
  type: BookingType
  date: string
  due: string
  returned: string | null
  status: BookingStatus
}

export type BookCreatedBy = {
  staffId: string
  staffName: string
}

export type BookDetail = Book & {
  description: string
  pages: number
  publicationDate: string
  shelfHint: string
  createdAt: string
  createdBy: BookCreatedBy
  activeBookings: number
  totalSold: number
  branchStocks: BranchStock[]
  bookingHistory: BookingRecord[]
}
