import { findLibraryBookById } from "@/data/shared/libraryBooksStore"
import type { FakeBillRecord } from "@/data/fake/fakeBills"
import type { BillDetail } from "@/domain/entities/bill/BillDetail"
import { getBillLineFinalPrice } from "@/domain/entities/bill/BillLineItem"

export function toBillDetail(record: FakeBillRecord): BillDetail {
  const products = record.items.map((item) => {
    const book = findLibraryBookById(item.bookId)

    return {
      bookId: item.bookId,
      title: book?.title ?? "Unknown book",
      isbn: book?.isbn ?? "—",
      quantity: item.quantity,
      initialPrice: item.initialPrice,
      newPrice: item.newPrice,
      finalPrice: getBillLineFinalPrice(item),
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
    bookIds: record.items.map((item) => item.bookId),
    addedBy: record.addedBy,
    products,
  }
}
