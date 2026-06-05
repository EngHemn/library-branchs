"use client"

import { settingsUseCase } from "./settingsDependencies"
import { SettingsScreen } from "@/presentation/screens/settings/SettingsScreen"

export default function SettingsPage() {
  return <SettingsScreen settingsUseCase={settingsUseCase} />
}
