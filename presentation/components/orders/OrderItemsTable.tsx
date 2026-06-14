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
import { useLocale } from "@/presentation/i18n/useLocale"
import { useTranslation } from "@/presentation/i18n/useTranslation"
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
  const { t } = useTranslation()
  const { locale } = useLocale()

  const columns = useMemo(() => {
    const allColumns: DataTableColumn<OrderItem, ItemColumnKey>[] = [
      {
        key: "title",
        header: t("orders.items.book"),
        sortable: true,
        sortValue: (item) => item.title,
        cell: (item) => <span className="font-medium">{item.title}</span>,
      },
      {
        key: "author",
        header: t("orders.items.author"),
        sortable: true,
        sortValue: (item) => item.author,
        cell: (item) => <AuthorLink name={item.author} />,
      },
      {
        key: "translator",
        header: t("orders.items.translator"),
        sortable: true,
        sortValue: (item) => item.translator ?? "",
        cell: (item) => <TranslatorLink name={item.translator} />,
      },
      {
        key: "category",
        header: t("orders.items.category"),
        sortable: true,
        sortValue: (item) => item.category,
        cell: (item) => item.category,
      },
      {
        key: "quantity",
        header: t("orders.items.quantity"),
        sortable: true,
        sortValue: (item) => item.quantity,
        cell: (item) => (
          <span className="font-semibold">{item.quantity.toLocaleString(locale)}</span>
        ),
      },
      {
        key: "unitPrice",
        header: t("orders.items.unitPrice"),
        sortable: true,
        sortValue: (item) => item.unitPrice,
        cell: (item) => formatOrderPriceInDinar(item.unitPrice, locale),
      },
      {
        key: "lineTotal",
        header: t("orders.items.lineTotal"),
        sortable: true,
        sortValue: (item) => item.unitPrice * item.quantity,
        cell: (item) =>
          formatOrderPriceInDinar(item.unitPrice * item.quantity, locale),
      },
      {
        key: "actions",
        header: t("orders.items.actions"),
        headerClassName: "text-right",
        className: "text-right",
        cell: (item) => (
          <div className="table-action-content gap-0">
            <OrderActionButton
              icon={EyeIcon}
              label={t("orders.items.viewBook")}
              variant="outline"
              onClick={() => onView(item)}
            />
          </div>
        ),
      },
    ]

    return allColumns
  }, [locale, onView, t])

  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalAmount = items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  )

  return (
    <Card className="rounded-lg">
      <CardHeader>
        <CardTitle>{t("orders.items.title")}</CardTitle>
        <CardDescription>
          {t("orders.items.recordCount", {
            count: totalQuantity.toLocaleString(locale),
            total: formatOrderPriceInDinar(totalAmount, locale),
          })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable
          data={items}
          columns={columns}
          getRowId={(item) => item.bookId}
          emptyTitle={t("orders.items.emptyTitle")}
          emptyDescription={t("orders.items.emptyDescription")}
          initialSort={{ key: "title", direction: "asc" }}
          initialPageSize={10}
          tableClassName="min-w-[1050px]"
        />
      </CardContent>
    </Card>
  )
}
