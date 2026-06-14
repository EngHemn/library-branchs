"use client"

import { useContext } from "react"

import type { LocaleDirection } from "@/domain/entities/locale/LocaleDirection"
import type { SupportedLocale } from "@/domain/entities/locale/SupportedLocale"
import { useDirection } from "@/components/ui/direction"
import { I18nContext } from "@/presentation/i18n/I18nProvider"

export { useDirection }

export function useLocale(): {
  locale: SupportedLocale
  setLocale: (locale: SupportedLocale) => void
  direction: LocaleDirection
  isRtl: boolean
} {
  const ctx = useContext(I18nContext)

  if (!ctx) {
    throw new Error("useLocale must be used within an I18nProvider")
  }

  return {
    locale: ctx.locale,
    setLocale: ctx.setLocale,
    direction: ctx.direction,
    isRtl: ctx.isRtl,
  }
}
