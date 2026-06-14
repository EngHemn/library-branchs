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
import type { BillProduct } from "@/domain/entities/bill/BillDetail"
import { BillActionButton } from "@/presentation/components/bills/BillActionButton"
import { useLocale } from "@/presentation/i18n/useLocale"
import { useTranslation } from "@/presentation/i18n/useTranslation"

type BillProductsTableProps = {
  products: BillProduct[]
  onView: (product: BillProduct) => void
}

type ProductColumnKey = "title" | "isbn" | "bookId" | "actions"

export function BillProductsTable({ products, onView }: BillProductsTableProps) {
  const { t } = useTranslation()
  const { locale } = useLocale()

  const columns = useMemo(() => {
    const allColumns: DataTableColumn<BillProduct, ProductColumnKey>[] = [
    {
      key: "title",
      header: t("bills.products.book"),
      sortable: true,
      sortValue: (product) => product.title,
      cell: (product) => <span className="font-medium">{product.title}</span>,
    },
    {
      key: "isbn",
      header: t("bills.products.isbn"),
      sortable: true,
      sortValue: (product) => product.isbn,
      cell: (product) => (
        <span className="font-mono text-xs text-muted-foreground">{product.isbn}</span>
      ),
    },
    {
      key: "bookId",
      header: t("bills.products.bookId"),
      sortable: true,
      sortValue: (product) => product.bookId,
      cell: (product) => (
        <span className="font-mono text-xs text-muted-foreground">{product.bookId}</span>
      ),
    },
    {
      key: "actions",
      header: t("bills.products.actions"),
      headerClassName: "text-right",
      className: "text-right",
      cell: (product) => (
        <div className="table-action-content gap-0">
          <BillActionButton
            icon={EyeIcon}
            label={t("bills.products.viewBook")}
            variant="outline"
            onClick={() => onView(product)}
          />
        </div>
      ),
    },
    ]

    return allColumns
  }, [onView, t])

  return (
    <Card className="rounded-lg">
      <CardHeader>
        <CardTitle>{t("bills.products.title")}</CardTitle>
        <CardDescription>
          {t("bills.products.recordCount", {
            count: products.length.toLocaleString(locale),
          })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable
          data={products}
          columns={columns}
          getRowId={(product) => product.bookId}
          emptyTitle={t("bills.products.emptyTitle")}
          emptyDescription={t("bills.products.emptyDescription")}
          initialSort={{ key: "title", direction: "asc" }}
          initialPageSize={10}
        />
      </CardContent>
    </Card>
  )
}
