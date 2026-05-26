import { BranchDetailFakeDataSource } from "@/data/datasources/BranchDetailFakeDataSource"
import type { Author } from "@/domain/entities/author/Author"
import type { Book } from "@/domain/entities/book/Book"
import type { Branch } from "@/domain/entities/branch/Branch"
import type { BranchDetail } from "@/domain/entities/branch/BranchDetail"
import type { Member } from "@/domain/entities/member/Member"
import type { StaffMember } from "@/domain/entities/staff/StaffMember"
import type { Translator } from "@/domain/entities/translator/Translator"
import type { BranchDetailRepository } from "@/domain/repositories/BranchDetailRepository"
import type { Result } from "@/domain/result/Result"

export class BranchDetailRepositoryImpl implements BranchDetailRepository {
  constructor(
    private readonly dataSource: BranchDetailFakeDataSource
  ) {}

  getBranchDetail(branchId: string): Promise<Result<BranchDetail | null>> {
    return this.dataSource.getBranchDetail(branchId)
  }

  getSubBranches(branchId: string): Promise<Result<Branch[]>> {
    return this.dataSource.getSubBranches(branchId)
  }

  getBooks(branchId: string): Promise<Result<Book[]>> {
    return this.dataSource.getBooks(branchId)
  }

  getAuthors(branchId: string): Promise<Result<Author[]>> {
    return this.dataSource.getAuthors(branchId)
  }

  getTranslators(branchId: string): Promise<Result<Translator[]>> {
    return this.dataSource.getTranslators(branchId)
  }

  getStaff(branchId: string): Promise<Result<StaffMember[]>> {
    return this.dataSource.getStaff(branchId)
  }

  getMembers(branchId: string): Promise<Result<Member[]>> {
    return this.dataSource.getMembers(branchId)
  }

  deleteSubBranch(branchId: string): Promise<Result<null>> {
    return this.dataSource.deleteSubBranch(branchId)
  }

  toggleSubBranchStatus(branchId: string): Promise<Result<Branch>> {
    return this.dataSource.toggleSubBranchStatus(branchId)
  }

  deleteBook(bookId: string): Promise<Result<null>> {
    return this.dataSource.deleteBook(bookId)
  }

  toggleBookStatus(bookId: string): Promise<Result<Book>> {
    return this.dataSource.toggleBookStatus(bookId)
  }

  deleteAuthor(authorId: string): Promise<Result<null>> {
    return this.dataSource.deleteAuthor(authorId)
  }

  toggleAuthorStatus(authorId: string): Promise<Result<Author>> {
    return this.dataSource.toggleAuthorStatus(authorId)
  }

  deleteTranslator(translatorId: string): Promise<Result<null>> {
    return this.dataSource.deleteTranslator(translatorId)
  }

  toggleTranslatorStatus(translatorId: string): Promise<Result<Translator>> {
    return this.dataSource.toggleTranslatorStatus(translatorId)
  }

  deleteStaff(staffId: string): Promise<Result<null>> {
    return this.dataSource.deleteStaff(staffId)
  }

  toggleStaffStatus(staffId: string): Promise<Result<StaffMember>> {
    return this.dataSource.toggleStaffStatus(staffId)
  }

  deleteMember(memberId: string): Promise<Result<null>> {
    return this.dataSource.deleteMember(memberId)
  }

  toggleMemberStatus(memberId: string): Promise<Result<Member>> {
    return this.dataSource.toggleMemberStatus(memberId)
  }
}
