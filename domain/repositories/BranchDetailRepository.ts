import type { Author } from "@/domain/entities/author/Author"
import type { Book } from "@/domain/entities/book/Book"
import type { Branch } from "@/domain/entities/branch/Branch"
import type { BranchDetail } from "@/domain/entities/branch/BranchDetail"
import type { Member } from "@/domain/entities/member/Member"
import type { StaffMember } from "@/domain/entities/staff/StaffMember"
import type { Translator } from "@/domain/entities/translator/Translator"
import type { Result } from "@/domain/result/Result"

export interface BranchDetailRepository {
  getBranchDetail(branchId: string): Promise<Result<BranchDetail | null>>
  getSubBranches(branchId: string): Promise<Result<Branch[]>>
  getBooks(branchId: string): Promise<Result<Book[]>>
  getAuthors(branchId: string): Promise<Result<Author[]>>
  getTranslators(branchId: string): Promise<Result<Translator[]>>
  getStaff(branchId: string): Promise<Result<StaffMember[]>>
  getMembers(branchId: string): Promise<Result<Member[]>>
  deleteSubBranch(branchId: string): Promise<Result<null>>
  toggleSubBranchStatus(branchId: string): Promise<Result<Branch>>
  deleteBook(bookId: string): Promise<Result<null>>
  toggleBookStatus(bookId: string): Promise<Result<Book>>
  deleteAuthor(authorId: string): Promise<Result<null>>
  toggleAuthorStatus(authorId: string): Promise<Result<Author>>
  deleteTranslator(translatorId: string): Promise<Result<null>>
  toggleTranslatorStatus(translatorId: string): Promise<Result<Translator>>
  deleteStaff(staffId: string): Promise<Result<null>>
  toggleStaffStatus(staffId: string): Promise<Result<StaffMember>>
  deleteMember(memberId: string): Promise<Result<null>>
  toggleMemberStatus(memberId: string): Promise<Result<Member>>
}
