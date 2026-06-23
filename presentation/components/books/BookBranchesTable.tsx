"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { BranchStock } from "@/domain/entities/book/BookDetail"
import { BranchLink } from "@/presentation/components/branch-management/BranchLink"
import { useTranslation } from "@/presentation/i18n/useTranslation"

type BookBranchesTableProps = {
  branchStocks: BranchStock[]
  /** Sub-branch users see stock counts as cards instead of a multi-branch table. */
  variant?: "table" | "summary"
}

type StockSummaryFieldKey = keyof Omit<BranchStock, "branchId" | "branchName">

function BookBranchStockSummary({
  stock,
  fields,
}: {
  stock: BranchStock
  fields: { key: StockSummaryFieldKey; label: string }[]
}) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {fields.map((field) => (
        <div
          key={field.key}
          className="flex flex-col rounded-lg border bg-muted/30 px-4 py-3"
        >
          <span className="text-xs text-muted-foreground">{field.label}</span>
          <span className="text-lg font-semibold tabular-nums">
            {stock[field.key].toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  )
}

export function BookBranchesTable({
  branchStocks,
  variant = "table",
}: BookBranchesTableProps) {
  const { t } = useTranslation()
  const branchStock = branchStocks[0] ?? null

  const stockSummaryFields: { key: StockSummaryFieldKey; label: string }[] = [
    { key: "available", label: t("books.branches.available") },
    { key: "reserved", label: t("books.branches.reserved") },
    { key: "borrowed", label: t("books.branches.borrowed") },
    { key: "event", label: t("books.branches.event") },
    { key: "sold", label: t("books.branches.sold") },
    { key: "damaged", label: t("books.branches.damaged") },
    { key: "lost", label: t("books.branches.lost") },
  ]

  return (
    <Card className="rounded-lg">
      <CardHeader>
        <CardTitle>{t("books.branches.title")}</CardTitle>
      </CardHeader>
      <CardContent>
        {branchStocks.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            {t("books.branches.empty")}
          </p>
        ) : variant === "summary" && branchStock ? (
          <BookBranchStockSummary
            stock={branchStock}
            fields={stockSummaryFields}
          />
        ) : (
          <div className="overflow-x-auto">
            <Table className="min-w-[700px]">
              <TableHeader>
                <TableRow>
                  <TableHead>{t("books.branches.branch")}</TableHead>
                  <TableHead>{t("books.branches.available")}</TableHead>
                  <TableHead>{t("books.branches.reserved")}</TableHead>
                  <TableHead>{t("books.branches.borrowed")}</TableHead>
                  <TableHead>{t("books.branches.event")}</TableHead>
                  <TableHead>{t("books.branches.sold")}</TableHead>
                  <TableHead>{t("books.branches.damaged")}</TableHead>
                  <TableHead>{t("books.branches.lost")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {branchStocks.map((stock) => (
                  <TableRow key={stock.branchId}>
                    <TableCell className="font-medium">
                      <BranchLink
                        branchId={stock.branchId}
                        branchName={stock.branchName}
                      />
                    </TableCell>
                    <TableCell>{stock.available}</TableCell>
                    <TableCell>{stock.reserved}</TableCell>
                    <TableCell>{stock.borrowed}</TableCell>
                    <TableCell>{stock.event}</TableCell>
                    <TableCell>{stock.sold}</TableCell>
                    <TableCell>{stock.damaged}</TableCell>
                    <TableCell>{stock.lost}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
