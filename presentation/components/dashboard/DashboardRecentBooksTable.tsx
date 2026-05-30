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

type DashboardRecentBooksTableProps = {
  books: DashboardBook[]
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

export function DashboardRecentBooksTable({ books }: DashboardRecentBooksTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead className="hidden sm:table-cell">Author</TableHead>
          <TableHead className="hidden md:table-cell">Category</TableHead>
          <TableHead className="hidden lg:table-cell">Branch</TableHead>
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
            <TableCell className="hidden text-sm text-muted-foreground lg:table-cell">
              {book.branchName}
            </TableCell>
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
