function parseBillDate(value: string): Date {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return new Date(`${value}T00:00:00`)
  }

  return new Date(value)
}

export function toBillDateInputValue(value: string): string {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value
  }

  const date = parseBillDate(value)
  if (Number.isNaN(date.getTime())) {
    return value
  }

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

export function toBillDateTime(dateValue: string, existingBillDate?: string): string {
  if (/^\d{4}-\d{2}-\d{2}T/.test(dateValue)) {
    return dateValue
  }

  if (
    existingBillDate &&
    /^\d{4}-\d{2}-\d{2}T(\d{2}:\d{2}:\d{2})/.test(existingBillDate)
  ) {
    return `${dateValue}T${existingBillDate.split("T")[1]}`
  }

  const now = new Date()
  const hours = String(now.getHours()).padStart(2, "0")
  const minutes = String(now.getMinutes()).padStart(2, "0")
  const seconds = String(now.getSeconds()).padStart(2, "0")
  return `${dateValue}T${hours}:${minutes}:${seconds}`
}

export function billDateSortValue(value: string): number {
  const date = parseBillDate(value)
  return Number.isNaN(date.getTime()) ? 0 : date.getTime()
}

export function formatBillDate(value: string, locale = "en"): string {
  const date = parseBillDate(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return date.toLocaleDateString(locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export function formatBillTime(value: string, locale = "en"): string {
  const date = parseBillDate(value)

  if (Number.isNaN(date.getTime())) {
    return "—"
  }

  return date.toLocaleTimeString(locale, {
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function formatBillPrice(price: number, locale = "en"): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "USD",
  }).format(price)
}
