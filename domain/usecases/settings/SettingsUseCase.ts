import type { Settings } from "@/domain/entities/settings/Settings"
import type {
  SettingsRepository,
  UpdateBorrowingRulesInput,
  UpdateLibraryInfoInput,
  UpdateNotificationsInput,
} from "@/domain/repositories/SettingsRepository"
import type { Result } from "@/domain/result/Result"

export class SettingsUseCase {
  constructor(private readonly settingsRepository: SettingsRepository) {}

  getSettings(): Promise<Result<Settings>> {
    return this.settingsRepository.getSettings()
  }

  updateLibraryInfo(input: UpdateLibraryInfoInput): Promise<Result<Settings>> {
    return this.settingsRepository.updateLibraryInfo(input)
  }

  updateBorrowingRules(
    input: UpdateBorrowingRulesInput
  ): Promise<Result<Settings>> {
    return this.settingsRepository.updateBorrowingRules(input)
  }

  updateNotifications(
    input: UpdateNotificationsInput
  ): Promise<Result<Settings>> {
    return this.settingsRepository.updateNotifications(input)
  }
}
