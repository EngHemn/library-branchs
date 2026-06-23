import type {
  BorrowingRules,
  LibraryInfo,
  NotificationSettings,
  Settings,
} from "@/domain/entities/settings/Settings"
import type { Result } from "@/domain/result/Result"

export type UpdateLibraryInfoInput = LibraryInfo
export type UpdateBorrowingRulesInput = BorrowingRules
export type UpdateNotificationsInput = NotificationSettings

export interface SettingsRepository {
  getSettings(): Promise<Result<Settings>>
  updateLibraryInfo(input: UpdateLibraryInfoInput): Promise<Result<Settings>>
  updateBorrowingRules(
    input: UpdateBorrowingRulesInput
  ): Promise<Result<Settings>>
  updateNotifications(
    input: UpdateNotificationsInput
  ): Promise<Result<Settings>>
}
