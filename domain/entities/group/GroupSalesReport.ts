export type GroupSalesReportBookRow = {
  bookId: string
  title: string
  author: string
  translator: string | null
  category: string
  unitsSold: number
  totalRevenue: number
  saleCount: number
}

export type GroupSalesReportAuthorRow = {
  author: string
  unitsSold: number
  totalRevenue: number
  bookCount: number
  saleCount: number
}

export type GroupSalesReportTranslatorRow = {
  translator: string
  unitsSold: number
  totalRevenue: number
  bookCount: number
  saleCount: number
}

export type GroupSalesReportCategoryRow = {
  category: string
  unitsSold: number
  totalRevenue: number
  bookCount: number
  saleCount: number
}

export type GroupSalesReport = {
  books: GroupSalesReportBookRow[]
  authors: GroupSalesReportAuthorRow[]
  translators: GroupSalesReportTranslatorRow[]
  categories: GroupSalesReportCategoryRow[]
  totalUnitsSold: number
  totalRevenue: number
  completedSaleCount: number
}

export const emptyGroupSalesReport: GroupSalesReport = {
  books: [],
  authors: [],
  translators: [],
  categories: [],
  totalUnitsSold: 0,
  totalRevenue: 0,
  completedSaleCount: 0,
}
