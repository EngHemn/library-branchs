"use client"

import { BookOpenIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { EntityImage } from "@/components/ui/entity-image"
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
import type { GroupAssignedBook } from "@/domain/entities/group/Group"
import { GroupBooksFilters } from "@/presentation/components/groups/GroupBooksFilters"
import {
  formatGroupBookPrice,
  groupBookStatusLabels,
  groupBookStatusVariants,
} from "@/presentation/components/groups/groupDisplay"
import { BookLink } from "@/presentation/components/shared/DashboardEntityLink"
import type {
  GroupBooksAuthorFilter,
  GroupBooksBranchFilter,
  GroupBooksCategoryFilter,
  GroupBooksFilterState,
  GroupBranchFilterOption,
} from "@/presentation/viewmodels/groups/GroupDetailViewModelState"

type GroupBooksTabProps = {
  books: GroupAssignedBook[]
  totalBooks: number
  filters: GroupBooksFilterState
  categories: string[]
  authors: string[]
  branchFilterOptions: GroupBranchFilterOption[]
  showBranchFilter: boolean
  onSearchQueryChange: (searchQuery: string) => void
  onCategoryFilterChange: (categoryFilter: GroupBooksCategoryFilter) => void
  onAuthorFilterChange: (authorFilter: GroupBooksAuthorFilter) => void
  onBranchFilterChange: (branchFilter: GroupBooksBranchFilter) => void
}

export function GroupBooksTab({
  books,
  totalBooks,
  filters,
  categories,
  authors,
  branchFilterOptions,
  showBranchFilter,
  onSearchQueryChange,
  onCategoryFilterChange,
  onAuthorFilterChange,
  onBranchFilterChange,
}: GroupBooksTabProps) {
  if (totalBooks === 0) {
    return (
      <Card className="rounded-lg">
        <CardContent className="flex min-h-48 items-center justify-center py-8">
          <p className="text-sm text-muted-foreground">
            No books assigned to this group.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <Card className="rounded-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <GroupBooksFilters
            searchQuery={filters.searchQuery}
            categoryFilter={filters.categoryFilter}
            authorFilter={filters.authorFilter}
            branchFilter={filters.branchFilter}
            categories={categories}
            authors={authors}
            branchFilterOptions={branchFilterOptions}
            showBranchFilter={showBranchFilter}
            onSearchQueryChange={onSearchQueryChange}
            onCategoryFilterChange={onCategoryFilterChange}
            onAuthorFilterChange={onAuthorFilterChange}
            onBranchFilterChange={onBranchFilterChange}
          />
        </CardContent>
      </Card>

      <Card className="rounded-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Assigned Books</CardTitle>
          <CardDescription>
            {books.length.toLocaleString()} of {totalBooks.toLocaleString()} book
            {totalBooks === 1 ? "" : "s"} shown
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {books.length === 0 ? (
            <div className="flex min-h-48 items-center justify-center py-8">
              <p className="text-sm text-muted-foreground">
                No books match the current filters.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Cover</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Author</TableHead>
                  {showBranchFilter ? <TableHead>Branch</TableHead> : null}
                  <TableHead>ISBN</TableHead>
                  <TableHead className="text-center">Stock</TableHead>
                  <TableHead className="text-center">Available</TableHead>
                  <TableHead className="text-center">Price</TableHead>
                  <TableHead>Availability</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {books.map((book) => (
                  <TableRow key={book.id}>
                    <TableCell>
                      <EntityImage
                        src={book.coverUrl}
                        alt={book.title}
                        width={40}
                        height={40}
                        className="size-10 shrink-0 rounded-md"
                        fallback={
                          <BookOpenIcon className="size-4 text-muted-foreground" />
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <BookLink bookId={book.id} title={book.title} />
                    </TableCell>
                    <TableCell>{book.author}</TableCell>
                    {showBranchFilter ? (
                      <TableCell>{book.branchName}</TableCell>
                    ) : null}
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
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
