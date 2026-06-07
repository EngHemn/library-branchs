import type { GroupFakeDataSource } from "@/data/datasources/GroupFakeDataSource"
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

export class GroupRepositoryImpl implements GroupRepository {
  constructor(private readonly dataSource: GroupFakeDataSource) {}

  getGroups(): Promise<Result<GroupListItem[]>> {
    return this.dataSource.getGroups()
  }

  getGroupById(id: string): Promise<Result<GroupDetail | null>> {
    return this.dataSource.getGroupById(id)
  }

  getGroupSalesHistory(groupId: string): Promise<Result<Sale[]>> {
    return this.dataSource.getGroupSalesHistory(groupId)
  }

  getGroupSummary(): Promise<Result<GroupSummary>> {
    return this.dataSource.getGroupSummary()
  }

  getBookOptions(): Promise<Result<GroupBookOption[]>> {
    return this.dataSource.getBookOptions()
  }

  getStaffOptions(): Promise<Result<GroupStaffOption[]>> {
    return this.dataSource.getStaffOptions()
  }

  createGroup(input: CreateGroupInput): Promise<Result<GroupDetail>> {
    return this.dataSource.createGroup(input)
  }

  updateGroup(input: UpdateGroupInput): Promise<Result<GroupDetail>> {
    return this.dataSource.updateGroup(input)
  }

  deleteGroup(id: string): Promise<Result<null>> {
    return this.dataSource.deleteGroup(id)
  }
}
