import { fakeSettings } from "@/data/fake/fakeSettings"
import type {
  BorrowingRules,
  LibraryInfo,
  NotificationSettings,
  Settings,
} from "@/domain/entities/settings/Settings"
import type { Result } from "@/domain/result/Result"

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

let currentSettings: Settings = { ...fakeSettings }

export class SettingsFakeDataSource {
  async getSettings(): Promise<Result<Settings>> {
    await delay(600)
    return { success: true, data: { ...currentSettings } }
  }

  async updateLibraryInfo(input: LibraryInfo): Promise<Result<Settings>> {
    await delay(700)
    currentSettings = {
      ...currentSettings,
      libraryInfo: { ...input },
      updatedAt: new Date().toISOString(),
    }
    return { success: true, data: { ...currentSettings } }
  }

  async updateBorrowingRules(input: BorrowingRules): Promise<Result<Settings>> {
    await delay(700)
    currentSettings = {
      ...currentSettings,
      borrowingRules: { ...input },
      updatedAt: new Date().toISOString(),
    }
    return { success: true, data: { ...currentSettings } }
  }

  async updateNotifications(
    input: NotificationSettings
  ): Promise<Result<Settings>> {
    await delay(500)
    currentSettings = {
      ...currentSettings,
      notifications: { ...input },
      updatedAt: new Date().toISOString(),
    }
    return { success: true, data: { ...currentSettings } }
  }
}
