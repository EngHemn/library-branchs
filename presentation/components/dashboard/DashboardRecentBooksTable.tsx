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
import { useTranslation } from "@/presentation/i18n/useTranslation"

type DashboardRecentBooksTableProps = {
  books: DashboardBook[]
  showBranchColumn?: boolean
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
  const { t } = useTranslation()

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t("dashboard.tables.title")}</TableHead>
          <TableHead className="hidden sm:table-cell">
            {t("dashboard.tables.author")}
          </TableHead>
          <TableHead className="hidden md:table-cell">
            {t("dashboard.tables.category")}
          </TableHead>
          {showBranchColumn ? (
            <TableHead className="hidden lg:table-cell">
              {t("dashboard.tables.branch")}
            </TableHead>
          ) : null}
          <TableHead className="w-16 text-right">
            {t("dashboard.tables.stock")}
          </TableHead>
          <TableHead className="w-20 text-right">
            {t("dashboard.tables.available")}
          </TableHead>
          <TableHead>{t("common.status")}</TableHead>
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
                {t(`dashboard.bookStatus.${book.status}`)}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
