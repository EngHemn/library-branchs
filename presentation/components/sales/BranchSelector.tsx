"use client"

import { useState } from "react"
import {
  BookOpenIcon,
  BuildingIcon,
  ChevronDownIcon,
  ShoppingCartIcon,
  StoreIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import type { TranslationKey } from "@/presentation/i18n/messages"
import { useTranslation } from "@/presentation/i18n/useTranslation"
import type { BranchNode } from "@/presentation/viewmodels/sales/useSalesViewModel"

type BranchSelectorProps = {
  branchNodes: BranchNode[]
  shoppingBranchId: string | null
  displayedBranchId: string | null
  isLoading: boolean
  error: string | null
  cartItemCount: number
  onViewBooks: (branchId: string) => void
  onRequestShopFromBranch: (branchId: string) => void
}

type BranchItemProps = {
  id: string
  name: string
  bookCount: number
  status: "active" | "inactive"
  isShoppingBranch: boolean
  isDisplayedBranch: boolean
  cartItemCount: number
  isSub?: boolean
  onViewBooks: () => void
  onRequestShopFromBranch: () => void
}

function BranchItem({
  name,
  bookCount,
  status,
  isShoppingBranch,
  isDisplayedBranch,
  cartItemCount,
  isSub = false,
  onViewBooks,
  onRequestShopFromBranch,
}: BranchItemProps) {
  const { t } = useTranslation()
  const statusKey: TranslationKey =
    status === "active" ? "common.active" : "common.inactive"

  return (
    <div
      className={cn(
        "flex flex-col gap-2 rounded-lg border p-3 transition-colors",
        isShoppingBranch &&
          "border-primary/40 bg-primary/5 ring-1 ring-primary/20",
        isDisplayedBranch &&
          !isShoppingBranch &&
          "border-muted-foreground/25 bg-muted/50",
        !isShoppingBranch &&
          !isDisplayedBranch &&
          "border-border hover:bg-muted/30"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 flex-1 items-start gap-2">
          {isSub ? (
            <StoreIcon className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
          ) : (
            <BuildingIcon className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
          )}
          <div className="min-w-0">
            <p
              className={cn(
                "truncate text-sm leading-tight font-medium",
                isShoppingBranch && "text-primary"
              )}
            >
              {name}
            </p>
            <div className="mt-1 flex flex-wrap items-center gap-1">
              <Badge
                variant={status === "active" ? "default" : "secondary"}
                className="h-4 px-1.5 text-[10px]"
              >
                {t(statusKey)}
              </Badge>
              <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
                <BookOpenIcon className="size-2.5" />
                {bookCount.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {isShoppingBranch && (
          <Badge
            variant="outline"
            className="shrink-0 gap-1 border-primary/30 text-[10px] text-primary"
          >
            <ShoppingCartIcon className="size-2.5" />
            {cartItemCount > 0 ? cartItemCount : t("sales.branches.active")}
          </Badge>
        )}
      </div>

      <div className="flex gap-1.5">
        <Button
          variant={
            isDisplayedBranch && !isShoppingBranch ? "secondary" : "outline"
          }
          size="sm"
          className="h-7 flex-1 px-2 text-xs"
          onClick={onViewBooks}
        >
          {t("sales.branches.viewBooks")}
        </Button>

        {!isShoppingBranch && (
          <Button
            variant="default"
            size="sm"
            className="h-7 flex-1 px-2 text-xs"
            onClick={onRequestShopFromBranch}
          >
            <ShoppingCartIcon className="size-3" />
            {t("sales.branches.shopHere")}
          </Button>
        )}
      </div>
    </div>
  )
}

type MainBranchGroupProps = {
  node: BranchNode
  shoppingBranchId: string | null
  displayedBranchId: string | null
  cartItemCount: number
  onViewBooks: (id: string) => void
  onRequestShopFromBranch: (id: string) => void
}

function MainBranchGroup({
  node,
  shoppingBranchId,
  displayedBranchId,
  cartItemCount,
  onViewBooks,
  onRequestShopFromBranch,
}: MainBranchGroupProps) {
  const { t } = useTranslation()
  const { branch, subBranches } = node
  const [open, setOpen] = useState(true)
  const subBranchLabel =
    subBranches.length === 1
      ? t("sales.branches.subBranchCount", { count: subBranches.length })
      : t("sales.branches.subBranchCountPlural", { count: subBranches.length })

  return (
    <div className="flex flex-col gap-1.5">
      <BranchItem
        id={branch.id}
        name={branch.branchName}
        bookCount={branch.bookCount}
        status={branch.status}
        isShoppingBranch={shoppingBranchId === branch.id}
        isDisplayedBranch={displayedBranchId === branch.id}
        cartItemCount={cartItemCount}
        onViewBooks={() => onViewBooks(branch.id)}
        onRequestShopFromBranch={() => onRequestShopFromBranch(branch.id)}
      />

      {subBranches.length > 0 && (
        <Collapsible open={open} onOpenChange={setOpen}>
          <CollapsibleTrigger asChild>
            <button
              type="button"
              className="flex w-full items-center gap-1 pl-2 text-[11px] text-muted-foreground transition-colors hover:text-foreground"
            >
              <ChevronDownIcon
                className={cn(
                  "size-3 transition-transform duration-200",
                  !open && "-rotate-90"
                )}
              />
              {subBranchLabel}
            </button>
          </CollapsibleTrigger>

          <CollapsibleContent className="ml-2 flex flex-col gap-1.5 border-l pt-1.5 pl-3">
            {subBranches.map((sub) => (
              <BranchItem
                key={sub.id}
                id={sub.id}
                name={sub.branchName}
                bookCount={sub.bookCount}
                status={sub.status}
                isShoppingBranch={shoppingBranchId === sub.id}
                isDisplayedBranch={displayedBranchId === sub.id}
                cartItemCount={cartItemCount}
                isSub
                onViewBooks={() => onViewBooks(sub.id)}
                onRequestShopFromBranch={() => onRequestShopFromBranch(sub.id)}
              />
            ))}
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  )
}

export function BranchSelector({
  branchNodes,
  shoppingBranchId,
  displayedBranchId,
  isLoading,
  error,
  cartItemCount,
  onViewBooks,
  onRequestShopFromBranch,
}: BranchSelectorProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-2 p-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-20 rounded-lg" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-2 p-4 text-center">
        <BuildingIcon className="size-8 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">{error}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3 p-3">
      {branchNodes.map((node) => (
        <MainBranchGroup
          key={node.branch.id}
          node={node}
          shoppingBranchId={shoppingBranchId}
          displayedBranchId={displayedBranchId}
          cartItemCount={cartItemCount}
          onViewBooks={onViewBooks}
          onRequestShopFromBranch={onRequestShopFromBranch}
        />
      ))}
    </div>
  )
}
