import type { Bill } from "@/domain/entities/bill/Bill"

export type FakeBillRecord = Bill & {
  bookIds: string[]
}

export const fakeBills: FakeBillRecord[] = [
  {
    id: "BL-001",
    branchId: "BR-001",
    branchName: "Central Library & Bookshop",
    companyName: "PageTurner Wholesale",
    billDate: "2026-01-12",
    phoneNumber: "+1 (617) 555-4401",
    price: 1240.5,
    productCount: 3,
    imageUrl: null,
    bookIds: ["BK-001", "BK-002", "BK-003"],
  },
  {
    id: "BL-002",
    branchId: "BR-002",
    branchName: "Northside Books",
    companyName: "Harbor Text Supply",
    billDate: "2026-02-03",
    phoneNumber: "+1 (617) 555-8820",
    price: 680.0,
    productCount: 2,
    imageUrl: null,
    bookIds: ["BK-004", "BK-005"],
  },
  {
    id: "BL-003",
    branchId: "BR-001",
    branchName: "Central Library & Bookshop",
    companyName: "Inkwell Distributors",
    billDate: "2026-02-18",
    phoneNumber: "+1 (617) 555-1199",
    price: 2150.75,
    productCount: 4,
    imageUrl: null,
    bookIds: ["BK-006", "BK-007", "BK-008", "BK-009"],
  },
  {
    id: "BL-004",
    branchId: "BR-004",
    branchName: "West End Book Center",
    companyName: "Metro Reading Imports",
    billDate: "2026-03-01",
    phoneNumber: "+1 (617) 555-3300",
    price: 945.25,
    productCount: 2,
    imageUrl: null,
    bookIds: ["BK-010", "BK-011"],
  },
]
