import { MemberManagementFakeDataSource } from "@/data/datasources/MemberManagementFakeDataSource"
import type { Member } from "@/domain/entities/member/Member"
import type { MemberDetail } from "@/domain/entities/member/MemberDetail"
import type {
  CreateMemberInput,
  MemberManagementRepository,
  UpdateMemberInput,
} from "@/domain/repositories/MemberManagementRepository"
import type { Result } from "@/domain/result/Result"

export class MemberManagementRepositoryImpl
  implements MemberManagementRepository
{
  constructor(
    private readonly memberManagementFakeDataSource: MemberManagementFakeDataSource
  ) {}

  getMembers(): Promise<Result<Member[]>> {
    return this.memberManagementFakeDataSource.getMembers()
  }

  getMemberById(memberId: string): Promise<Result<MemberDetail | null>> {
    return this.memberManagementFakeDataSource.getMemberById(memberId)
  }

  createMember(input: CreateMemberInput): Promise<Result<Member>> {
    return this.memberManagementFakeDataSource.createMember(input)
  }

  updateMember(input: UpdateMemberInput): Promise<Result<Member>> {
    return this.memberManagementFakeDataSource.updateMember(input)
  }

  deleteMember(memberId: string): Promise<Result<null>> {
    return this.memberManagementFakeDataSource.deleteMember(memberId)
  }
}
