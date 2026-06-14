"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { DashboardSale } from "@/domain/entities/dashboard/DashboardSummary"
import { BranchDetailLink } from "@/presentation/components/shared/DashboardEntityLink"
import { useTranslation } from "@/presentation/i18n/useTranslation"

type DashboardRecentSalesTableProps = {
  sales: DashboardSale[]
  showBranchColumn?: boolean
}

export function DashboardRecentSalesTable({
  sales,
  showBranchColumn = false,
}: DashboardRecentSalesTableProps) {
  const { t } = useTranslation()

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-24">{t("dashboard.tables.saleId")}</TableHead>
          <TableHead className="w-24 text-right">{t("dashboard.tables.items")}</TableHead>
          <TableHead className="w-28 text-right">{t("dashboard.tables.total")}</TableHead>
          {showBranchColumn ? (
            <TableHead className="hidden md:table-cell">{t("dashboard.tables.branch")}</TableHead>
          ) : null}
          <TableHead className="hidden sm:table-cell">{t("dashboard.tables.dateTime")}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sales.map((sale) => (
          <TableRow key={sale.id}>
            <TableCell className="font-mono text-xs text-muted-foreground">{sale.id}</TableCell>
            <TableCell className="text-right text-sm text-muted-foreground">
              {sale.itemCount}
            </TableCell>
            <TableCell className="text-right text-sm font-semibold">
              ${sale.total.toFixed(2)}
            </TableCell>
            {showBranchColumn ? (
              <TableCell className="hidden max-w-[160px] truncate md:table-cell">
                <BranchDetailLink
                  branchId={sale.branchId}
                  branchName={sale.branchName}
                  className="block truncate text-sm"
                />
              </TableCell>
            ) : null}
            <TableCell className="hidden text-sm text-muted-foreground sm:table-cell">
              {sale.createdAt}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
