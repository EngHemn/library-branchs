import type { StockRow } from "@/domain/entities/stock/Stock"

export type StockTableGroup = {
  id: string
  bookId: string
  bookTitle: string
  bookCoverUrl: string | null
  isbn: string
  category: string
  branchId: string
  branchName: string
  mainRow: StockRow | null
  subBranchRows: StockRow[]
}

export function stockGroupId(bookId: string, branchId: string): string {
  return `${bookId}::${branchId}`
}

export function hasSubBranches(group: StockTableGroup): boolean {
  return group.subBranchRows.length > 0
}

/** Row used for parent-column values (main branch stock when present). */
export function getParentStockRow(group: StockTableGroup): StockRow {
  if (group.mainRow) {
    return group.mainRow
  }

  const firstSub = group.subBranchRows[0]
  if (!firstSub) {
    throw new Error("Stock group has no rows")
  }

  return firstSub
}

export function groupStockRows(rows: StockRow[]): StockTableGroup[] {
  const map = new Map<
    string,
    { mainRow: StockRow | null; subBranchRows: StockRow[] }
  >()

  for (const row of rows) {
    const id = stockGroupId(row.bookId, row.branchId)
    const entry = map.get(id) ?? { mainRow: null, subBranchRows: [] }

    if (row.subBranchId) {
      entry.subBranchRows.push(row)
    } else {
      entry.mainRow = row
    }

    map.set(id, entry)
  }

  return Array.from(map.entries()).map(([id, { mainRow, subBranchRows }]) => {
    const reference = mainRow ?? subBranchRows[0]!

    return {
      id,
      bookId: reference.bookId,
      bookTitle: reference.bookTitle,
      bookCoverUrl: reference.bookCoverUrl,
      isbn: reference.isbn,
      category: reference.category,
      branchId: reference.branchId,
      branchName: reference.branchName,
      mainRow,
      subBranchRows,
    }
  })
}
