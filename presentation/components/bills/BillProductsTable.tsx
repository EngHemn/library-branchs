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

type BillProductsTableProps = {
  products: BillProduct[]
  onView: (product: BillProduct) => void
}

type ProductColumnKey = "title" | "isbn" | "bookId" | "actions"

export function BillProductsTable({ products, onView }: BillProductsTableProps) {
  const columns = useMemo(() => {
    const allColumns: DataTableColumn<BillProduct, ProductColumnKey>[] = [
    {
      key: "title",
      header: "Book",
      sortable: true,
      sortValue: (product) => product.title,
      cell: (product) => <span className="font-medium">{product.title}</span>,
    },
    {
      key: "isbn",
      header: "ISBN",
      sortable: true,
      sortValue: (product) => product.isbn,
      cell: (product) => (
        <span className="font-mono text-xs text-muted-foreground">{product.isbn}</span>
      ),
    },
    {
      key: "bookId",
      header: "Book ID",
      sortable: true,
      sortValue: (product) => product.bookId,
      cell: (product) => (
        <span className="font-mono text-xs text-muted-foreground">{product.bookId}</span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      headerClassName: "text-right",
      className: "text-right",
      cell: (product) => (
        <div className="flex justify-end">
          <BillActionButton
            icon={EyeIcon}
            label="View Book"
            variant="outline"
            onClick={() => onView(product)}
          />
        </div>
      ),
    },
    ]

    return allColumns
  }, [onView])

  return (
    <Card className="rounded-lg">
      <CardHeader>
        <CardTitle>Imported Products</CardTitle>
        <CardDescription>
          {products.length.toLocaleString()} books on this bill
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable
          data={products}
          columns={columns}
          getRowId={(product) => product.bookId}
          emptyTitle="No products"
          emptyDescription="This bill has no linked books."
          initialSort={{ key: "title", direction: "asc" }}
          initialPageSize={10}
        />
      </CardContent>
    </Card>
  )
}
