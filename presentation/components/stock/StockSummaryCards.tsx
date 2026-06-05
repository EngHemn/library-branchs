import {
  AlertTriangleIcon,
  BoxesIcon,
  BookOpenIcon,
  PackageIcon,
  ShoppingCartIcon,
  StarIcon,
  Trash2Icon,
  XIcon,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import type { StockSummary } from "@/domain/entities/stock/Stock"

type StockSummaryCardsProps = {
  summary: StockSummary | null
  isLoading: boolean
}

type CardItem = {
  label: string
  value: number
  icon: React.ElementType
  className: string
}

function SummaryCardSkeleton() {
  return (
    <Card className="flex flex-row items-center gap-4 rounded-lg p-4 shadow-sm">
      <Skeleton className="h-10 w-10 rounded-full" />
      <div className="flex flex-col gap-1">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-6 w-12" />
      </div>
    </Card>
  )
}

export function StockSummaryCards({
  summary,
  isLoading,
}: StockSummaryCardsProps) {
  const cards: CardItem[] = [
    {
      label: "Available",
      value: summary?.totalAvailable ?? 0,
      icon: BoxesIcon,
      className: "bg-emerald-100 text-emerald-600",
    },
    {
      label: "Reserved",
      value: summary?.totalReserved ?? 0,
      icon: BookOpenIcon,
      className: "bg-amber-100 text-amber-600",
    },
    {
      label: "Borrowed",
      value: summary?.totalBorrowed ?? 0,
      icon: PackageIcon,
      className: "bg-blue-100 text-blue-600",
    },
    {
      label: "Sold",
      value: summary?.totalSold ?? 0,
      icon: ShoppingCartIcon,
      className: "bg-violet-100 text-violet-600",
    },
    {
      label: "Event Stock",
      value: summary?.totalEventStock ?? 0,
      icon: StarIcon,
      className: "bg-yellow-100 text-yellow-600",
    },
    {
      label: "Damaged",
      value: summary?.totalDamaged ?? 0,
      icon: AlertTriangleIcon,
      className: "bg-rose-100 text-rose-600",
    },
    {
      label: "Lost",
      value: summary?.totalLost ?? 0,
      icon: XIcon,
      className: "bg-red-100 text-red-500",
    },
    {
      label: "Low Stock Items",
      value: summary?.lowStockItems ?? 0,
      icon: Trash2Icon,
      className: "bg-orange-100 text-orange-600",
    },
  ]

  if (isLoading) {
    return (
      <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <SummaryCardSkeleton key={i} />
        ))}
      </section>
    )
  }

  return (
    <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <Card
            key={card.label}
            className="flex w-full flex-row items-center gap-4 rounded-lg p-4 shadow-sm"
          >
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full ${card.className}`}
            >
              <Icon className="size-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">{card.label}</span>
              <span className="text-lg font-semibold">
                {card.value.toLocaleString()}
              </span>
            </div>
          </Card>
        )
      })}
    </section>
  )
}
