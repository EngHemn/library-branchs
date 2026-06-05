import { memberDetailExtras } from "@/data/fake/fakeMemberDetails"
import { fakeBooks } from "@/data/fake/fakeBooks"
import { fakeBranches } from "@/data/fake/fakeBranches"
import { fakeMembers } from "@/data/fake/fakeMembers"
import type { Member } from "@/domain/entities/member/Member"
import type {
  MemberAddedBy,
  MemberBooking,
  MemberBookings,
  MemberDetail,
} from "@/domain/entities/member/MemberDetail"
import type {
  CreateMemberInput,
  UpdateMemberInput,
} from "@/domain/repositories/MemberManagementRepository"
import type { Result } from "@/domain/result/Result"

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

type MemberExtras = {
  address: string
  addedBy: MemberAddedBy
  bookings: MemberBookings
}

const bookIdByIsbn = Object.fromEntries(
  fakeBooks.map((book) => [book.isbn, book.id])
)

const branchIdByName = Object.fromEntries(
  fakeBranches.map((branch) => [branch.branchName, branch.id])
)

function enrichMemberBooking(booking: MemberBooking): MemberBooking {
  return {
    ...booking,
    bookId: booking.bookId ?? bookIdByIsbn[booking.isbn],
    branchId: booking.branchId ?? branchIdByName[booking.branchName],
  }
}

function enrichMemberBookings(bookings: MemberBookings): MemberBookings {
  return {
    active: bookings.active.map(enrichMemberBooking),
    lateReturns: bookings.lateReturns.map(enrichMemberBooking),
    history: bookings.history.map(enrichMemberBooking),
  }
}

const emptyBookings: MemberBookings = {
  active: [],
  lateReturns: [],
  history: [],
}

const defaultAddedBy: MemberAddedBy = {
  staffId: "ST-000",
  staffName: "System",
}

function cloneExtras(extras: MemberExtras): MemberExtras {
  return {
    address: extras.address,
    addedBy: { ...extras.addedBy },
    bookings: {
      active: extras.bookings.active.map(enrichMemberBooking),
      lateReturns: extras.bookings.lateReturns.map(enrichMemberBooking),
      history: extras.bookings.history.map(enrichMemberBooking),
    },
  }
}

function seedMemberExtras(): Record<string, MemberExtras> {
  const extras: Record<string, MemberExtras> = {}

  for (const [memberId, detail] of Object.entries(memberDetailExtras)) {
    extras[memberId] = cloneExtras({
      address: detail.address,
      addedBy: detail.addedBy,
      bookings: detail.bookings,
    })
  }

  return extras
}

let nextMemberSequence = fakeMembers.length + 1

export class MemberManagementFakeDataSource {
  private members: Member[] = fakeMembers.map((member) => ({
    ...member,
    allBranchesUsed: [...member.allBranchesUsed],
  }))

  private memberExtras: Record<string, MemberExtras> = seedMemberExtras()

  private buildMemberDetail(member: Member): MemberDetail {
    const extras = this.memberExtras[member.id] ?? {
      address: "—",
      addedBy: defaultAddedBy,
      bookings: emptyBookings,
    }

    return {
      ...member,
      allBranchesUsed: [...member.allBranchesUsed],
      address: extras.address,
      addedBy: { ...extras.addedBy },
      activeBookings: extras.bookings.active.length,
      bookings: enrichMemberBookings(extras.bookings),
    }
  }

  async getMembers(): Promise<Result<Member[]>> {
    await delay(350)

    return {
      success: true,
      data: this.members.map((member) => ({
        ...member,
        allBranchesUsed: [...member.allBranchesUsed],
      })),
    }
  }

  async getMemberById(memberId: string): Promise<Result<MemberDetail | null>> {
    await delay(350)

    const member = this.members.find((item) => item.id === memberId)

    if (!member) {
      return { success: true, data: null }
    }

    return { success: true, data: this.buildMemberDetail(member) }
  }

  async createMember(input: CreateMemberInput): Promise<Result<Member>> {
    await delay(350)

    const sequence = nextMemberSequence++
    const newMember: Member = {
      id: `member-${String(sequence).padStart(3, "0")}`,
      memberId: `M${String(sequence).padStart(3, "0")}`,
      memberName: input.memberName,
      membershipNumber: `LIB-${new Date().getFullYear()}-${String(sequence).padStart(4, "0")}`,
      registerBranch: input.registerBranch,
      allBranchesUsed: [input.registerBranch],
      email: input.email,
      phone: input.phone,
      registrationDate: new Date().toISOString().slice(0, 10),
      activeBookings: 0,
      status: input.status,
      branchId: input.branchId,
    }

    this.members.push(newMember)
    this.memberExtras[newMember.id] = {
      address: input.address,
      addedBy: defaultAddedBy,
      bookings: emptyBookings,
    }

    return {
      success: true,
      data: {
        ...newMember,
        allBranchesUsed: [...newMember.allBranchesUsed],
      },
    }
  }

  async updateMember(input: UpdateMemberInput): Promise<Result<Member>> {
    await delay(350)

    const memberIndex = this.members.findIndex((item) => item.id === input.id)

    if (memberIndex === -1) {
      return { success: false, error: "Member not found." }
    }

    const currentMember = this.members[memberIndex]
    const allBranchesUsed = currentMember.allBranchesUsed.includes(
      input.registerBranch
    )
      ? currentMember.allBranchesUsed
      : [...currentMember.allBranchesUsed, input.registerBranch]

    const updatedMember: Member = {
      ...currentMember,
      memberName: input.memberName,
      registerBranch: input.registerBranch,
      allBranchesUsed,
      email: input.email,
      phone: input.phone,
      status: input.status,
      branchId: input.branchId,
    }

    this.members[memberIndex] = updatedMember

    const currentExtras = this.memberExtras[input.id] ?? {
      address: input.address,
      addedBy: defaultAddedBy,
      bookings: emptyBookings,
    }

    this.memberExtras[input.id] = {
      ...currentExtras,
      address: input.address,
    }

    return {
      success: true,
      data: {
        ...updatedMember,
        allBranchesUsed: [...updatedMember.allBranchesUsed],
      },
    }
  }

  async deleteMember(memberId: string): Promise<Result<null>> {
    await delay(200)

    const exists = this.members.some((member) => member.id === memberId)

    if (!exists) {
      return { success: false, error: "Member could not be found." }
    }

    this.members = this.members.filter((member) => member.id !== memberId)
    delete this.memberExtras[memberId]

    return { success: true, data: null }
  }
}
