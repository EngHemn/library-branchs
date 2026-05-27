import type { Member } from "@/domain/entities/member/Member"
import type { MemberDetail } from "@/domain/entities/member/MemberDetail"
import type {
  CreateMemberInput,
  MemberManagementRepository,
  UpdateMemberInput,
} from "@/domain/repositories/MemberManagementRepository"
import type { Result } from "@/domain/result/Result"

export class MemberManagementUseCase {
  constructor(
    private readonly memberManagementRepository: MemberManagementRepository
  ) {}

  getMembers(): Promise<Result<Member[]>> {
    return this.memberManagementRepository.getMembers()
  }

  getMemberById(memberId: string): Promise<Result<MemberDetail | null>> {
    return this.memberManagementRepository.getMemberById(memberId)
  }

  createMember(input: CreateMemberInput): Promise<Result<Member>> {
    return this.memberManagementRepository.createMember(input)
  }

  updateMember(input: UpdateMemberInput): Promise<Result<Member>> {
    return this.memberManagementRepository.updateMember(input)
  }

  deleteMember(memberId: string): Promise<Result<null>> {
    return this.memberManagementRepository.deleteMember(memberId)
  }
}
