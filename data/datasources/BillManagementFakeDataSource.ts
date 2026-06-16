import {
  findLibraryBookById,
  getLibraryBooksSnapshot,
} from "@/data/shared/libraryBooksStore"
import { fakeBills, type FakeBillRecord } from "@/data/fake/fakeBills"
import { fakeBranches } from "@/data/fake/fakeBranches"
import { toBillDetail } from "@/data/mappers/billDetailMapper"
import type { Bill } from "@/domain/entities/bill/Bill"
import type { BillDetail } from "@/domain/entities/bill/BillDetail"
import type { BillLineItem } from "@/domain/entities/bill/BillLineItem"
import type {
  BillFormOptions,
  CreateBillInput,
  UpdateBillInput,
} from "@/domain/repositories/BillManagementRepository"
import type { Result } from "@/domain/result/Result"
import { toBillDateTime } from "@/presentation/components/bills/billDisplay"

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

let nextBillId = 100

function toBillListItem(record: FakeBillRecord): Bill {
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
    addedBy: record.addedBy,
  }
}

function normalizeBillItems(items: BillLineItem[]): BillLineItem[] {
  const normalized: BillLineItem[] = []

  for (const item of items) {
    const existingIndex = normalized.findIndex((entry) => entry.bookId === item.bookId)
    if (existingIndex === -1) {
      normalized.push({
        bookId: item.bookId,
        quantity: item.quantity,
        initialPrice: item.initialPrice,
        newPrice: item.newPrice,
      })
      continue
    }

    normalized[existingIndex] = {
      ...normalized[existingIndex],
      quantity: item.quantity,
      initialPrice: item.initialPrice,
      newPrice: item.newPrice,
    }
  }

  return normalized
}

function getProductCount(items: BillLineItem[]): number {
  return items.reduce((total, item) => total + item.quantity, 0)
}

export class BillManagementFakeDataSource {
  private bills: FakeBillRecord[] = fakeBills.map((bill) => ({
    ...bill,
    items: bill.items.map((item) => ({ ...item })),
  }))

  async getBills(): Promise<Result<Bill[]>> {
    await delay(300)
    return {
      success: true,
      data: this.bills.map((bill) => toBillListItem(bill)),
    }
  }

  async getBillById(billId: string): Promise<Result<BillDetail | null>> {
    await delay(250)
    const bill = this.bills.find((item) => item.id === billId)
    return {
      success: true,
      data: bill
        ? toBillDetail({
            ...bill,
            items: bill.items.map((item) => ({ ...item })),
          })
        : null,
    }
  }

  async getBillFormOptions(): Promise<Result<BillFormOptions>> {
    await delay(200)
    return {
      success: true,
      data: {
        branches: fakeBranches
          .filter((branch) => branch.status === "active")
          .map((branch) => ({
            id: branch.id,
            name: branch.branchName,
          })),
        books: getLibraryBooksSnapshot().map((book) => ({
          id: book.id,
          title: book.title,
          isbn: book.isbn,
          price: book.price,
          stock: book.stock,
        })),
      },
    }
  }

  async createBill(input: CreateBillInput): Promise<Result<Bill>> {
    await delay(400)

    const branch = fakeBranches.find((item) => item.id === input.branchId)
    if (!branch) {
      return { success: false, error: "Selected branch was not found." }
    }

    const items = normalizeBillItems(input.items)
    const missingBook = items.find((item) => !findLibraryBookById(item.bookId))
    if (missingBook) {
      return { success: false, error: "One or more selected books could not be found." }
    }

    const newBill: FakeBillRecord = {
      id: `BL-${String(nextBillId++)}`,
      branchId: branch.id,
      branchName: branch.branchName,
      companyName: input.companyName.trim(),
      billDate: toBillDateTime(input.billDate),
      phoneNumber: input.phoneNumber.trim(),
      price: input.price,
      productCount: getProductCount(items),
      imageUrl: input.imageUrl ?? null,
      addedBy: input.addedBy,
      items,
    }

    this.bills.unshift(newBill)
    return { success: true, data: toBillListItem(newBill) }
  }

  async updateBill(input: UpdateBillInput): Promise<Result<Bill>> {
    await delay(400)

    const billIndex = this.bills.findIndex((item) => item.id === input.id)
    if (billIndex === -1) {
      return { success: false, error: "Bill not found." }
    }

    const branch = fakeBranches.find((item) => item.id === input.branchId)
    if (!branch) {
      return { success: false, error: "Selected branch was not found." }
    }

    const items = normalizeBillItems(input.items)
    const missingBook = items.find((item) => !findLibraryBookById(item.bookId))
    if (missingBook) {
      return { success: false, error: "One or more selected books could not be found." }
    }

    const currentBill = this.bills[billIndex]
    const updatedBill: FakeBillRecord = {
      ...currentBill,
      branchId: branch.id,
      branchName: branch.branchName,
      companyName: input.companyName.trim(),
      billDate: toBillDateTime(input.billDate, currentBill.billDate),
      phoneNumber: input.phoneNumber.trim(),
      price: input.price,
      productCount: getProductCount(items),
      imageUrl: input.imageUrl ?? currentBill.imageUrl ?? null,
      items,
    }

    this.bills[billIndex] = updatedBill
    return { success: true, data: toBillListItem(updatedBill) }
  }

  async deleteBill(billId: string): Promise<Result<null>> {
    await delay(250)
    const exists = this.bills.some((bill) => bill.id === billId)
    if (!exists) {
      return { success: false, error: "Bill could not be found." }
    }

    this.bills = this.bills.filter((bill) => bill.id !== billId)
    return { success: true, data: null }
  }
}
