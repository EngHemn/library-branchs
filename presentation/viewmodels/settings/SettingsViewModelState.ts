"use client"

import type { Settings } from "@/domain/entities/settings/Settings"
import type { SettingsLoadStatus } from "./useSettingsLoader"

export type SettingsViewModelState = {
  loadStatus: SettingsLoadStatus
  loadError: string | null
  isLoading: boolean
  settings: Settings | null
  libraryInfoSaving: boolean
  libraryInfoError: string | null
  libraryInfoSuccess: boolean
  borrowingRulesSaving: boolean
  borrowingRulesError: string | null
  borrowingRulesSuccess: boolean
  notificationsSaving: boolean
  notificationsError: string | null
  notificationsSuccess: boolean
}
