import type { BookStatus } from "@/domain/entities/book/Book"
import type {
  GroupDetail,
  GroupListItem,
  GroupSummary,
  LibraryGroup,
} from "@/domain/entities/group/Group"
import type { Sale } from "@/domain/entities/sales/Sale"
import type { StaffRole } from "@/domain/entities/staff/StaffMember"
import type { Result } from "@/domain/result/Result"

export type GroupBookOption = {
  id: string
  title: string
  author: string
  isbn: string
  coverUrl: string | null
  stock: number
  available: number
  price: number
  status: BookStatus
}

export type GroupStaffOption = {
  id: string
  staffName: string
  role: StaffRole
  email: string
  phone: string
  imageUrl: string | null
}

export type GroupBranchOption = {
  id: string
  name: string
}

export type CreateGroupInput = {
  name: string
  description: string
  status: LibraryGroup["status"]
  imageUrl?: string | null
  branchId: string
  bookIds: string[]
  staffIds: string[]
}

export type UpdateGroupInput = CreateGroupInput & {
  id: string
}

export interface GroupRepository {
  getGroups(): Promise<Result<GroupListItem[]>>
  getGroupById(id: string): Promise<Result<GroupDetail | null>>
  getGroupSalesHistory(groupId: string): Promise<Result<Sale[]>>
  getGroupSummary(): Promise<Result<GroupSummary>>
  getBookOptions(): Promise<Result<GroupBookOption[]>>
  getStaffOptions(): Promise<Result<GroupStaffOption[]>>
  createGroup(input: CreateGroupInput): Promise<Result<GroupDetail>>
  updateGroup(input: UpdateGroupInput): Promise<Result<GroupDetail>>
  deleteGroup(id: string): Promise<Result<null>>
}
