"use client"

import { useContext } from "react"

import type { TranslateParams } from "@/domain/i18n/TranslationKey"
import { I18nContext } from "@/presentation/i18n/I18nProvider"
import type { TranslationKey } from "@/presentation/i18n/messages"

export function useTranslation(): {
  t: (key: TranslationKey, params?: TranslateParams) => string
} {
  const ctx = useContext(I18nContext)

  if (!ctx) {
    throw new Error("useTranslation must be used within an I18nProvider")
  }

  return { t: ctx.t }
}
