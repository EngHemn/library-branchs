"use client"

import { useMemo } from "react"
import { EyeIcon } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DataTable,
  type DataTableColumn,
} from "@/components/ui/data-table"
import type { OrderItem } from "@/domain/entities/order/OrderDetail"
import { OrderActionButton } from "@/presentation/components/orders/OrderActionButton"
import { formatOrderPriceInDinar } from "@/presentation/components/orders/orderDisplay"
import {
  AuthorLink,
  TranslatorLink,
} from "@/presentation/components/shared/DashboardEntityLink"

type OrderItemsTableProps = {
  items: OrderItem[]
  onView: (item: OrderItem) => void
}

type ItemColumnKey =
  | "title"
  | "author"
  | "translator"
  | "category"
  | "quantity"
  | "unitPrice"
  | "lineTotal"
  | "actions"

export function OrderItemsTable({ items, onView }: OrderItemsTableProps) {
  const columns = useMemo(() => {
    const allColumns: DataTableColumn<OrderItem, ItemColumnKey>[] = [
      {
        key: "title",
        header: "Book",
        sortable: true,
        sortValue: (item) => item.title,
        cell: (item) => <span className="font-medium">{item.title}</span>,
      },
      {
        key: "author",
        header: "Author",
        sortable: true,
        sortValue: (item) => item.author,
        cell: (item) => <AuthorLink name={item.author} />,
      },
      {
        key: "translator",
        header: "Translator",
        sortable: true,
        sortValue: (item) => item.translator ?? "",
        cell: (item) => <TranslatorLink name={item.translator} />,
      },
      {
        key: "category",
        header: "Category",
        sortable: true,
        sortValue: (item) => item.category,
        cell: (item) => item.category,
      },
      {
        key: "quantity",
        header: "Quantity",
        sortable: true,
        sortValue: (item) => item.quantity,
        cell: (item) => (
          <span className="font-semibold">{item.quantity.toLocaleString()}</span>
        ),
      },
      {
        key: "unitPrice",
        header: "Unit Price (IQD)",
        sortable: true,
        sortValue: (item) => item.unitPrice,
        cell: (item) => formatOrderPriceInDinar(item.unitPrice),
      },
      {
        key: "lineTotal",
        header: "Line Total (IQD)",
        sortable: true,
        sortValue: (item) => item.unitPrice * item.quantity,
        cell: (item) =>
          formatOrderPriceInDinar(item.unitPrice * item.quantity),
      },
      {
        key: "actions",
        header: "Actions",
        headerClassName: "text-right",
        className: "text-right",
        cell: (item) => (
          <div className="flex justify-end">
            <OrderActionButton
              icon={EyeIcon}
              label="View Book"
              variant="outline"
              onClick={() => onView(item)}
            />
          </div>
        ),
      },
    ]

    return allColumns
  }, [onView])

  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalAmount = items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  )

  return (
    <Card className="rounded-lg">
      <CardHeader>
        <CardTitle>Order Items</CardTitle>
        <CardDescription>
          {totalQuantity.toLocaleString()} books ·{" "}
          {formatOrderPriceInDinar(totalAmount)} total item value
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable
          data={items}
          columns={columns}
          getRowId={(item) => item.bookId}
          emptyTitle="No items"
          emptyDescription="This order has no linked books."
          initialSort={{ key: "title", direction: "asc" }}
          initialPageSize={10}
          tableClassName="min-w-[1050px]"
        />
      </CardContent>
    </Card>
  )
}
