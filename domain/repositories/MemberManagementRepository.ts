import type { Member, MemberStatus } from "@/domain/entities/member/Member"
import type { MemberDetail } from "@/domain/entities/member/MemberDetail"
import type { Result } from "@/domain/result/Result"

export type CreateMemberInput = {
  memberName: string
  email: string
  phone: string
  branchId: string
  registerBranch: string
  address: string
  status: MemberStatus
}

export type UpdateMemberInput = CreateMemberInput & {
  id: string
}

export interface MemberManagementRepository {
  getMembers(): Promise<Result<Member[]>>
  getMemberById(memberId: string): Promise<Result<MemberDetail | null>>
  createMember(input: CreateMemberInput): Promise<Result<Member>>
  updateMember(input: UpdateMemberInput): Promise<Result<Member>>
  deleteMember(memberId: string): Promise<Result<null>>
}
