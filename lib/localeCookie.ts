import {
  DEFAULT_LOCALE,
  isSupportedLocale,
  type SupportedLocale,
} from "@/domain/entities/locale/SupportedLocale"
import type { NextRequest } from "next/server"

export const LOCALE_COOKIE = "liba.locale"

const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30

export function readLocaleFromRequest(request: NextRequest): SupportedLocale {
  const value = request.cookies.get(LOCALE_COOKIE)?.value

  if (value && isSupportedLocale(value)) {
    return value
  }

  return DEFAULT_LOCALE
}

export function getLocaleFromCookie(): SupportedLocale {
  if (typeof document === "undefined") {
    return DEFAULT_LOCALE
  }

  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${LOCALE_COOKIE}=`))

  const value = match?.split("=")[1]

  if (value && isSupportedLocale(value)) {
    return value
  }

  return DEFAULT_LOCALE
}

export function setLocaleCookie(locale: SupportedLocale): void {
  if (typeof document === "undefined") {
    return
  }

  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=${COOKIE_MAX_AGE_SECONDS}; SameSite=Lax`
}

export function clearLocaleCookie(): void {
  if (typeof document === "undefined") {
    return
  }

  document.cookie = `${LOCALE_COOKIE}=; path=/; max-age=0; SameSite=Lax`
}
