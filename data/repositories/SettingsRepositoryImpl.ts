import type { SettingsFakeDataSource } from "@/data/datasources/SettingsFakeDataSource"
import type { Settings } from "@/domain/entities/settings/Settings"
import type {
  SettingsRepository,
  UpdateBorrowingRulesInput,
  UpdateLibraryInfoInput,
  UpdateNotificationsInput,
} from "@/domain/repositories/SettingsRepository"
import type { Result } from "@/domain/result/Result"

export class SettingsRepositoryImpl implements SettingsRepository {
  constructor(private readonly dataSource: SettingsFakeDataSource) {}

  getSettings(): Promise<Result<Settings>> {
    return this.dataSource.getSettings()
  }

  updateLibraryInfo(input: UpdateLibraryInfoInput): Promise<Result<Settings>> {
    return this.dataSource.updateLibraryInfo(input)
  }

  updateBorrowingRules(
    input: UpdateBorrowingRulesInput
  ): Promise<Result<Settings>> {
    return this.dataSource.updateBorrowingRules(input)
  }

  updateNotifications(
    input: UpdateNotificationsInput
  ): Promise<Result<Settings>> {
    return this.dataSource.updateNotifications(input)
  }
}
