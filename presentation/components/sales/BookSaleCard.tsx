"use client"

import { useState, type MouseEvent } from "react"
import {
  BookOpenIcon,
  MinusIcon,
  PlusIcon,
  ShoppingCartIcon,
  TagIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { EntityImage } from "@/components/ui/entity-image"
import type { SaleBook } from "@/domain/entities/sales/SaleBook"
import { useTranslation } from "@/presentation/i18n/useTranslation"

type BookSaleCardProps = {
  book: SaleBook
  cartQuantity: number
  isShoppingBranch: boolean
  onAdd: () => void
  onUpdateQuantity: (qty: number) => void
}

function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`
}

function discountedPrice(price: number, discount: number): number {
  return price * (1 - discount / 100)
}

type CartQuantityOverlayProps = {
  quantity: number
  canAddMore: boolean
  onUpdateQuantity: (qty: number) => void
  className?: string
  stopPropagation?: boolean
}

function CartQuantityOverlay({
  quantity,
  canAddMore,
  onUpdateQuantity,
  className,
  stopPropagation = false,
}: CartQuantityOverlayProps) {
  const handleClick = (event: MouseEvent) => {
    if (stopPropagation) {
      event.stopPropagation()
    }
  }

  return (
    <div
      className={cn(
        "absolute left-2 top-2 flex items-center gap-0.5 rounded-lg border bg-background/95 px-0.5 shadow-sm backdrop-blur-sm",
        className
      )}
      onClick={handleClick}
    >
      <Button
        variant="ghost"
        size="icon"
        className="size-7"
        onClick={(event) => {
          if (stopPropagation) event.stopPropagation()
          onUpdateQuantity(quantity - 1)
        }}
      >
        <MinusIcon className="size-3.5" />
      </Button>
      <span className="min-w-6 text-center text-xs font-semibold">
        {quantity}
      </span>
      <Button
        variant="ghost"
        size="icon"
        className="size-7"
        disabled={!canAddMore}
        onClick={(event) => {
          if (stopPropagation) event.stopPropagation()
          onUpdateQuantity(quantity + 1)
        }}
      >
        <PlusIcon className="size-3.5" />
      </Button>
    </div>
  )
}

type BookDetailDialogProps = {
  book: SaleBook
  cartQuantity: number
  isShoppingBranch: boolean
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: () => void
  onUpdateQuantity: (qty: number) => void
}

function BookDetailDialog({
  book,
  cartQuantity,
  isShoppingBranch,
  open,
  onOpenChange,
  onAdd,
  onUpdateQuantity,
}: BookDetailDialogProps) {
  const { t } = useTranslation()
  const hasDiscount = book.discount > 0
  const finalPrice = discountedPrice(book.price, book.discount)
  const isOutOfStock = book.stock === 0
  const canAddMore = cartQuantity < book.stock

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm gap-0 overflow-hidden p-0">
        <div className="relative h-48 w-full">
          <EntityImage
            src={book.coverUrl}
            alt={book.title}
            fill
            sizes="(max-width: 640px) 100vw, 384px"
            className="size-full bg-muted/50"
            imageClassName="object-cover"
            fallback={<BookOpenIcon className="size-16 text-muted-foreground/25" />}
          />

          {hasDiscount ? (
            <Badge className="absolute right-3 top-3 bg-red-500 text-white hover:bg-red-500">
              -{book.discount}%
            </Badge>
          ) : null}

          {cartQuantity > 0 ? (
            <CartQuantityOverlay
              quantity={cartQuantity}
              canAddMore={canAddMore}
              onUpdateQuantity={onUpdateQuantity}
              className="left-3 top-3"
            />
          ) : null}
        </div>

        <div className="flex flex-col gap-4 p-5">
          <DialogHeader className="gap-1 space-y-0">
            <DialogTitle className="text-base leading-tight">
              {book.title}
            </DialogTitle>
            <p className="text-sm text-muted-foreground">{book.author}</p>
          </DialogHeader>

          <div className="flex flex-wrap gap-1.5">
            <Badge variant="secondary">{book.category}</Badge>
            <Badge variant="outline">{book.language}</Badge>
          </div>

          <div className="flex flex-col gap-1.5 rounded-lg bg-muted/40 px-4 py-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">{t("sales.books.stock")}</span>
              <span
                className={cn(
                  "font-medium",
                  isOutOfStock
                    ? "text-red-500"
                    : book.stock <= 3
                      ? "text-red-500"
                      : book.stock <= 8
                        ? "text-amber-600"
                        : "text-emerald-600"
                )}
              >
                {isOutOfStock
                  ? t("sales.books.outOfStock")
                  : t("sales.books.available", { count: book.stock })}
              </span>
            </div>

            <Separator />

            {hasDiscount ? (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">{t("sales.books.originalPrice")}</span>
                  <span className="text-muted-foreground line-through">
                    {formatPrice(book.price)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1 text-red-500">
                    <TagIcon className="size-3.5" />
                    {t("sales.books.discount")}
                  </span>
                  <span className="text-red-500">-{book.discount}%</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between font-semibold">
                  <span>{t("sales.books.finalPrice")}</span>
                  <span className="text-lg text-primary">
                    {formatPrice(finalPrice)}
                  </span>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-between font-semibold">
                <span>{t("sales.books.price")}</span>
                <span className="text-lg">{formatPrice(book.price)}</span>
              </div>
            )}
          </div>

          {!isShoppingBranch ? (
            <p className="text-center text-xs text-muted-foreground">
              {t("sales.books.switchBranchHint")}
            </p>
          ) : isOutOfStock ? (
            <Button disabled className="w-full">
              {t("sales.books.outOfStock")}
            </Button>
          ) : cartQuantity === 0 ? (
            <Button className="w-full gap-2" onClick={onAdd}>
              <ShoppingCartIcon className="size-4" />
              {t("sales.books.addToCart")}
            </Button>
          ) : (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => onOpenChange(false)}
            >
              {t("common.close")}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function BookSaleCard({
  book,
  cartQuantity,
  isShoppingBranch,
  onAdd,
  onUpdateQuantity,
}: BookSaleCardProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const hasDiscount = book.discount > 0
  const finalPrice = discountedPrice(book.price, book.discount)

  return (
    <>
      <Card
        role="button"
        tabIndex={0}
        className={cn(
          "flex cursor-pointer flex-col overflow-hidden pt-0 transition-all hover:shadow-md hover:ring-1 hover:ring-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          cartQuantity > 0 && "ring-2 ring-primary/30",
          book.stock === 0 && "opacity-60"
        )}
        onClick={() => setDialogOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            setDialogOpen(true)
          }
        }}
      >
        <div className="relative h-40 w-full">
          <EntityImage
            src={book.coverUrl}
            alt={book.title}
            fill
            sizes="(max-width: 640px) 50vw, 240px"
            className="size-full bg-muted/40"
            imageClassName="object-cover"
            fallback={<BookOpenIcon className="size-12 text-muted-foreground/25" />}
          />

          {hasDiscount ? (
            <Badge className="absolute right-2 top-2 bg-red-500 text-white hover:bg-red-500">
              -{book.discount}%
            </Badge>
          ) : null}

          {cartQuantity > 0 ? (
            <CartQuantityOverlay
              quantity={cartQuantity}
              canAddMore={cartQuantity < book.stock}
              onUpdateQuantity={onUpdateQuantity}
              stopPropagation
            />
          ) : null}
        </div>

        <div className="flex flex-col gap-1.5 p-3">
          <p className="line-clamp-2 text-sm font-semibold leading-tight">
            {book.title}
          </p>

          <div className="flex items-baseline gap-1.5">
            {hasDiscount ? (
              <>
                <span className="text-sm font-bold text-primary">
                  {formatPrice(finalPrice)}
                </span>
                <span className="text-xs text-muted-foreground line-through">
                  {formatPrice(book.price)}
                </span>
              </>
            ) : (
              <span className="text-sm font-bold">{formatPrice(book.price)}</span>
            )}
          </div>
        </div>
      </Card>

      <BookDetailDialog
        book={book}
        cartQuantity={cartQuantity}
        isShoppingBranch={isShoppingBranch}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onAdd={onAdd}
        onUpdateQuantity={onUpdateQuantity}
      />
    </>
  )
}
