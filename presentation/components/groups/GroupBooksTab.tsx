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
import type { BookStatus } from "@/domain/entities/book/Book"
import type { GroupAssignedBook } from "@/domain/entities/group/Group"
import { GroupBooksFilters } from "@/presentation/components/groups/GroupBooksFilters"
import {
  formatGroupBookPrice,
  groupBookStatusVariants,
} from "@/presentation/components/groups/groupDisplay"
import { BookLink } from "@/presentation/components/shared/DashboardEntityLink"
import type { TranslationKey } from "@/presentation/i18n/messages"
import { useLocale } from "@/presentation/i18n/useLocale"
import { useTranslation } from "@/presentation/i18n/useTranslation"
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
  const { t } = useTranslation()
  const { locale } = useLocale()

  const bookStatusLabel = (status: BookStatus) =>
    t(`groups.bookStatus.${status}` as TranslationKey)

  if (totalBooks === 0) {
    return (
      <Card className="rounded-lg">
        <CardContent className="flex min-h-48 items-center justify-center py-8">
          <p className="text-sm text-muted-foreground">
            {t("groups.books.empty")}
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <Card className="rounded-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">
            {t("groups.filters.filters")}
          </CardTitle>
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
          <CardTitle className="text-base">
            {t("groups.books.assignedTitle")}
          </CardTitle>
          <CardDescription>
            {t("groups.books.shownCount", {
              shown: books.length.toLocaleString(locale),
              total: totalBooks.toLocaleString(locale),
            })}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {books.length === 0 ? (
            <div className="flex min-h-48 items-center justify-center py-8">
              <p className="text-sm text-muted-foreground">
                {t("groups.books.noMatch")}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">
                    {t("groups.books.cover")}
                  </TableHead>
                  <TableHead>{t("groups.books.title")}</TableHead>
                  <TableHead>{t("groups.books.author")}</TableHead>
                  {showBranchFilter ? (
                    <TableHead>{t("groups.books.branch")}</TableHead>
                  ) : null}
                  <TableHead>{t("groups.books.isbn")}</TableHead>
                  <TableHead className="text-center">
                    {t("groups.books.stock")}
                  </TableHead>
                  <TableHead className="text-center">
                    {t("groups.books.available")}
                  </TableHead>
                  <TableHead className="text-center">
                    {t("groups.books.price")}
                  </TableHead>
                  <TableHead>{t("groups.books.availability")}</TableHead>
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
                    <TableCell className="font-mono text-xs">
                      {book.isbn}
                    </TableCell>
                    <TableCell className="text-center tabular-nums">
                      {book.stock.toLocaleString(locale)}
                    </TableCell>
                    <TableCell className="text-center tabular-nums">
                      {book.available.toLocaleString(locale)}
                    </TableCell>
                    <TableCell className="text-center tabular-nums">
                      {formatGroupBookPrice(book.price, locale)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={groupBookStatusVariants[book.status]}>
                        {bookStatusLabel(book.status)}
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
