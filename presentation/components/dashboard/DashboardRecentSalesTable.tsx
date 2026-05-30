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

type DashboardRecentSalesTableProps = {
  sales: DashboardSale[]
}

export function DashboardRecentSalesTable({ sales }: DashboardRecentSalesTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Branch</TableHead>
          <TableHead className="w-24 text-right">Items</TableHead>
          <TableHead className="w-28 text-right">Total</TableHead>
          <TableHead className="hidden sm:table-cell">Date &amp; Time</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sales.map((sale) => (
          <TableRow key={sale.id}>
            <TableCell className="font-medium">{sale.branchName}</TableCell>
            <TableCell className="text-right text-sm text-muted-foreground">
              {sale.itemCount}
            </TableCell>
            <TableCell className="text-right text-sm font-semibold">
              ${sale.total.toFixed(2)}
            </TableCell>
            <TableCell className="hidden text-sm text-muted-foreground sm:table-cell">
              {sale.createdAt}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
