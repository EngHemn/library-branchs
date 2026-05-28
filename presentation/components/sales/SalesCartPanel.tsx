"use client"

import {
  CheckCircleIcon,
  MinusIcon,
  PlusIcon,
  ShoppingCartIcon,
  TagIcon,
  TrashIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"
import type { Branch } from "@/domain/entities/branch/Branch"
import type { CartItem } from "@/domain/entities/sales/CartItem"
import type { Sale } from "@/domain/entities/sales/Sale"

type SalesCartPanelProps = {
  cart: CartItem[]
  subtotal: number
  discountAmount: number
  total: number
  shoppingBranch: Branch | null
  isPlacingSale: boolean
  saleResult: Sale | null
  saleError: string | null
  onRemoveFromCart: (bookId: string) => void
  onUpdateQuantity: (bookId: string, qty: number) => void
  onClearCart: () => void
  onPlaceSale: () => void
  onResetSale: () => void
}

function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`
}

function EmptyCart() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
      <div className="rounded-full bg-muted p-3">
        <ShoppingCartIcon className="size-8 text-muted-foreground/50" />
      </div>
      <div>
        <p className="text-sm font-medium">Cart is empty</p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Select a branch and add books to get started.
        </p>
      </div>
    </div>
  )
}

function SaleSuccess({ sale, onReset }: { sale: Sale; onReset: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
      <div className="rounded-full bg-emerald-100 p-3 dark:bg-emerald-900/30">
        <CheckCircleIcon className="size-10 text-emerald-600 dark:text-emerald-400" />
      </div>
      <div>
        <p className="text-base font-semibold">Sale complete!</p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {sale.id} · {sale.branchName}
        </p>
        <p className="mt-2 text-lg font-bold text-emerald-600">
          {formatPrice(sale.total)}
        </p>
        <p className="text-xs text-muted-foreground">
          {sale.items.reduce((s, i) => s + i.quantity, 0)} items ·{" "}
          {new Date(sale.createdAt).toLocaleTimeString()}
        </p>
      </div>
      <Button variant="outline" size="sm" onClick={onReset}>
        New Sale
      </Button>
    </div>
  )
}

export function SalesCartPanel({
  cart,
  subtotal,
  discountAmount,
  total,
  shoppingBranch,
  isPlacingSale,
  saleResult,
  saleError,
  onRemoveFromCart,
  onUpdateQuantity,
  onClearCart,
  onPlaceSale,
  onResetSale,
}: SalesCartPanelProps) {
  if (saleResult) {
    return <SaleSuccess sale={saleResult} onReset={onResetSale} />
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex items-center justify-between border-b p-4">
        <div className="flex items-center gap-2">
          <ShoppingCartIcon className="size-4" />
          <span className="text-sm font-semibold">Cart</span>
          {cart.length > 0 && (
            <Badge variant="secondary" className="h-5 px-1.5 text-xs">
              {cart.reduce((s, i) => s + i.quantity, 0)}
            </Badge>
          )}
        </div>
        {cart.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 gap-1 px-2 text-xs text-muted-foreground"
            onClick={onClearCart}
          >
            <TrashIcon className="size-3.5" />
            Clear
          </Button>
        )}
      </div>

      {shoppingBranch && (
        <div className="border-b px-4 py-2">
          <p className="truncate text-[11px] text-muted-foreground">
            Shopping from:{" "}
            <span className="font-medium text-foreground">
              {shoppingBranch.branchName}
            </span>
          </p>
        </div>
      )}

      {cart.length === 0 ? (
        <EmptyCart />
      ) : (
        <div className="flex flex-1 flex-col overflow-y-auto">
          <div className="flex flex-col divide-y">
            {cart.map((item) => {
              const discountedPrice =
                item.book.price * (1 - item.book.discount / 100)
              const itemTotal = discountedPrice * item.quantity

              return (
                <div key={item.book.id} className="flex flex-col gap-2 p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-xs font-medium leading-tight">
                        {item.book.title}
                      </p>
                      <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
                        {item.book.author}
                      </p>
                      {item.book.discount > 0 && (
                        <div className="mt-0.5 flex items-center gap-1">
                          <TagIcon className="size-2.5 text-red-500" />
                          <span className="text-[10px] text-red-500">
                            {item.book.discount}% off
                          </span>
                        </div>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-6 shrink-0 text-muted-foreground hover:text-destructive"
                      onClick={() => onRemoveFromCart(item.book.id)}
                    >
                      <TrashIcon className="size-3" />
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 rounded-md border">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-6 rounded-r-none"
                        onClick={() =>
                          onUpdateQuantity(item.book.id, item.quantity - 1)
                        }
                      >
                        <MinusIcon className="size-3" />
                      </Button>
                      <span className="min-w-[1.5rem] text-center text-xs font-medium">
                        {item.quantity}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-6 rounded-l-none"
                        onClick={() =>
                          onUpdateQuantity(item.book.id, item.quantity + 1)
                        }
                        disabled={item.quantity >= item.book.stock}
                      >
                        <PlusIcon className="size-3" />
                      </Button>
                    </div>
                    <span className="text-sm font-semibold">
                      {formatPrice(itemTotal)}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-auto border-t p-4">
            <div className="flex flex-col gap-1.5 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-red-500">
                  <span className="flex items-center gap-1">
                    <TagIcon className="size-3" />
                    Discount saved
                  </span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}
              <Separator className="my-1" />
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            {saleError && (
              <p className="mt-2 text-xs text-destructive">{saleError}</p>
            )}

            <Button
              className="mt-3 w-full gap-2"
              onClick={onPlaceSale}
              disabled={isPlacingSale || cart.length === 0}
            >
              {isPlacingSale ? (
                <>
                  <Spinner className="size-4" />
                  Processing…
                </>
              ) : (
                <>
                  <CheckCircleIcon className="size-4" />
                  Complete Sale
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
