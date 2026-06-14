"use client"

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"

import type { LocaleDirection } from "@/domain/entities/locale/LocaleDirection"
import {
  DEFAULT_LOCALE,
  type SupportedLocale,
} from "@/domain/entities/locale/SupportedLocale"
import { getLocaleDirection } from "@/domain/i18n/getLocaleDirection"
import type { TranslateParams } from "@/domain/i18n/TranslationKey"
import { DirectionProvider } from "@/components/ui/direction"
import { getLocaleFromCookie, setLocaleCookie } from "@/lib/localeCookie"
import { translate, type TranslationKey } from "@/presentation/i18n/messages"

type I18nContextValue = {
  locale: SupportedLocale
  direction: LocaleDirection
  isRtl: boolean
  setLocale: (locale: SupportedLocale) => void
  t: (key: TranslationKey, params?: TranslateParams) => string
}

export const I18nContext = createContext<I18nContextValue | null>(null)

function applyDocumentLocale(locale: SupportedLocale): void {
  if (typeof document === "undefined") {
    return
  }

  const direction = getLocaleDirection(locale)
  document.documentElement.lang = locale
  document.documentElement.dir = direction
}

type I18nProviderProps = {
  children: ReactNode
  initialLocale?: SupportedLocale
}

export function I18nProvider({
  children,
  initialLocale = DEFAULT_LOCALE,
}: I18nProviderProps) {
  const [locale, setLocaleState] = useState<SupportedLocale>(initialLocale)

  useEffect(() => {
    applyDocumentLocale(locale)
  }, [locale])

  const setLocale = useCallback((next: SupportedLocale) => {
    setLocaleCookie(next)
    setLocaleState(next)
    applyDocumentLocale(next)
  }, [])

  const direction = getLocaleDirection(locale)

  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      direction,
      isRtl: direction === "rtl",
      setLocale,
      t: (key, params) => translate(locale, key, params),
    }),
    [direction, locale, setLocale]
  )

  return (
    <I18nContext.Provider value={value}>
      <DirectionProvider dir={direction}>{children}</DirectionProvider>
    </I18nContext.Provider>
  )
}
