import type { Bill } from "@/domain/entities/bill/Bill"
import type { BillDetail } from "@/domain/entities/bill/BillDetail"
import type { Result } from "@/domain/result/Result"

export type BillBranchOption = {
  id: string
  name: string
}

export type BillBookOption = {
  id: string
  title: string
  isbn: string
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
  bookIds: string[]
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
