import { findLibraryBookById } from "@/data/shared/libraryBooksStore"
import {
  getBranchLocation,
  resolveOrderCoordinates,
} from "@/data/shared/branchLocation"
import type { FakeOrderRecord } from "@/data/fake/fakeOrders"
import type { OrderDetail } from "@/domain/entities/order/OrderDetail"

export function toOrderDetail(record: FakeOrderRecord): OrderDetail {
  const items = record.bookIds.map((bookId) => {
    const book = findLibraryBookById(bookId)
    const savedItem = record.items?.find((item) => item.bookId === bookId)
    return {
      bookId,
      title: book?.title ?? "Unknown book",
      isbn: book?.isbn ?? "—",
      author: book?.author ?? "Unknown author",
      translator: book?.translator ?? null,
      category: book?.category ?? "Uncategorized",
      quantity: savedItem ? savedItem.quantity : 1,
      unitPrice: savedItem ? savedItem.unitPrice : (book?.price ?? 0),
    }
  })

  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0)

  const coordinates = resolveOrderCoordinates(
    record.branchId,
    record.latitude,
    record.longitude
  )

  return {
    id: record.id,
    branchId: record.branchId,
    branchName: record.branchName,
    branchLocation: getBranchLocation(record.branchId),
    supplierName: record.supplierName,
    orderDate: record.orderDate,
    expectedDeliveryDate: record.expectedDeliveryDate,
    status: record.status,
    totalAmount: record.totalAmount,
    itemCount: totalQuantity,
    phoneNumber: record.phoneNumber,
    notes: record.notes ?? null,
    supplierEmail: record.supplierEmail ?? null,
    bookIds: [...record.bookIds],
    latitude: coordinates.latitude,
    longitude: coordinates.longitude,
    items,
  }
}
