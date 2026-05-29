import { SettingsFakeDataSource } from "@/data/datasources/SettingsFakeDataSource"
import { SettingsRepositoryImpl } from "@/data/repositories/SettingsRepositoryImpl"
import { SettingsUseCase } from "@/domain/usecases/settings/SettingsUseCase"

const settingsFakeDataSource = new SettingsFakeDataSource()
const settingsRepository = new SettingsRepositoryImpl(settingsFakeDataSource)

export const settingsUseCase = new SettingsUseCase(settingsRepository)
