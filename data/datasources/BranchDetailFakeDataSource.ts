import type { Author } from "@/domain/entities/author/Author"
import type { Book } from "@/domain/entities/book/Book"
import type { Branch } from "@/domain/entities/branch/Branch"
import type { BranchDetail } from "@/domain/entities/branch/BranchDetail"
import type { Member } from "@/domain/entities/member/Member"
import type { StaffMember } from "@/domain/entities/staff/StaffMember"
import type { Translator } from "@/domain/entities/translator/Translator"
import type { Result } from "@/domain/result/Result"
import { fakeAuthors } from "@/data/fake/fakeAuthors"
import { fakeBooks } from "@/data/fake/fakeBooks"
import { fakeBranchDetails } from "@/data/fake/fakeBranchDetails"
import { fakeMembers } from "@/data/fake/fakeMembers"
import { fakeStaff } from "@/data/fake/fakeStaff"
import { fakeTranslators } from "@/data/fake/fakeTranslators"

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

export class BranchDetailFakeDataSource {
  private branchDetails: BranchDetail[] = fakeBranchDetails.map((d) => ({ ...d }))
  private books: Book[] = fakeBooks.map((b) => ({ ...b }))
  private authors: Author[] = fakeAuthors.map((a) => ({ ...a }))
  private translators: Translator[] = fakeTranslators.map((t) => ({ ...t }))
  private staff: StaffMember[] = fakeStaff.map((s) => ({ ...s }))
  private members: Member[] = fakeMembers.map((m) => ({ ...m }))

  async getBranchDetail(branchId: string): Promise<Result<BranchDetail | null>> {
    await delay(300)

    const detail = this.branchDetails.find((d) => d.id === branchId)

    return {
      success: true,
      data: detail ? { ...detail } : null,
    }
  }

  async getSubBranches(branchId: string): Promise<Result<Branch[]>> {
    await delay(250)

    const parentBranch = this.branchDetails.find((d) => d.id === branchId)

    if (!parentBranch) {
      return { success: true, data: [] }
    }

    const subBranches = this.branchDetails.filter(
      (d) => d.parentBranch === parentBranch.branchName && d.type === "sub"
    )

    return {
      success: true,
      data: subBranches.map((d) => ({ ...d })),
    }
  }

  async getBooks(branchId: string): Promise<Result<Book[]>> {
    await delay(250)

    const books = this.books.filter((b) => b.branchId === branchId)

    return {
      success: true,
      data: books.map((b) => ({ ...b })),
    }
  }

  async getAuthors(branchId: string): Promise<Result<Author[]>> {
    await delay(200)

    const authors = this.authors.filter((a) => a.branchId === branchId)

    return {
      success: true,
      data: authors.map((a) => ({ ...a })),
    }
  }

  async getTranslators(branchId: string): Promise<Result<Translator[]>> {
    await delay(200)

    const translators = this.translators.filter((t) => t.branchId === branchId)

    return {
      success: true,
      data: translators.map((t) => ({ ...t })),
    }
  }

  async getStaff(branchId: string): Promise<Result<StaffMember[]>> {
    await delay(250)

    const staff = this.staff.filter((s) => s.branchId === branchId)

    return {
      success: true,
      data: staff.map((s) => ({ ...s })),
    }
  }

  async getMembers(branchId: string): Promise<Result<Member[]>> {
    await delay(250)

    const members = this.members.filter((m) => m.branchId === branchId)

    return {
      success: true,
      data: members.map((m) => ({ ...m })),
    }
  }

  async deleteSubBranch(branchId: string): Promise<Result<null>> {
    await delay(200)

    const exists = this.branchDetails.some((d) => d.id === branchId)

    if (!exists) {
      return { success: false, error: "Sub branch could not be found." }
    }

    this.branchDetails = this.branchDetails.filter((d) => d.id !== branchId)

    return { success: true, data: null }
  }

  async toggleSubBranchStatus(branchId: string): Promise<Result<Branch>> {
    await delay(200)

    const branch = this.branchDetails.find((d) => d.id === branchId)

    if (!branch) {
      return { success: false, error: "Sub branch could not be found." }
    }

    const updated: BranchDetail = {
      ...branch,
      status: branch.status === "active" ? "inactive" : "active",
    }

    this.branchDetails = this.branchDetails.map((d) =>
      d.id === branchId ? updated : d
    )

    return { success: true, data: { ...updated } }
  }

  async deleteBook(bookId: string): Promise<Result<null>> {
    await delay(200)

    const exists = this.books.some((b) => b.id === bookId)

    if (!exists) {
      return { success: false, error: "Book could not be found." }
    }

    this.books = this.books.filter((b) => b.id !== bookId)

    return { success: true, data: null }
  }

  async toggleBookStatus(bookId: string): Promise<Result<Book>> {
    await delay(200)

    const book = this.books.find((b) => b.id === bookId)

    if (!book) {
      return { success: false, error: "Book could not be found." }
    }

    const updated: Book = {
      ...book,
      status: book.status === "available" ? "unavailable" : "available",
    }

    this.books = this.books.map((b) => (b.id === bookId ? updated : b))

    return { success: true, data: { ...updated } }
  }

  async deleteAuthor(authorId: string): Promise<Result<null>> {
    await delay(200)

    const exists = this.authors.some((a) => a.id === authorId)

    if (!exists) {
      return { success: false, error: "Author could not be found." }
    }

    this.authors = this.authors.filter((a) => a.id !== authorId)

    return { success: true, data: null }
  }

  async toggleAuthorStatus(authorId: string): Promise<Result<Author>> {
    await delay(200)

    const author = this.authors.find((a) => a.id === authorId)

    if (!author) {
      return { success: false, error: "Author could not be found." }
    }

    const updated: Author = {
      ...author,
      status: author.status === "active" ? "inactive" : "active",
    }

    this.authors = this.authors.map((a) => (a.id === authorId ? updated : a))

    return { success: true, data: { ...updated } }
  }

  async deleteTranslator(translatorId: string): Promise<Result<null>> {
    await delay(200)

    const exists = this.translators.some((t) => t.id === translatorId)

    if (!exists) {
      return { success: false, error: "Translator could not be found." }
    }

    this.translators = this.translators.filter((t) => t.id !== translatorId)

    return { success: true, data: null }
  }

  async toggleTranslatorStatus(translatorId: string): Promise<Result<Translator>> {
    await delay(200)

    const translator = this.translators.find((t) => t.id === translatorId)

    if (!translator) {
      return { success: false, error: "Translator could not be found." }
    }

    const updated: Translator = {
      ...translator,
      status: translator.status === "active" ? "inactive" : "active",
    }

    this.translators = this.translators.map((t) =>
      t.id === translatorId ? updated : t
    )

    return { success: true, data: { ...updated } }
  }

  async deleteStaff(staffId: string): Promise<Result<null>> {
    await delay(200)

    const exists = this.staff.some((s) => s.id === staffId)

    if (!exists) {
      return { success: false, error: "Staff member could not be found." }
    }

    this.staff = this.staff.filter((s) => s.id !== staffId)

    return { success: true, data: null }
  }

  async toggleStaffStatus(staffId: string): Promise<Result<StaffMember>> {
    await delay(200)

    const member = this.staff.find((s) => s.id === staffId)

    if (!member) {
      return { success: false, error: "Staff member could not be found." }
    }

    const updated: StaffMember = {
      ...member,
      status: member.status === "active" ? "inactive" : "active",
    }

    this.staff = this.staff.map((s) => (s.id === staffId ? updated : s))

    return { success: true, data: { ...updated } }
  }

  async deleteMember(memberId: string): Promise<Result<null>> {
    await delay(200)

    const exists = this.members.some((m) => m.id === memberId)

    if (!exists) {
      return { success: false, error: "Member could not be found." }
    }

    this.members = this.members.filter((m) => m.id !== memberId)

    return { success: true, data: null }
  }

  async toggleMemberStatus(memberId: string): Promise<Result<Member>> {
    await delay(200)

    const member = this.members.find((m) => m.id === memberId)

    if (!member) {
      return { success: false, error: "Member could not be found." }
    }

    const updated: Member = {
      ...member,
      status: member.status === "active" ? "inactive" : "active",
    }

    this.members = this.members.map((m) => (m.id === memberId ? updated : m))

    return { success: true, data: { ...updated } }
  }
}
