"use client"

import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type {
  DashboardBook,
  DashboardBookStatus,
} from "@/domain/entities/dashboard/DashboardSummary"
import { BranchDetailLink } from "@/presentation/components/shared/DashboardEntityLink"

type DashboardRecentBooksTableProps = {
  books: DashboardBook[]
  showBranchColumn?: boolean
}

const statusLabel: Record<DashboardBookStatus, string> = {
  available: "Available",
  borrowed: "Borrowed",
  reserved: "Reserved",
  unavailable: "Unavailable",
}

const statusVariant: Record<
  DashboardBookStatus,
  "default" | "secondary" | "outline" | "destructive"
> = {
  available: "default",
  borrowed: "secondary",
  reserved: "outline",
  unavailable: "destructive",
}

export function DashboardRecentBooksTable({
  books,
  showBranchColumn = false,
}: DashboardRecentBooksTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead className="hidden sm:table-cell">Author</TableHead>
          <TableHead className="hidden md:table-cell">Category</TableHead>
          {showBranchColumn ? (
            <TableHead className="hidden lg:table-cell">Branch</TableHead>
          ) : null}
          <TableHead className="w-16 text-right">Stock</TableHead>
          <TableHead className="w-20 text-right">Available</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {books.map((book) => (
          <TableRow key={book.id}>
            <TableCell className="max-w-[160px] truncate font-medium">
              {book.title}
            </TableCell>
            <TableCell className="hidden text-sm text-muted-foreground sm:table-cell">
              {book.author}
            </TableCell>
            <TableCell className="hidden text-sm text-muted-foreground md:table-cell">
              {book.category}
            </TableCell>
            {showBranchColumn ? (
              <TableCell className="hidden max-w-[160px] truncate lg:table-cell">
                <BranchDetailLink
                  branchId={book.branchId}
                  branchName={book.branchName}
                  className="block truncate text-sm"
                />
              </TableCell>
            ) : null}
            <TableCell className="text-right text-sm">{book.stock}</TableCell>
            <TableCell className="text-right text-sm font-medium">
              {book.available}
            </TableCell>
            <TableCell>
              <Badge variant={statusVariant[book.status]} className="text-xs">
                {statusLabel[book.status]}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
