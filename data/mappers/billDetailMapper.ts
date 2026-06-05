import { findLibraryBookById } from "@/data/shared/libraryBooksStore"
import type { FakeBillRecord } from "@/data/fake/fakeBills"
import type { BillDetail } from "@/domain/entities/bill/BillDetail"

export function toBillDetail(record: FakeBillRecord): BillDetail {
  const products = record.bookIds.map((bookId) => {
    const book = findLibraryBookById(bookId)
    return {
      bookId,
      title: book?.title ?? "Unknown book",
      isbn: book?.isbn ?? "—",
    }
  })

  return {
    id: record.id,
    branchId: record.branchId,
    branchName: record.branchName,
    companyName: record.companyName,
    billDate: record.billDate,
    phoneNumber: record.phoneNumber,
    price: record.price,
    productCount: record.productCount,
    imageUrl: record.imageUrl ?? null,
    bookIds: [...record.bookIds],
    products,
  }
}
