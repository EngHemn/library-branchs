import type {
  GroupDetail,
  GroupListItem,
  GroupSummary,
} from "@/domain/entities/group/Group"
import type { Sale } from "@/domain/entities/sales/Sale"
import type {
  CreateGroupInput,
  GroupBookOption,
  GroupRepository,
  GroupStaffOption,
  UpdateGroupInput,
} from "@/domain/repositories/GroupRepository"
import type { Result } from "@/domain/result/Result"

export class GroupManagementUseCase {
  constructor(private readonly groupRepository: GroupRepository) {}

  getGroups(): Promise<Result<GroupListItem[]>> {
    return this.groupRepository.getGroups()
  }

  getGroupById(id: string): Promise<Result<GroupDetail | null>> {
    return this.groupRepository.getGroupById(id)
  }

  getGroupSalesHistory(groupId: string): Promise<Result<Sale[]>> {
    return this.groupRepository.getGroupSalesHistory(groupId)
  }

  getGroupSummary(): Promise<Result<GroupSummary>> {
    return this.groupRepository.getGroupSummary()
  }

  getBookOptions(): Promise<Result<GroupBookOption[]>> {
    return this.groupRepository.getBookOptions()
  }

  getStaffOptions(): Promise<Result<GroupStaffOption[]>> {
    return this.groupRepository.getStaffOptions()
  }

  createGroup(input: CreateGroupInput): Promise<Result<GroupDetail>> {
    return this.groupRepository.createGroup(input)
  }

  updateGroup(input: UpdateGroupInput): Promise<Result<GroupDetail>> {
    return this.groupRepository.updateGroup(input)
  }

  deleteGroup(id: string): Promise<Result<null>> {
    return this.groupRepository.deleteGroup(id)
  }
}
