import type { Author } from "@/domain/entities/author/Author"
import type { Book } from "@/domain/entities/book/Book"
import type { Branch } from "@/domain/entities/branch/Branch"
import type { BranchDetail } from "@/domain/entities/branch/BranchDetail"
import type { Member } from "@/domain/entities/member/Member"
import type { BranchPermissions } from "@/domain/entities/permission/BranchPermissions"
import type { StaffMember } from "@/domain/entities/staff/StaffMember"
import type { Translator } from "@/domain/entities/translator/Translator"
import type { BranchDetailRepository } from "@/domain/repositories/BranchDetailRepository"
import type { Result } from "@/domain/result/Result"
import { getBranchPermissions } from "@/domain/services/branchPermissions"

export class BranchDetailUseCase {
  constructor(
    private readonly branchDetailRepository: BranchDetailRepository
  ) {}

  getBranchDetail(branchId: string): Promise<Result<BranchDetail | null>> {
    return this.branchDetailRepository.getBranchDetail(branchId)
  }

  getSubBranches(branchId: string): Promise<Result<Branch[]>> {
    return this.branchDetailRepository.getSubBranches(branchId)
  }

  getBooks(branchId: string): Promise<Result<Book[]>> {
    return this.branchDetailRepository.getBooks(branchId)
  }

  getAuthors(branchId: string): Promise<Result<Author[]>> {
    return this.branchDetailRepository.getAuthors(branchId)
  }

  getTranslators(branchId: string): Promise<Result<Translator[]>> {
    return this.branchDetailRepository.getTranslators(branchId)
  }

  getStaff(branchId: string): Promise<Result<StaffMember[]>> {
    return this.branchDetailRepository.getStaff(branchId)
  }

  getMembers(branchId: string): Promise<Result<Member[]>> {
    return this.branchDetailRepository.getMembers(branchId)
  }

  getPermissions(branchDetail: BranchDetail): BranchPermissions {
    return getBranchPermissions(branchDetail.type)
  }

  deleteSubBranch(branchId: string): Promise<Result<null>> {
    return this.branchDetailRepository.deleteSubBranch(branchId)
  }

  toggleSubBranchStatus(branchId: string): Promise<Result<Branch>> {
    return this.branchDetailRepository.toggleSubBranchStatus(branchId)
  }

  deleteBook(bookId: string): Promise<Result<null>> {
    return this.branchDetailRepository.deleteBook(bookId)
  }

  toggleBookStatus(bookId: string): Promise<Result<Book>> {
    return this.branchDetailRepository.toggleBookStatus(bookId)
  }

  deleteAuthor(authorId: string): Promise<Result<null>> {
    return this.branchDetailRepository.deleteAuthor(authorId)
  }

  toggleAuthorStatus(authorId: string): Promise<Result<Author>> {
    return this.branchDetailRepository.toggleAuthorStatus(authorId)
  }

  deleteTranslator(translatorId: string): Promise<Result<null>> {
    return this.branchDetailRepository.deleteTranslator(translatorId)
  }

  toggleTranslatorStatus(translatorId: string): Promise<Result<Translator>> {
    return this.branchDetailRepository.toggleTranslatorStatus(translatorId)
  }

  deleteStaff(staffId: string): Promise<Result<null>> {
    return this.branchDetailRepository.deleteStaff(staffId)
  }

  toggleStaffStatus(staffId: string): Promise<Result<StaffMember>> {
    return this.branchDetailRepository.toggleStaffStatus(staffId)
  }

  deleteMember(memberId: string): Promise<Result<null>> {
    return this.branchDetailRepository.deleteMember(memberId)
  }

  toggleMemberStatus(memberId: string): Promise<Result<Member>> {
    return this.branchDetailRepository.toggleMemberStatus(memberId)
  }
}
