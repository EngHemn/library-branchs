import { fakeBooks } from "@/data/fake/fakeBooks"
import type { GroupSalesHistoryRecord } from "@/domain/entities/group/GroupSalesHistory"
import type { CartItem } from "@/domain/entities/sales/CartItem"
import type { SaleBook } from "@/domain/entities/sales/SaleBook"
import type { SaleStatus } from "@/domain/entities/sales/SaleStatus"

type SaleLineInput = {
  bookId: string
  quantity: number
  discount?: number
}

type BuildGroupSaleInput = {
  id: string
  groupId: string
  branchId: string
  branchName: string
  lines: SaleLineInput[]
  status?: SaleStatus
  createdAt: string
}

function bookToSaleBook(bookId: string, discount = 0): SaleBook | null {
  const book = fakeBooks.find((item) => item.id === bookId)

  if (!book) {
    return null
  }

  return {
    id: book.id,
    title: book.title,
    coverUrl: book.coverUrl,
    author: book.author,
    translator: book.translator,
    category: book.category,
    language: book.language,
    price: book.price,
    discount,
    stock: book.stock,
    branchId: book.branchId,
  }
}

function buildCartItems(lines: SaleLineInput[]): CartItem[] {
  const items: CartItem[] = []

  for (const line of lines) {
    const book = bookToSaleBook(line.bookId, line.discount ?? 0)

    if (!book) {
      continue
    }

    items.push({
      book,
      quantity: line.quantity,
    })
  }

  return items
}

function buildGroupSale(input: BuildGroupSaleInput): GroupSalesHistoryRecord {
  const items = buildCartItems(input.lines)
  const subtotal = items.reduce(
    (sum, item) => sum + item.book.price * item.quantity,
    0
  )
  const discountAmount = items.reduce(
    (sum, item) =>
      sum + ((item.book.price * item.book.discount) / 100) * item.quantity,
    0
  )

  return {
    id: input.id,
    groupId: input.groupId,
    branchId: input.branchId,
    branchName: input.branchName,
    items,
    subtotal,
    discountAmount,
    total: subtotal - discountAmount,
    status: input.status ?? "completed",
    createdAt: input.createdAt,
  }
}

export const fakeGroupSalesHistory: GroupSalesHistoryRecord[] = [
  buildGroupSale({
    id: "GSALE-001",
    groupId: "GRP-001",
    branchId: "BR-001",
    branchName: "Central Library & Bookshop",
    createdAt: "2026-05-28T10:15:00.000Z",
    lines: [
      { bookId: "BK-001", quantity: 2, discount: 10 },
      { bookId: "BK-004", quantity: 1 },
    ],
  }),
  buildGroupSale({
    id: "GSALE-002",
    groupId: "GRP-001",
    branchId: "BR-001",
    branchName: "Central Library & Bookshop",
    createdAt: "2026-05-22T14:40:00.000Z",
    lines: [
      { bookId: "BK-005", quantity: 3, discount: 5 },
      { bookId: "BK-006", quantity: 1 },
    ],
  }),
  buildGroupSale({
    id: "GSALE-003",
    groupId: "GRP-001",
    branchId: "BR-002",
    branchName: "Northside Books",
    createdAt: "2026-05-10T11:20:00.000Z",
    lines: [{ bookId: "BK-004", quantity: 2 }],
  }),
  buildGroupSale({
    id: "GSALE-004",
    groupId: "GRP-001",
    branchId: "BR-004",
    branchName: "West End Book Center",
    createdAt: "2026-04-18T16:05:00.000Z",
    status: "voided",
    lines: [{ bookId: "BK-001", quantity: 1, discount: 15 }],
  }),

  buildGroupSale({
    id: "GSALE-005",
    groupId: "GRP-002",
    branchId: "BR-001",
    branchName: "Central Library & Bookshop",
    createdAt: "2026-05-30T09:30:00.000Z",
    lines: [
      { bookId: "BK-001", quantity: 1, discount: 10 },
      { bookId: "BK-002", quantity: 1 },
    ],
  }),
  buildGroupSale({
    id: "GSALE-006",
    groupId: "GRP-002",
    branchId: "BR-001",
    branchName: "Central Library & Bookshop",
    createdAt: "2026-05-15T13:00:00.000Z",
    lines: [{ bookId: "BK-003", quantity: 2 }],
  }),
  buildGroupSale({
    id: "GSALE-007",
    groupId: "GRP-002",
    branchId: "BR-006",
    branchName: "Campus Corner Books",
    createdAt: "2026-04-02T10:45:00.000Z",
    lines: [
      { bookId: "BK-002", quantity: 1, discount: 5 },
      { bookId: "BK-003", quantity: 1, discount: 5 },
    ],
  }),

  buildGroupSale({
    id: "GSALE-008",
    groupId: "GRP-003",
    branchId: "BR-002",
    branchName: "Northside Books",
    createdAt: "2026-05-25T15:10:00.000Z",
    lines: [{ bookId: "BK-007", quantity: 1 }],
  }),
  buildGroupSale({
    id: "GSALE-009",
    groupId: "GRP-003",
    branchId: "BR-002",
    branchName: "Northside Books",
    createdAt: "2026-05-12T12:30:00.000Z",
    lines: [{ bookId: "BK-008", quantity: 2, discount: 8 }],
  }),

  buildGroupSale({
    id: "GSALE-010",
    groupId: "GRP-004",
    branchId: "BR-002",
    branchName: "Northside Books",
    createdAt: "2026-01-20T11:00:00.000Z",
    lines: [{ bookId: "BK-009", quantity: 1 }],
  }),
  buildGroupSale({
    id: "GSALE-011",
    groupId: "GRP-004",
    branchId: "BR-004",
    branchName: "West End Book Center",
    createdAt: "2025-12-15T17:25:00.000Z",
    lines: [{ bookId: "BK-010", quantity: 1, discount: 12 }],
  }),

  buildGroupSale({
    id: "GSALE-012",
    groupId: "GRP-005",
    branchId: "BR-001",
    branchName: "Central Library & Bookshop",
    createdAt: "2026-06-01T10:00:00.000Z",
    lines: [
      { bookId: "BK-011", quantity: 2 },
      { bookId: "BK-012", quantity: 1, discount: 10 },
    ],
  }),
  buildGroupSale({
    id: "GSALE-013",
    groupId: "GRP-005",
    branchId: "BR-004",
    branchName: "West End Book Center",
    createdAt: "2026-05-20T14:15:00.000Z",
    lines: [
      { bookId: "BK-004", quantity: 1 },
      { bookId: "BK-013", quantity: 1 },
    ],
  }),
  buildGroupSale({
    id: "GSALE-014",
    groupId: "GRP-005",
    branchId: "BR-005",
    branchName: "Riverside Collection",
    createdAt: "2026-05-08T09:50:00.000Z",
    lines: [{ bookId: "BK-014", quantity: 3, discount: 5 }],
  }),
  buildGroupSale({
    id: "GSALE-015",
    groupId: "GRP-005",
    branchId: "BR-001",
    branchName: "Central Library & Bookshop",
    createdAt: "2026-04-25T16:30:00.000Z",
    status: "voided",
    lines: [{ bookId: "BK-011", quantity: 1 }],
  }),

  buildGroupSale({
    id: "GSALE-016",
    groupId: "GRP-006",
    branchId: "BR-011",
    branchName: "Solo Reading Room",
    createdAt: "2026-05-20T10:30:00.000Z",
    lines: [
      { bookId: "BK-017", quantity: 2, discount: 10 },
      { bookId: "BK-018", quantity: 1 },
    ],
  }),
  buildGroupSale({
    id: "GSALE-017",
    groupId: "GRP-006",
    branchId: "BR-011",
    branchName: "Solo Reading Room",
    createdAt: "2026-04-28T14:00:00.000Z",
    lines: [{ bookId: "BK-018", quantity: 3, discount: 5 }],
  }),
  buildGroupSale({
    id: "GSALE-018",
    groupId: "GRP-007",
    branchId: "BR-011",
    branchName: "Solo Reading Room",
    createdAt: "2026-05-10T11:45:00.000Z",
    lines: [{ bookId: "BK-017", quantity: 1 }],
  }),
  buildGroupSale({
    id: "GSALE-019",
    groupId: "GRP-008",
    branchId: "BR-011",
    branchName: "Solo Reading Room",
    createdAt: "2026-01-15T09:20:00.000Z",
    lines: [{ bookId: "BK-018", quantity: 2 }],
  }),
]

export function getFakeGroupSalesHistoryByGroupId(
  groupId: string
): GroupSalesHistoryRecord[] {
  return fakeGroupSalesHistory
    .filter((record) => record.groupId === groupId)
    .map((record) => ({
      ...record,
      items: record.items.map((item) => ({
        book: { ...item.book },
        quantity: item.quantity,
      })),
    }))
    .sort(
      (first, second) =>
        new Date(second.createdAt).getTime() -
        new Date(first.createdAt).getTime()
    )
}
