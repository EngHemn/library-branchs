import type { LocaleDirection } from "@/domain/entities/locale/LocaleDirection"
import type { SupportedLocale } from "@/domain/entities/locale/SupportedLocale"

export function getLocaleDirection(locale: SupportedLocale): LocaleDirection {
  if (locale === "ar" || locale === "ku") {
    return "rtl"
  }

  return "ltr"
}
