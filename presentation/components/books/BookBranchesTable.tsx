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

type BookBranchesTableProps = {
  branchStocks: BranchStock[]
}

export function BookBranchesTable({ branchStocks }: BookBranchesTableProps) {
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
                      {stock.branchName}
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
