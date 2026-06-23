import { Badge } from "@/components/ui/badge"
import type { StockStatus } from "@/domain/entities/stock/Stock"

type StockStatusBadgeProps = {
  status: StockStatus
}

const statusConfig: Record<StockStatus, { label: string; className: string }> =
  {
    in_stock: {
      label: "In Stock",
      className:
        "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50",
    },
    low_stock: {
      label: "Low Stock",
      className:
        "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50",
    },
    out_of_stock: {
      label: "Out of Stock",
      className: "bg-red-50 text-red-700 border-red-200 hover:bg-red-50",
    },
  }

export function StockStatusBadge({ status }: StockStatusBadgeProps) {
  const config = statusConfig[status]
  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  )
}
