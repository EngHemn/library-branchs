function parseOrderDate(value: string): Date {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return new Date(`${value}T00:00:00`)
  }

  return new Date(value)
}

export function toOrderDateInputValue(value: string): string {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value
  }

  const date = parseOrderDate(value)
  if (Number.isNaN(date.getTime())) {
    return value
  }

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

export function toOrderDateTime(dateValue: string, existingDate?: string): string {
  if (/^\d{4}-\d{2}-\d{2}T/.test(dateValue)) {
    return dateValue
  }

  if (existingDate && /^\d{4}-\d{2}-\d{2}T(\d{2}:\d{2}:\d{2})/.test(existingDate)) {
    return `${dateValue}T${existingDate.split("T")[1]}`
  }

  const now = new Date()
  const hours = String(now.getHours()).padStart(2, "0")
  const minutes = String(now.getMinutes()).padStart(2, "0")
  const seconds = String(now.getSeconds()).padStart(2, "0")
  return `${dateValue}T${hours}:${minutes}:${seconds}`
}

export function orderDateSortValue(value: string): number {
  const date = parseOrderDate(value)
  return Number.isNaN(date.getTime()) ? 0 : date.getTime()
}

export function formatOrderDate(value: string): string {
  const date = parseOrderDate(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export function formatOrderTime(value: string): string {
  const date = parseOrderDate(value)

  if (Number.isNaN(date.getTime())) {
    return "—"
  }

  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function formatOrderPriceInDinar(price: number): string {
  const formatted = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(price)
  return `${formatted} IQD`
}

export function formatBookQuantity(count: number): string {
  return `${count.toLocaleString()} ${count === 1 ? "book" : "books"}`
}

export function normalizeCoordinate(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null
}

export function hasValidMapCoordinates(
  latitude: unknown,
  longitude: unknown
): boolean {
  return (
    normalizeCoordinate(latitude) !== null &&
    normalizeCoordinate(longitude) !== null
  )
}

export function getOrderMapHref(latitude: number, longitude: number): string {
  return `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=15/${latitude}/${longitude}`
}
