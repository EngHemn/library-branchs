import type { Bill } from "@/domain/entities/bill/Bill"
import type { BillLineItem } from "@/domain/entities/bill/BillLineItem"
import { fakeBooks } from "@/data/fake/fakeBooks"

export type FakeBillRecord = Bill & {
  items: BillLineItem[]
}

type BillItemOverrides = Record<
  string,
  {
    quantity?: number
    newPrice?: number | null
  }
>

function createBillItems(bookIds: string[], overrides: BillItemOverrides = {}): BillLineItem[] {
  return bookIds.map((bookId) => {
    const book = fakeBooks.find((item) => item.id === bookId)
    const itemOverrides = overrides[bookId]

    return {
      bookId,
      quantity: itemOverrides?.quantity ?? 1,
      initialPrice: book?.price ?? 0,
      newPrice: itemOverrides?.newPrice ?? null,
    }
  })
}

export const fakeBills: FakeBillRecord[] = [
  {
    id: "BL-001",
    branchId: "BR-001",
    branchName: "Central Library & Bookshop",
    companyName: "PageTurner Wholesale",
    billDate: "2026-01-12T09:15:00",
    phoneNumber: "+1 (617) 555-4401",
    price: 1240.5,
    productCount: 5,
    imageUrl: null,
    addedBy: { staffId: "ST-001", staffName: "Alice Walker" },
    items: createBillItems(["BK-001", "BK-002", "BK-003"], {
      "BK-001": { quantity: 2, newPrice: 18.5 },
      "BK-002": { quantity: 2 },
      "BK-003": { quantity: 1 },
    }),
  },
  {
    id: "BL-002",
    branchId: "BR-002",
    branchName: "Northside Books",
    companyName: "Harbor Text Supply",
    billDate: "2026-02-03T14:30:00",
    phoneNumber: "+1 (617) 555-8820",
    price: 680.0,
    productCount: 3,
    imageUrl: null,
    addedBy: { staffId: "ST-002", staffName: "Brian Foster" },
    items: createBillItems(["BK-004", "BK-005"], {
      "BK-004": { quantity: 2 },
      "BK-005": { quantity: 1, newPrice: 12.5 },
    }),
  },
  {
    id: "BL-003",
    branchId: "BR-001",
    branchName: "Central Library & Bookshop",
    companyName: "Inkwell Distributors",
    billDate: "2026-02-18T11:45:00",
    phoneNumber: "+1 (617) 555-1199",
    price: 2150.75,
    productCount: 6,
    imageUrl: null,
    addedBy: { staffId: "ST-003", staffName: "Clara Nguyen" },
    items: createBillItems(["BK-006", "BK-007", "BK-008", "BK-009"], {
      "BK-006": { quantity: 1 },
      "BK-007": { quantity: 2, newPrice: 22 },
      "BK-008": { quantity: 2 },
      "BK-009": { quantity: 1 },
    }),
  },
  {
    id: "BL-004",
    branchId: "BR-004",
    branchName: "West End Book Center",
    companyName: "Metro Reading Imports",
    billDate: "2026-03-01T16:20:00",
    phoneNumber: "+1 (617) 555-3300",
    price: 945.25,
    productCount: 4,
    imageUrl: null,
    addedBy: { staffId: "ST-005", staffName: "Eva Chen" },
    items: createBillItems(["BK-010", "BK-011"], {
      "BK-010": { quantity: 2 },
      "BK-011": { quantity: 2, newPrice: 10.5 },
    }),
  },
]
