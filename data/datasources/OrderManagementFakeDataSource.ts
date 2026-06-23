import {
  findLibraryBookById,
  getLibraryBooksSnapshot,
} from "@/data/shared/libraryBooksStore"
import { fakeOrders, type FakeOrderRecord } from "@/data/fake/fakeOrders"
import { fakeBranches } from "@/data/fake/fakeBranches"
import {
  getBranchLocation,
  resolveOrderCoordinates,
} from "@/data/shared/branchLocation"
import { toOrderDetail } from "@/data/mappers/orderDetailMapper"
import type { Order } from "@/domain/entities/order/Order"
import type { OrderDetail } from "@/domain/entities/order/OrderDetail"
import type {
  CreateOrderInput,
  OrderFormOptions,
  UpdateOrderInput,
} from "@/domain/repositories/OrderManagementRepository"
import type { Result } from "@/domain/result/Result"
import { toOrderDateTime } from "@/presentation/components/orders/orderDisplay"

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

let nextOrderId = 100

function toOrderListItem(record: FakeOrderRecord): Order {
  const coordinates = resolveOrderCoordinates(
    record.branchId,
    record.latitude,
    record.longitude
  )

  const totalQuantity = record.items
    ? record.items.reduce((sum, item) => sum + item.quantity, 0)
    : record.bookIds.length

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
    bookIds: [...record.bookIds],
    latitude: coordinates.latitude,
    longitude: coordinates.longitude,
  }
}

export class OrderManagementFakeDataSource {
  private orders: FakeOrderRecord[] = fakeOrders.map((order) => ({
    ...order,
    bookIds: [...order.bookIds],
  }))

  async getOrders(): Promise<Result<Order[]>> {
    await delay(300)
    return {
      success: true,
      data: this.orders.map((order) => toOrderListItem(order)),
    }
  }

  async getOrderById(orderId: string): Promise<Result<OrderDetail | null>> {
    await delay(250)
    const order = this.orders.find((item) => item.id === orderId)
    return {
      success: true,
      data: order
        ? toOrderDetail({ ...order, bookIds: [...order.bookIds] })
        : null,
    }
  }

  async getOrderFormOptions(): Promise<Result<OrderFormOptions>> {
    await delay(200)
    return {
      success: true,
      data: {
        branches: fakeBranches
          .filter((branch) => branch.status === "active")
          .map((branch) => ({
            id: branch.id,
            name: branch.branchName,
            address: branch.address,
            latitude: branch.latitude,
            longitude: branch.longitude,
          })),
        books: getLibraryBooksSnapshot().map((book) => ({
          id: book.id,
          title: book.title,
          isbn: book.isbn,
          author: book.author,
          translator: book.translator,
          category: book.category,
          price: book.price,
        })),
      },
    }
  }

  async createOrder(input: CreateOrderInput): Promise<Result<Order>> {
    await delay(400)

    const branch = fakeBranches.find((item) => item.id === input.branchId)
    if (!branch) {
      return { success: false, error: "Selected branch was not found." }
    }

    const uniqueBookIds = [...new Set(input.bookIds)]
    const missingBook = uniqueBookIds.find(
      (bookId) => !findLibraryBookById(bookId)
    )
    if (missingBook) {
      return {
        success: false,
        error: "One or more selected books could not be found.",
      }
    }

    const coordinates = resolveOrderCoordinates(
      branch.id,
      input.latitude,
      input.longitude
    )

    const totalQuantity = input.items
      ? input.items.reduce((sum, item) => sum + item.quantity, 0)
      : uniqueBookIds.length

    const newOrder: FakeOrderRecord = {
      id: `ORD-${String(nextOrderId++)}`,
      branchId: branch.id,
      branchName: branch.branchName,
      supplierName: input.supplierName.trim(),
      orderDate: toOrderDateTime(input.orderDate),
      expectedDeliveryDate: toOrderDateTime(input.expectedDeliveryDate),
      status: input.status,
      totalAmount: input.totalAmount,
      itemCount: totalQuantity,
      phoneNumber: input.phoneNumber.trim(),
      supplierEmail: input.supplierEmail?.trim() || null,
      notes: input.notes?.trim() || null,
      bookIds: uniqueBookIds,
      items: input.items?.map((item) => ({
        bookId: item.bookId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      })),
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
    }

    this.orders.unshift(newOrder)
    return { success: true, data: toOrderListItem(newOrder) }
  }

  async updateOrder(input: UpdateOrderInput): Promise<Result<Order>> {
    await delay(400)

    const orderIndex = this.orders.findIndex((item) => item.id === input.id)
    if (orderIndex === -1) {
      return { success: false, error: "Order not found." }
    }

    const branch = fakeBranches.find((item) => item.id === input.branchId)
    if (!branch) {
      return { success: false, error: "Selected branch was not found." }
    }

    const uniqueBookIds = [...new Set(input.bookIds)]
    const missingBook = uniqueBookIds.find(
      (bookId) => !findLibraryBookById(bookId)
    )
    if (missingBook) {
      return {
        success: false,
        error: "One or more selected books could not be found.",
      }
    }

    const coordinates = resolveOrderCoordinates(
      branch.id,
      input.latitude,
      input.longitude
    )

    const totalQuantity = input.items
      ? input.items.reduce((sum, item) => sum + item.quantity, 0)
      : uniqueBookIds.length

    const currentOrder = this.orders[orderIndex]
    const updatedOrder: FakeOrderRecord = {
      ...currentOrder,
      branchId: branch.id,
      branchName: branch.branchName,
      supplierName: input.supplierName.trim(),
      orderDate: toOrderDateTime(input.orderDate, currentOrder.orderDate),
      expectedDeliveryDate: toOrderDateTime(
        input.expectedDeliveryDate,
        currentOrder.expectedDeliveryDate
      ),
      status: input.status,
      totalAmount: input.totalAmount,
      itemCount: totalQuantity,
      phoneNumber: input.phoneNumber.trim(),
      supplierEmail: input.supplierEmail?.trim() || null,
      notes: input.notes?.trim() || null,
      bookIds: uniqueBookIds,
      items: input.items?.map((item) => ({
        bookId: item.bookId,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      })),
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
    }

    this.orders[orderIndex] = updatedOrder
    return { success: true, data: toOrderListItem(updatedOrder) }
  }

  async deleteOrder(orderId: string): Promise<Result<null>> {
    await delay(250)
    const exists = this.orders.some((order) => order.id === orderId)
    if (!exists) {
      return { success: false, error: "Order could not be found." }
    }

    this.orders = this.orders.filter((order) => order.id !== orderId)
    return { success: true, data: null }
  }
}
