import type { BookStatus } from "@/domain/entities/book/Book"
import type { StaffRole } from "@/domain/entities/staff/StaffMember"

export type GroupStatus = "active" | "inactive"

export type LibraryGroup = {
  id: string
  name: string
  description: string
  status: GroupStatus
  imageUrl: string | null
  branchId: string
  bookIds: string[]
  staffIds: string[]
  createdAt: string
  updatedAt: string
  deletedAt: string | null
}

export type GroupListItem = {
  id: string
  name: string
  description: string
  branchId: string
  totalBooks: number
  assignedStaff: number
  createdAt: string
  status: GroupStatus
  imageUrl: string | null
}

export type GroupAssignedBook = {
  id: string
  title: string
  author: string
  isbn: string
  coverUrl: string | null
  category: string
  branchId: string
  branchName: string
  stock: number
  available: number
  price: number
  status: BookStatus
}

export type GroupAssignedStaff = {
  id: string
  staffName: string
  role: StaffRole
  email: string
  phone: string
  imageUrl: string | null
}

export type GroupDetail = {
  id: string
  name: string
  description: string
  status: GroupStatus
  imageUrl: string | null
  branchId: string
  createdAt: string
  updatedAt: string
  totalBooks: number
  totalAssignedStaff: number
  books: GroupAssignedBook[]
  staff: GroupAssignedStaff[]
}

export type GroupSummary = {
  totalGroups: number
  activeGroups: number
  totalAssignedBooks: number
  totalAssignedStaff: number
}
