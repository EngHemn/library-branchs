import { Badge } from "@/components/ui/badge"
import type { MovementType } from "@/domain/entities/stock/StockMovement"

type MovementBadgeProps = {
  type: MovementType
}

const movementConfig: Record<
  MovementType,
  { label: string; className: string }
> = {
  stock_added: {
    label: "Stock Added",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  stock_reduced: {
    label: "Stock Reduced",
    className: "bg-orange-50 text-orange-700 border-orange-200",
  },
  transfer: {
    label: "Transfer",
    className: "bg-blue-50 text-blue-700 border-blue-200",
  },
  sale: {
    label: "Sale",
    className: "bg-violet-50 text-violet-700 border-violet-200",
  },
  return: {
    label: "Return",
    className: "bg-teal-50 text-teal-700 border-teal-200",
  },
  damage: {
    label: "Damage",
    className: "bg-red-50 text-red-700 border-red-200",
  },
  manual_adjustment: {
    label: "Manual Adjustment",
    className: "bg-slate-50 text-slate-700 border-slate-200",
  },
}

export function MovementBadge({ type }: MovementBadgeProps) {
  const config = movementConfig[type]
  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  )
}
