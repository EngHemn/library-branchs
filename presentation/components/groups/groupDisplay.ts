import type { BookStatus } from "@/domain/entities/book/Book"

export function formatGroupDate(isoDate: string, locale = "en"): string {
  const date = new Date(isoDate)

  if (Number.isNaN(date.getTime())) {
    return isoDate
  }

  return date.toLocaleDateString(locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export function formatGroupDateTime(isoDate: string, locale = "en"): string {
  const date = new Date(isoDate)

  if (Number.isNaN(date.getTime())) {
    return isoDate
  }

  return date.toLocaleString(locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })
}

export function formatGroupBookPrice(price: number, locale = "en"): string {
  const formatted = new Intl.NumberFormat(locale, {
    maximumFractionDigits: 0,
  }).format(price)
  return `${formatted} IQD`
}

export const groupBookStatusVariants: Record<
  BookStatus,
  "default" | "secondary" | "outline" | "destructive"
> = {
  available: "default",
  borrowed: "secondary",
  reserved: "outline",
  unavailable: "destructive",
}
