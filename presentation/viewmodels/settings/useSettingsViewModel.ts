"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { UseFormReturn } from "react-hook-form"

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
import { useSettingsLoader, type SettingsLoadStatus } from "./useSettingsLoader"

type SettingsViewModelState = {
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

export function useSettingsViewModel(settingsUseCase: SettingsUseCase): SettingsViewModel {
  const queryClient = useQueryClient()
  const { settings, loadStatus, loadError, isLoading, reload } = useSettingsLoader(settingsUseCase)

  const [libraryInfoSuccess, setLibraryInfoSuccess] = useState(false)
  const [borrowingRulesSuccess, setBorrowingRulesSuccess] = useState(false)
  const [notificationsSuccess, setNotificationsSuccess] = useState(false)

  const libraryInfoForm = useForm<LibraryInfoFormValues>({
    resolver: zodResolver(libraryInfoFormSchema),
    defaultValues: { name: "", address: "", phone: "", email: "", website: "", logoUrl: "" },
  })

  const borrowingRulesForm = useForm<BorrowingRulesFormValues>({
    resolver: zodResolver(borrowingRulesFormSchema),
    defaultValues: {
      loanDurationDays: 14,
      maxRenewals: 2,
      maxActiveBookings: 5,
      finePerDay: 0.5,
      gracePeriodDays: 2,
    },
  })

  const notificationsForm = useForm<NotificationsFormValues>({
    resolver: zodResolver(notificationsFormSchema),
    defaultValues: {
      emailNotifications: true,
      smsNotifications: false,
      overdueReminders: true,
      newMemberWelcome: true,
      dueDateReminders: true,
    },
  })

  useEffect(() => {
    if (!settings) return
    libraryInfoForm.reset({
      name: settings.libraryInfo.name,
      address: settings.libraryInfo.address,
      phone: settings.libraryInfo.phone,
      email: settings.libraryInfo.email,
      website: settings.libraryInfo.website,
      logoUrl: settings.libraryInfo.logoUrl,
    })
    borrowingRulesForm.reset({
      loanDurationDays: settings.borrowingRules.loanDurationDays,
      maxRenewals: settings.borrowingRules.maxRenewals,
      maxActiveBookings: settings.borrowingRules.maxActiveBookings,
      finePerDay: settings.borrowingRules.finePerDay,
      gracePeriodDays: settings.borrowingRules.gracePeriodDays,
    })
    notificationsForm.reset({
      emailNotifications: settings.notifications.emailNotifications,
      smsNotifications: settings.notifications.smsNotifications,
      overdueReminders: settings.notifications.overdueReminders,
      newMemberWelcome: settings.notifications.newMemberWelcome,
      dueDateReminders: settings.notifications.dueDateReminders,
    })
  }, [settings])

  const {
    mutate: saveLibraryInfoMutation,
    isPending: libraryInfoSaving,
    isError: libraryInfoIsError,
    error: libraryInfoMutError,
  } = useMutation({
    mutationFn: async (values: LibraryInfoFormValues) => {
      const result = await settingsUseCase.updateLibraryInfo(values)
      if (!result.success) throw new Error(result.error)
      return result.data
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["settings"] })
      setLibraryInfoSuccess(true)
      setTimeout(() => setLibraryInfoSuccess(false), 3000)
    },
  })

  const {
    mutate: saveBorrowingRulesMutation,
    isPending: borrowingRulesSaving,
    isError: borrowingRulesIsError,
    error: borrowingRulesMutError,
  } = useMutation({
    mutationFn: async (values: BorrowingRulesFormValues) => {
      const result = await settingsUseCase.updateBorrowingRules(values)
      if (!result.success) throw new Error(result.error)
      return result.data
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["settings"] })
      setBorrowingRulesSuccess(true)
      setTimeout(() => setBorrowingRulesSuccess(false), 3000)
    },
  })

  const {
    mutate: saveNotificationsMutation,
    isPending: notificationsSaving,
    isError: notificationsIsError,
    error: notificationsMutError,
  } = useMutation({
    mutationFn: async (values: NotificationsFormValues) => {
      const result = await settingsUseCase.updateNotifications(values)
      if (!result.success) throw new Error(result.error)
      return result.data
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["settings"] })
      setNotificationsSuccess(true)
      setTimeout(() => setNotificationsSuccess(false), 3000)
    },
  })

  async function saveLibraryInfo(values: LibraryInfoFormValues): Promise<void> {
    saveLibraryInfoMutation(values)
  }

  async function saveBorrowingRules(values: BorrowingRulesFormValues): Promise<void> {
    saveBorrowingRulesMutation(values)
  }

  async function saveNotifications(values: NotificationsFormValues): Promise<void> {
    saveNotificationsMutation(values)
  }

  const state: SettingsViewModelState = {
    loadStatus,
    loadError,
    isLoading,
    settings: settings ?? null,
    libraryInfoSaving,
    libraryInfoError:
      libraryInfoIsError && libraryInfoMutError instanceof Error
        ? libraryInfoMutError.message
        : null,
    libraryInfoSuccess,
    borrowingRulesSaving,
    borrowingRulesError:
      borrowingRulesIsError && borrowingRulesMutError instanceof Error
        ? borrowingRulesMutError.message
        : null,
    borrowingRulesSuccess,
    notificationsSaving,
    notificationsError:
      notificationsIsError && notificationsMutError instanceof Error
        ? notificationsMutError.message
        : null,
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
    reload,
  }
}
