import type { SupportedLocale } from "@/domain/entities/locale/SupportedLocale"
import type { TranslateParams } from "@/domain/i18n/TranslationKey"

import enCore from "@/presentation/i18n/locales/en.json"
import arCore from "@/presentation/i18n/locales/ar.json"
import kuCore from "@/presentation/i18n/locales/ku.json"
import { books, authors as authorsFeature, translators, categories } from "@/presentation/i18n/locales/features/library"
import { shelves } from "@/presentation/i18n/locales/features/shelves"
import { members, bookings, branches } from "@/presentation/i18n/locales/features/people"
import { staff, permissions, groups } from "@/presentation/i18n/locales/features/org"
import { stock, bills, orders, needs } from "@/presentation/i18n/locales/features/commerce"
import { sales, reports, activityLogs } from "@/presentation/i18n/locales/features/insights"
import { dashboard, notifications } from "@/presentation/i18n/locales/features/corePages"

const en = {
  ...enCore,
  authors: { ...enCore.authors, ...authorsFeature.en },
  books: books.en,
  translators: { ...enCore.translators, ...translators.en },
  categories: categories.en,
  shelves: shelves.en,
  members: members.en,
  bookings: bookings.en,
  branches: branches.en,
  staff: staff.en,
  permissions: permissions.en,
  groups: groups.en,
  stock: stock.en,
  bills: bills.en,
  orders: orders.en,
  needs: needs.en,
  sales: sales.en,
  reports: reports.en,
  activityLogs: activityLogs.en,
  dashboard: dashboard.en,
  notifications: notifications.en,
}

const ar = {
  ...arCore,
  authors: { ...arCore.authors, ...authorsFeature.ar },
  books: books.ar,
  translators: { ...arCore.translators, ...translators.ar },
  categories: categories.ar,
  shelves: shelves.ar,
  members: members.ar,
  bookings: bookings.ar,
  branches: branches.ar,
  staff: staff.ar,
  permissions: permissions.ar,
  groups: groups.ar,
  stock: stock.ar,
  bills: bills.ar,
  orders: orders.ar,
  needs: needs.ar,
  sales: sales.ar,
  reports: reports.ar,
  activityLogs: activityLogs.ar,
  dashboard: dashboard.ar,
  notifications: notifications.ar,
}

const ku = {
  ...kuCore,
  authors: { ...kuCore.authors, ...authorsFeature.ku },
  books: books.ku,
  translators: { ...kuCore.translators, ...translators.ku },
  categories: categories.ku,
  shelves: shelves.ku,
  members: members.ku,
  bookings: bookings.ku,
  branches: branches.ku,
  staff: staff.ku,
  permissions: permissions.ku,
  groups: groups.ku,
  stock: stock.ku,
  bills: bills.ku,
  orders: orders.ku,
  needs: needs.ku,
  sales: sales.ku,
  reports: reports.ku,
  activityLogs: activityLogs.ku,
  dashboard: dashboard.ku,
  notifications: notifications.ku,
}

type Messages = typeof en

type NestedKeys<T> = {
  [K in keyof T & string]: T[K] extends string
    ? K
    : `${K}.${NestedKeys<T[K]>}`
}[keyof T & string]

export type TranslationKey = NestedKeys<Messages>

const dictionaries: Record<SupportedLocale, Messages> = {
  en,
  ar: ar as Messages,
  ku: ku as Messages,
}

export function getMessages(locale: SupportedLocale): Messages {
  return dictionaries[locale]
}

type MessageTree = { [key: string]: string | MessageTree }

function resolveKey(messages: Messages, key: string): string {
  const segments = key.split(".")
  let current: string | MessageTree = messages as MessageTree

  for (const segment of segments) {
    if (typeof current === "string") {
      return key
    }
    const next: string | MessageTree | undefined = current[segment]
    if (next === undefined) {
      return key
    }
    current = next
  }

  return typeof current === "string" ? current : key
}

function applyParams(value: string, params?: TranslateParams): string {
  if (!params) {
    return value
  }

  return Object.keys(params).reduce(
    (result, paramKey) =>
      result.replaceAll(`{${paramKey}}`, String(params[paramKey])),
    value
  )
}

export function translate(
  locale: SupportedLocale,
  key: string,
  params?: TranslateParams
): string {
  const value = resolveKey(dictionaries[locale], key)
  return applyParams(value, params)
}
