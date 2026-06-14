export type SupportedLocale = "en" | "ar" | "ku"

export const SUPPORTED_LOCALES: readonly SupportedLocale[] = ["en", "ar", "ku"]

export const DEFAULT_LOCALE: SupportedLocale = "en"

export function isSupportedLocale(value: string): value is SupportedLocale {
  return value === "en" || value === "ar" || value === "ku"
}
