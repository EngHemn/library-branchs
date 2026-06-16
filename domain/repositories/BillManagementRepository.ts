import type { Bill, BillAddedBy } from "@/domain/entities/bill/Bill"
import type { BillDetail } from "@/domain/entities/bill/BillDetail"
import type { BillLineItem } from "@/domain/entities/bill/BillLineItem"
import type { Result } from "@/domain/result/Result"

export type BillBranchOption = {
  id: string
  name: string
}

export type BillBookOption = {
  id: string
  title: string
  isbn: string
  price: number
  stock: number
}

export type BillFormOptions = {
  branches: BillBranchOption[]
  books: BillBookOption[]
}

export type CreateBillInput = {
  branchId: string
  companyName: string
  billDate: string
  phoneNumber: string
  price: number
  imageUrl?: string | null
  items: BillLineItem[]
  addedBy: BillAddedBy
}

export type UpdateBillInput = CreateBillInput & {
  id: string
}

export interface BillManagementRepository {
  getBills(): Promise<Result<Bill[]>>
  getBillById(billId: string): Promise<Result<BillDetail | null>>
  getBillFormOptions(): Promise<Result<BillFormOptions>>
  createBill(input: CreateBillInput): Promise<Result<Bill>>
  updateBill(input: UpdateBillInput): Promise<Result<Bill>>
  deleteBill(billId: string): Promise<Result<null>>
}
