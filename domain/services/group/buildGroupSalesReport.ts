import {
  emptyGroupSalesReport,
  type GroupSalesReport,
  type GroupSalesReportAuthorRow,
  type GroupSalesReportBookRow,
  type GroupSalesReportCategoryRow,
  type GroupSalesReportTranslatorRow,
} from "@/domain/entities/group/GroupSalesReport"
import type { CartItem } from "@/domain/entities/sales/CartItem"
import type { Sale } from "@/domain/entities/sales/Sale"

type BookAccumulator = {
  bookId: string
  title: string
  author: string
  translator: string | null
  category: string
  unitsSold: number
  totalRevenue: number
  saleIds: Set<string>
}

type NamedAccumulator = {
  name: string
  unitsSold: number
  totalRevenue: number
  bookIds: Set<string>
  saleIds: Set<string>
}

function lineRevenue(item: CartItem): number {
  const gross = item.book.price * item.quantity
  const discountAmount =
    ((item.book.price * item.book.discount) / 100) * item.quantity
  return gross - discountAmount
}

function toBookRows(
  map: Map<string, BookAccumulator>
): GroupSalesReportBookRow[] {
  return Array.from(map.values())
    .map((row) => ({
      bookId: row.bookId,
      title: row.title,
      author: row.author,
      translator: row.translator,
      category: row.category,
      unitsSold: row.unitsSold,
      totalRevenue: row.totalRevenue,
      saleCount: row.saleIds.size,
    }))
    .sort((left, right) => right.totalRevenue - left.totalRevenue)
}

function toNamedRows(map: Map<string, NamedAccumulator>): {
  unitsSold: number
  totalRevenue: number
  bookCount: number
  saleCount: number
  name: string
}[] {
  return Array.from(map.values())
    .map((row) => ({
      name: row.name,
      unitsSold: row.unitsSold,
      totalRevenue: row.totalRevenue,
      bookCount: row.bookIds.size,
      saleCount: row.saleIds.size,
    }))
    .sort((left, right) => right.totalRevenue - left.totalRevenue)
}

export function buildGroupSalesReport(sales: Sale[]): GroupSalesReport {
  const completedSales = sales.filter((sale) => sale.status === "completed")

  if (completedSales.length === 0) {
    return { ...emptyGroupSalesReport }
  }

  const books = new Map<string, BookAccumulator>()
  const authors = new Map<string, NamedAccumulator>()
  const translators = new Map<string, NamedAccumulator>()
  const categories = new Map<string, NamedAccumulator>()

  let totalUnitsSold = 0
  let totalRevenue = 0

  for (const sale of completedSales) {
    for (const item of sale.items) {
      const revenue = lineRevenue(item)
      totalUnitsSold += item.quantity
      totalRevenue += revenue

      const bookKey = item.book.id
      const existingBook = books.get(bookKey)

      if (existingBook) {
        existingBook.unitsSold += item.quantity
        existingBook.totalRevenue += revenue
        existingBook.saleIds.add(sale.id)
      } else {
        books.set(bookKey, {
          bookId: item.book.id,
          title: item.book.title,
          author: item.book.author,
          translator: item.book.translator ?? null,
          category: item.book.category,
          unitsSold: item.quantity,
          totalRevenue: revenue,
          saleIds: new Set([sale.id]),
        })
      }

      const authorKey = item.book.author
      const existingAuthor = authors.get(authorKey)

      if (existingAuthor) {
        existingAuthor.unitsSold += item.quantity
        existingAuthor.totalRevenue += revenue
        existingAuthor.bookIds.add(item.book.id)
        existingAuthor.saleIds.add(sale.id)
      } else {
        authors.set(authorKey, {
          name: item.book.author,
          unitsSold: item.quantity,
          totalRevenue: revenue,
          bookIds: new Set([item.book.id]),
          saleIds: new Set([sale.id]),
        })
      }

      const translatorName = item.book.translator?.trim() || "Not assigned"
      const existingTranslator = translators.get(translatorName)

      if (existingTranslator) {
        existingTranslator.unitsSold += item.quantity
        existingTranslator.totalRevenue += revenue
        existingTranslator.bookIds.add(item.book.id)
        existingTranslator.saleIds.add(sale.id)
      } else {
        translators.set(translatorName, {
          name: translatorName,
          unitsSold: item.quantity,
          totalRevenue: revenue,
          bookIds: new Set([item.book.id]),
          saleIds: new Set([sale.id]),
        })
      }

      const categoryKey = item.book.category
      const existingCategory = categories.get(categoryKey)

      if (existingCategory) {
        existingCategory.unitsSold += item.quantity
        existingCategory.totalRevenue += revenue
        existingCategory.bookIds.add(item.book.id)
        existingCategory.saleIds.add(sale.id)
      } else {
        categories.set(categoryKey, {
          name: item.book.category,
          unitsSold: item.quantity,
          totalRevenue: revenue,
          bookIds: new Set([item.book.id]),
          saleIds: new Set([sale.id]),
        })
      }
    }
  }

  const authorRows: GroupSalesReportAuthorRow[] = toNamedRows(authors).map(
    (row) => ({
      author: row.name,
      unitsSold: row.unitsSold,
      totalRevenue: row.totalRevenue,
      bookCount: row.bookCount,
      saleCount: row.saleCount,
    })
  )

  const translatorRows: GroupSalesReportTranslatorRow[] = toNamedRows(
    translators
  ).map((row) => ({
    translator: row.name,
    unitsSold: row.unitsSold,
    totalRevenue: row.totalRevenue,
    bookCount: row.bookCount,
    saleCount: row.saleCount,
  }))

  const categoryRows: GroupSalesReportCategoryRow[] = toNamedRows(
    categories
  ).map((row) => ({
    category: row.name,
    unitsSold: row.unitsSold,
    totalRevenue: row.totalRevenue,
    bookCount: row.bookCount,
    saleCount: row.saleCount,
  }))

  return {
    books: toBookRows(books),
    authors: authorRows,
    translators: translatorRows,
    categories: categoryRows,
    totalUnitsSold,
    totalRevenue,
    completedSaleCount: completedSales.length,
  }
}
