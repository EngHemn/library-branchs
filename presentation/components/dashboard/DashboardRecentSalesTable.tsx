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

type DashboardRecentSalesTableProps = {
  sales: DashboardSale[]
  showBranchColumn?: boolean
}

export function DashboardRecentSalesTable({
  sales,
  showBranchColumn = false,
}: DashboardRecentSalesTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-24">Sale ID</TableHead>
          <TableHead className="w-24 text-right">Items</TableHead>
          <TableHead className="w-28 text-right">Total</TableHead>
          {showBranchColumn ? (
            <TableHead className="hidden md:table-cell">Branch</TableHead>
          ) : null}
          <TableHead className="hidden sm:table-cell">Date &amp; Time</TableHead>
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
