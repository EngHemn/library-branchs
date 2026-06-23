import type { CartItem } from "@/domain/entities/sales/CartItem"
import type { SaleBook } from "@/domain/entities/sales/SaleBook"

const SALES_CART_STORAGE_PREFIX = "liba.sales.cart"

export type StoredSalesCart = {
  cart: CartItem[]
  shoppingBranchId: string | null
  displayedBranchId: string | null
}

type StoredCartItemShape = {
  book: SaleBook
  quantity: number
}

type StoredSalesCartShape = {
  cart: StoredCartItemShape[]
  shoppingBranchId: string | null
  displayedBranchId: string | null
}

function isSaleBook(
  value: Record<string, string | number | null>
): value is SaleBook {
  return (
    typeof value.id === "string" &&
    typeof value.title === "string" &&
    (value.coverUrl === null || typeof value.coverUrl === "string") &&
    typeof value.author === "string" &&
    typeof value.category === "string" &&
    typeof value.language === "string" &&
    typeof value.price === "number" &&
    typeof value.discount === "number" &&
    typeof value.stock === "number" &&
    typeof value.branchId === "string"
  )
}

function isStoredCartItem(value: unknown): value is StoredCartItemShape {
  if (typeof value !== "object" || value === null) {
    return false
  }

  const record = value as Record<string, unknown>
  const book = record.book

  return (
    typeof book === "object" &&
    book !== null &&
    isSaleBook(book as Record<string, string | number | null>) &&
    typeof record.quantity === "number" &&
    record.quantity > 0
  )
}

function isStoredSalesCart(value: unknown): value is StoredSalesCartShape {
  if (typeof value !== "object" || value === null) {
    return false
  }

  const record = value as Record<string, unknown>

  if (!Array.isArray(record.cart)) {
    return false
  }

  const shoppingBranchId = record.shoppingBranchId
  const displayedBranchId = record.displayedBranchId

  if (shoppingBranchId !== null && typeof shoppingBranchId !== "string") {
    return false
  }

  if (displayedBranchId !== null && typeof displayedBranchId !== "string") {
    return false
  }

  return record.cart.every((item) => isStoredCartItem(item))
}

function getStorageKey(userId: string): string {
  return `${SALES_CART_STORAGE_PREFIX}.${userId}`
}

export function readStoredSalesCart(userId: string): StoredSalesCart {
  if (typeof window === "undefined") {
    return { cart: [], shoppingBranchId: null, displayedBranchId: null }
  }

  const raw = window.localStorage.getItem(getStorageKey(userId))

  if (!raw) {
    return { cart: [], shoppingBranchId: null, displayedBranchId: null }
  }

  try {
    const parsed: unknown = JSON.parse(raw)

    if (!isStoredSalesCart(parsed)) {
      return { cart: [], shoppingBranchId: null, displayedBranchId: null }
    }

    return {
      cart: parsed.cart.map((item) => ({
        book: { ...item.book },
        quantity: item.quantity,
      })),
      shoppingBranchId: parsed.shoppingBranchId,
      displayedBranchId: parsed.displayedBranchId,
    }
  } catch {
    return { cart: [], shoppingBranchId: null, displayedBranchId: null }
  }
}

export function writeStoredSalesCart(
  userId: string,
  cartState: StoredSalesCart
): void {
  if (typeof window === "undefined") {
    return
  }

  window.localStorage.setItem(getStorageKey(userId), JSON.stringify(cartState))
}

export function clearStoredSalesCart(userId: string): void {
  if (typeof window === "undefined") {
    return
  }

  window.localStorage.removeItem(getStorageKey(userId))
}
