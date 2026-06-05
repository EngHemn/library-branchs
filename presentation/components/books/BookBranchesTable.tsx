"use client"

import {
  Card,
  CardContent,
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
import type { BranchStock } from "@/domain/entities/book/BookDetail"
import { BranchLink } from "@/presentation/components/branch-management/BranchLink"

type BookBranchesTableProps = {
  branchStocks: BranchStock[]
  /** Sub-branch users see stock counts as cards instead of a multi-branch table. */
  variant?: "table" | "summary"
}

const stockSummaryFields: {
  key: keyof Omit<BranchStock, "branchId" | "branchName">
  label: string
}[] = [
  { key: "available", label: "Available" },
  { key: "reserved", label: "Reserved" },
  { key: "borrowed", label: "Borrowed" },
  { key: "event", label: "Event" },
  { key: "sold", label: "Sold" },
  { key: "damaged", label: "Damaged" },
  { key: "lost", label: "Lost" },
]

function BookBranchStockSummary({ stock }: { stock: BranchStock }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {stockSummaryFields.map((field) => (
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
  const branchStock = branchStocks[0] ?? null

  return (
    <Card className="rounded-lg">
      <CardHeader>
        <CardTitle>Branches Carrying This Book</CardTitle>
      </CardHeader>
      <CardContent>
        {branchStocks.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            No branches carry this book yet.
          </p>
        ) : variant === "summary" && branchStock ? (
          <BookBranchStockSummary stock={branchStock} />
        ) : (
          <div className="overflow-x-auto">
            <Table className="min-w-[700px]">
              <TableHeader>
                <TableRow>
                  <TableHead>Branch</TableHead>
                  <TableHead>Available</TableHead>
                  <TableHead>Reserved</TableHead>
                  <TableHead>Borrowed</TableHead>
                  <TableHead>Event</TableHead>
                  <TableHead>Sold</TableHead>
                  <TableHead>Damaged</TableHead>
                  <TableHead>Lost</TableHead>
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
