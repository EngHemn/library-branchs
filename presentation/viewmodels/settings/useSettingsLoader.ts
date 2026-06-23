"use client"

import { useQuery } from "@tanstack/react-query"

import type { Settings } from "@/domain/entities/settings/Settings"
import type { SettingsUseCase } from "@/domain/usecases/settings/SettingsUseCase"

export type SettingsLoadStatus = "idle" | "loading" | "success" | "error"

export type SettingsLoaderResult = {
  settings: Settings | undefined
  loadStatus: SettingsLoadStatus
  loadError: string | null
  isLoading: boolean
  reload: () => Promise<void>
}

export function useSettingsLoader(
  settingsUseCase: SettingsUseCase
): SettingsLoaderResult {
  const {
    data: settings,
    isPending,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery<Settings>({
    queryKey: ["settings"],
    queryFn: async () => {
      const result = await settingsUseCase.getSettings()
      if (!result.success) throw new Error(result.error)
      return result.data
    },
  })

  const loadStatus: SettingsLoadStatus = (() => {
    if (isPending || isFetching) return "loading"
    if (isError) return "error"
    if (settings !== undefined) return "success"
    return "idle"
  })()

  async function reload(): Promise<void> {
    await refetch()
  }

  return {
    settings,
    loadStatus,
    loadError: isError && error instanceof Error ? error.message : null,
    isLoading: isPending || isFetching,
    reload,
  }
}
