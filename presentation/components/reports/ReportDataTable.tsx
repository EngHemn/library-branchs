"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { ReportTable } from "@/domain/entities/reports/Reports"

type ReportDataTableProps = {
  table: ReportTable
}

export function ReportDataTable({ table }: ReportDataTableProps) {
  return (
    <Card className="rounded-lg">
      <CardHeader>
        <CardTitle className="text-base">{table.title}</CardTitle>
        <CardDescription>{table.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              {table.columns.map((column) => (
                <TableHead
                  key={column.key}
                  className={
                    column.align === "right" ? "text-right" : undefined
                  }
                >
                  {column.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {table.rows.map((row, rowIndex) => (
              <TableRow key={`${table.id}-${rowIndex}`}>
                {table.columns.map((column) => (
                  <TableCell
                    key={column.key}
                    className={
                      column.align === "right"
                        ? "text-right tabular-nums"
                        : undefined
                    }
                  >
                    {row[column.key] ?? "—"}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
