"use client"

import { useEffect, useState } from "react"
import { useForm, type UseFormReturn } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import type { Settings } from "@/domain/entities/settings/Settings"
import {
  borrowingRulesFormSchema,
  libraryInfoFormSchema,
  notificationsFormSchema,
  type BorrowingRulesFormValues,
  type LibraryInfoFormValues,
  type NotificationsFormValues,
} from "@/domain/schemas/settingsFormSchema"
import type { SettingsUseCase } from "@/domain/usecases/settings/SettingsUseCase"

type AsyncStatus = "idle" | "loading" | "success" | "error"

type SettingsViewModelState = {
  loadStatus: AsyncStatus
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

export type SettingsViewModel = {
  state: SettingsViewModelState
  libraryInfoForm: UseFormReturn<LibraryInfoFormValues>
  borrowingRulesForm: UseFormReturn<BorrowingRulesFormValues>
  notificationsForm: UseFormReturn<NotificationsFormValues>
  saveLibraryInfo: (values: LibraryInfoFormValues) => Promise<void>
  saveBorrowingRules: (values: BorrowingRulesFormValues) => Promise<void>
  saveNotifications: (values: NotificationsFormValues) => Promise<void>
  reload: () => Promise<void>
}

export function useSettingsViewModel(
  settingsUseCase: SettingsUseCase
): SettingsViewModel {
  const [loadStatus, setLoadStatus] = useState<AsyncStatus>("idle")
  const [loadError, setLoadError] = useState<string | null>(null)
  const [settings, setSettings] = useState<Settings | null>(null)

  const [libraryInfoSaving, setLibraryInfoSaving] = useState(false)
  const [libraryInfoError, setLibraryInfoError] = useState<string | null>(null)
  const [libraryInfoSuccess, setLibraryInfoSuccess] = useState(false)

  const [borrowingRulesSaving, setBorrowingRulesSaving] = useState(false)
  const [borrowingRulesError, setBorrowingRulesError] = useState<string | null>(
    null
  )
  const [borrowingRulesSuccess, setBorrowingRulesSuccess] = useState(false)

  const [notificationsSaving, setNotificationsSaving] = useState(false)
  const [notificationsError, setNotificationsError] = useState<string | null>(
    null
  )
  const [notificationsSuccess, setNotificationsSuccess] = useState(false)

  const libraryInfoForm = useForm<LibraryInfoFormValues>({
    resolver: zodResolver(libraryInfoFormSchema as never),
    defaultValues: {
      name: "",
      address: "",
      phone: "",
      email: "",
      website: "",
      logoUrl: "",
    },
  })

  const borrowingRulesForm = useForm<BorrowingRulesFormValues>({
    resolver: zodResolver(borrowingRulesFormSchema as never),
    defaultValues: {
      loanDurationDays: 14,
      maxRenewals: 2,
      maxActiveBookings: 5,
      finePerDay: 0.5,
      gracePeriodDays: 2,
    },
  })

  const notificationsForm = useForm<NotificationsFormValues>({
    resolver: zodResolver(notificationsFormSchema as never),
    defaultValues: {
      emailNotifications: true,
      smsNotifications: false,
      overdueReminders: true,
      newMemberWelcome: true,
      dueDateReminders: true,
    },
  })

  function populateForms(data: Settings): void {
    libraryInfoForm.reset({
      name: data.libraryInfo.name,
      address: data.libraryInfo.address,
      phone: data.libraryInfo.phone,
      email: data.libraryInfo.email,
      website: data.libraryInfo.website,
      logoUrl: data.libraryInfo.logoUrl,
    })
    borrowingRulesForm.reset({
      loanDurationDays: data.borrowingRules.loanDurationDays,
      maxRenewals: data.borrowingRules.maxRenewals,
      maxActiveBookings: data.borrowingRules.maxActiveBookings,
      finePerDay: data.borrowingRules.finePerDay,
      gracePeriodDays: data.borrowingRules.gracePeriodDays,
    })
    notificationsForm.reset({
      emailNotifications: data.notifications.emailNotifications,
      smsNotifications: data.notifications.smsNotifications,
      overdueReminders: data.notifications.overdueReminders,
      newMemberWelcome: data.notifications.newMemberWelcome,
      dueDateReminders: data.notifications.dueDateReminders,
    })
  }

  async function loadSettings(): Promise<void> {
    await Promise.resolve()
    setLoadStatus("loading")
    setLoadError(null)
    const result = await settingsUseCase.getSettings()
    if (!result.success) {
      setLoadStatus("error")
      setLoadError(result.error)
      return
    }
    setSettings(result.data)
    populateForms(result.data)
    setLoadStatus("success")
  }

  async function saveLibraryInfo(
    values: LibraryInfoFormValues
  ): Promise<void> {
    setLibraryInfoSaving(true)
    setLibraryInfoError(null)
    setLibraryInfoSuccess(false)
    const result = await settingsUseCase.updateLibraryInfo(values)
    if (!result.success) {
      setLibraryInfoSaving(false)
      setLibraryInfoError(result.error)
      return
    }
    setSettings(result.data)
    setLibraryInfoSaving(false)
    setLibraryInfoSuccess(true)
    setTimeout(() => setLibraryInfoSuccess(false), 3000)
  }

  async function saveBorrowingRules(
    values: BorrowingRulesFormValues
  ): Promise<void> {
    setBorrowingRulesSaving(true)
    setBorrowingRulesError(null)
    setBorrowingRulesSuccess(false)
    const result = await settingsUseCase.updateBorrowingRules(values)
    if (!result.success) {
      setBorrowingRulesSaving(false)
      setBorrowingRulesError(result.error)
      return
    }
    setSettings(result.data)
    setBorrowingRulesSaving(false)
    setBorrowingRulesSuccess(true)
    setTimeout(() => setBorrowingRulesSuccess(false), 3000)
  }

  async function saveNotifications(
    values: NotificationsFormValues
  ): Promise<void> {
    setNotificationsSaving(true)
    setNotificationsError(null)
    setNotificationsSuccess(false)
    const result = await settingsUseCase.updateNotifications(values)
    if (!result.success) {
      setNotificationsSaving(false)
      setNotificationsError(result.error)
      return
    }
    setSettings(result.data)
    setNotificationsSaving(false)
    setNotificationsSuccess(true)
    setTimeout(() => setNotificationsSuccess(false), 3000)
  }

  useEffect(() => {
    void loadSettings()
  }, [settingsUseCase])

  const state: SettingsViewModelState = {
    loadStatus,
    loadError,
    isLoading: loadStatus === "idle" || loadStatus === "loading",
    settings,
    libraryInfoSaving,
    libraryInfoError,
    libraryInfoSuccess,
    borrowingRulesSaving,
    borrowingRulesError,
    borrowingRulesSuccess,
    notificationsSaving,
    notificationsError,
    notificationsSuccess,
  }

  return {
    state,
    libraryInfoForm,
    borrowingRulesForm,
    notificationsForm,
    saveLibraryInfo,
    saveBorrowingRules,
    saveNotifications,
    reload: loadSettings,
  }
}
