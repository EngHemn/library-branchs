"use client"

import { Trash2Icon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { GroupBookOption } from "@/domain/repositories/GroupRepository"
import {
  formatGroupBookPrice,
  groupBookStatusLabels,
  groupBookStatusVariants,
} from "@/presentation/components/groups/groupDisplay"

type GroupSelectedBooksTableProps = {
  bookOptions: GroupBookOption[]
  selectedBookIds: string[]
  onRemoveBook: (bookId: string) => void
  disabled?: boolean
}

export function GroupSelectedBooksTable({
  bookOptions,
  selectedBookIds,
  onRemoveBook,
  disabled = false,
}: GroupSelectedBooksTableProps) {
  const selectedBooks = selectedBookIds
    .map((bookId) => bookOptions.find((book) => book.id === bookId))
    .filter((book): book is GroupBookOption => book !== undefined)

  if (selectedBooks.length === 0) {
    return (
      <p className="rounded-lg border border-dashed py-8 text-center text-sm text-muted-foreground">
        No books assigned yet. Use the selector above to add books.
      </p>
    )
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>ISBN</TableHead>
            <TableHead className="text-center">Stock</TableHead>
            <TableHead className="text-center">Available</TableHead>
            <TableHead className="text-center">Price</TableHead>
            <TableHead>Availability</TableHead>
            <TableHead className="w-16 text-right">Remove</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {selectedBooks.map((book) => (
            <TableRow key={book.id}>
              <TableCell className="font-medium">{book.title}</TableCell>
              <TableCell>{book.author}</TableCell>
              <TableCell className="font-mono text-xs">{book.isbn}</TableCell>
              <TableCell className="text-center tabular-nums">
                {book.stock.toLocaleString()}
              </TableCell>
              <TableCell className="text-center tabular-nums">
                {book.available.toLocaleString()}
              </TableCell>
              <TableCell className="text-center tabular-nums">
                {formatGroupBookPrice(book.price)}
              </TableCell>
              <TableCell>
                <Badge variant={groupBookStatusVariants[book.status]}>
                  {groupBookStatusLabels[book.status]}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  disabled={disabled}
                  aria-label={`Remove ${book.title}`}
                  onClick={() => onRemoveBook(book.id)}
                >
                  <Trash2Icon />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
