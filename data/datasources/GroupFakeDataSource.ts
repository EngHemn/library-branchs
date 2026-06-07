import { fakeBooks } from "@/data/fake/fakeBooks"
import { fakeBranches } from "@/data/fake/fakeBranches"
import { getFakeGroupSalesHistoryByGroupId } from "@/data/fake/fakeGroupSalesHistory"
import { fakeGroups } from "@/data/fake/fakeGroups"
import { fakeStaff } from "@/data/fake/fakeStaff"
import { groupSalesHistoryRecordsToSales } from "@/data/mappers/groupSalesHistoryMapper"
import type {
  GroupAssignedBook,
  GroupAssignedStaff,
  GroupDetail,
  GroupListItem,
  GroupSummary,
  LibraryGroup,
} from "@/domain/entities/group/Group"
import type { Sale } from "@/domain/entities/sales/Sale"
import type {
  CreateGroupInput,
  GroupBookOption,
  GroupStaffOption,
  UpdateGroupInput,
} from "@/domain/repositories/GroupRepository"
import type { Result } from "@/domain/result/Result"

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

function isActiveGroup(group: LibraryGroup): boolean {
  return group.deletedAt === null
}

function toListItem(group: LibraryGroup): GroupListItem {
  return {
    id: group.id,
    name: group.name,
    description: group.description,
    branchId: group.branchId,
    totalBooks: group.bookIds.length,
    assignedStaff: group.staffIds.length,
    createdAt: group.createdAt,
    status: group.status,
    imageUrl: group.imageUrl,
  }
}

function getBranchName(branchId: string): string {
  return (
    fakeBranches.find((branch) => branch.id === branchId)?.branchName ?? branchId
  )
}

function resolveBooks(bookIds: string[]): GroupAssignedBook[] {
  return bookIds
    .map((bookId) => fakeBooks.find((book) => book.id === bookId))
    .filter((book): book is NonNullable<typeof book> => book !== undefined)
    .map((book) => ({
      id: book.id,
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      coverUrl: book.coverUrl,
      category: book.category,
      branchId: book.branchId,
      branchName: getBranchName(book.branchId),
      stock: book.stock,
      available: book.available,
      price: book.price,
      status: book.status,
    }))
}

function resolveStaff(staffIds: string[]): GroupAssignedStaff[] {
  return staffIds
    .map((staffId) => fakeStaff.find((member) => member.id === staffId))
    .filter((member): member is NonNullable<typeof member> => member !== undefined)
    .map((member) => ({
      id: member.id,
      staffName: member.staffName,
      role: member.role,
      email: member.email,
      phone: member.phone,
      imageUrl: member.imageUrl ?? null,
    }))
}

function toGroupDetail(group: LibraryGroup): GroupDetail {
  return {
    id: group.id,
    name: group.name,
    description: group.description,
    status: group.status,
    imageUrl: group.imageUrl,
    branchId: group.branchId,
    createdAt: group.createdAt,
    updatedAt: group.updatedAt,
    totalBooks: group.bookIds.length,
    totalAssignedStaff: group.staffIds.length,
    books: resolveBooks(group.bookIds),
    staff: resolveStaff(group.staffIds),
  }
}

function buildSummary(groups: LibraryGroup[]): GroupSummary {
  const activeGroups = groups.filter(
    (group) => isActiveGroup(group) && group.status === "active"
  )

  const totalAssignedBooks = groups
    .filter(isActiveGroup)
    .reduce((total, group) => total + group.bookIds.length, 0)

  const totalAssignedStaff = groups
    .filter(isActiveGroup)
    .reduce((total, group) => total + group.staffIds.length, 0)

  return {
    totalGroups: groups.filter(isActiveGroup).length,
    activeGroups: activeGroups.length,
    totalAssignedBooks,
    totalAssignedStaff,
  }
}

let nextGroupNumber = fakeGroups.length + 1

export class GroupFakeDataSource {
  private groups: LibraryGroup[] = fakeGroups.map((group) => ({
    ...group,
    bookIds: [...group.bookIds],
    staffIds: [...group.staffIds],
  }))

  async getGroups(): Promise<Result<GroupListItem[]>> {
    await delay(400)

    return {
      success: true,
      data: this.groups.filter(isActiveGroup).map(toListItem),
    }
  }

  async getGroupById(id: string): Promise<Result<GroupDetail | null>> {
    await delay(300)

    const group = this.groups.find((item) => item.id === id && isActiveGroup(item))

    if (!group) {
      return { success: true, data: null }
    }

    return {
      success: true,
      data: toGroupDetail(group),
    }
  }

  async getGroupSalesHistory(groupId: string): Promise<Result<Sale[]>> {
    await delay(350)

    const groupExists = this.groups.some(
      (item) => item.id === groupId && isActiveGroup(item)
    )

    if (!groupExists) {
      return { success: false, error: "Group not found." }
    }

    const records = getFakeGroupSalesHistoryByGroupId(groupId)

    return {
      success: true,
      data: groupSalesHistoryRecordsToSales(records),
    }
  }

  async getGroupSummary(): Promise<Result<GroupSummary>> {
    await delay(200)

    return {
      success: true,
      data: buildSummary(this.groups),
    }
  }

  async getBookOptions(): Promise<Result<GroupBookOption[]>> {
    await delay(150)

    return {
      success: true,
      data: fakeBooks.map((book) => ({
        id: book.id,
        title: book.title,
        author: book.author,
        isbn: book.isbn,
        coverUrl: book.coverUrl,
        stock: book.stock,
        available: book.available,
        price: book.price,
        status: book.status,
      })),
    }
  }

  async getStaffOptions(): Promise<Result<GroupStaffOption[]>> {
    await delay(150)

    return {
      success: true,
      data: fakeStaff
        .filter((member) => member.status === "active")
        .map((member) => ({
          id: member.id,
          staffName: member.staffName,
          role: member.role,
          email: member.email,
          phone: member.phone,
          imageUrl: member.imageUrl ?? null,
        })),
    }
  }

  async createGroup(input: CreateGroupInput): Promise<Result<GroupDetail>> {
    await delay(400)

    const normalizedName = input.name.trim()
    const nameExists = this.groups.some(
      (group) =>
        isActiveGroup(group) &&
        group.name.toLowerCase() === normalizedName.toLowerCase()
    )

    if (nameExists) {
      return {
        success: false,
        error: "A group with this name already exists.",
      }
    }

    const now = new Date().toISOString()
    const newGroup: LibraryGroup = {
      id: `GRP-${String(nextGroupNumber).padStart(3, "0")}`,
      name: normalizedName,
      description: input.description.trim(),
      status: input.status,
      imageUrl: input.imageUrl ?? null,
      branchId: input.branchId,
      bookIds: [...input.bookIds],
      staffIds: [...input.staffIds],
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
    }

    nextGroupNumber += 1
    this.groups = [newGroup, ...this.groups]

    return {
      success: true,
      data: toGroupDetail(newGroup),
    }
  }

  async updateGroup(input: UpdateGroupInput): Promise<Result<GroupDetail>> {
    await delay(400)

    const groupIndex = this.groups.findIndex(
      (group) => group.id === input.id && isActiveGroup(group)
    )

    if (groupIndex === -1) {
      return { success: false, error: "Group not found." }
    }

    const normalizedName = input.name.trim()
    const nameExists = this.groups.some(
      (group) =>
        isActiveGroup(group) &&
        group.id !== input.id &&
        group.name.toLowerCase() === normalizedName.toLowerCase()
    )

    if (nameExists) {
      return {
        success: false,
        error: "A group with this name already exists.",
      }
    }

    const existingGroup = this.groups[groupIndex]
    const updatedGroup: LibraryGroup = {
      ...existingGroup,
      name: normalizedName,
      description: input.description.trim(),
      status: input.status,
      imageUrl: input.imageUrl ?? existingGroup.imageUrl,
      branchId: input.branchId,
      bookIds: [...input.bookIds],
      staffIds: [...input.staffIds],
      updatedAt: new Date().toISOString(),
    }

    this.groups = this.groups.map((group) =>
      group.id === input.id ? updatedGroup : group
    )

    return {
      success: true,
      data: toGroupDetail(updatedGroup),
    }
  }

  async deleteGroup(id: string): Promise<Result<null>> {
    await delay(350)

    const groupIndex = this.groups.findIndex(
      (group) => group.id === id && isActiveGroup(group)
    )

    if (groupIndex === -1) {
      return { success: false, error: "Group not found." }
    }

    this.groups = this.groups.map((group) =>
      group.id === id
        ? { ...group, deletedAt: new Date().toISOString(), status: "inactive" }
        : group
    )

    return { success: true, data: null }
  }
}
