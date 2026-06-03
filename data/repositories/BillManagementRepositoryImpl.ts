import type { BillManagementFakeDataSource } from "@/data/datasources/BillManagementFakeDataSource"
import type { Bill } from "@/domain/entities/bill/Bill"
import type { BillDetail } from "@/domain/entities/bill/BillDetail"
import type {
  BillFormOptions,
  BillManagementRepository,
  CreateBillInput,
  UpdateBillInput,
} from "@/domain/repositories/BillManagementRepository"
import type { Result } from "@/domain/result/Result"

export class BillManagementRepositoryImpl implements BillManagementRepository {
  constructor(private readonly dataSource: BillManagementFakeDataSource) {}

  getBills(): Promise<Result<Bill[]>> {
    return this.dataSource.getBills()
  }

  getBillById(billId: string): Promise<Result<BillDetail | null>> {
    return this.dataSource.getBillById(billId)
  }

  getBillFormOptions(): Promise<Result<BillFormOptions>> {
    return this.dataSource.getBillFormOptions()
  }

  createBill(input: CreateBillInput): Promise<Result<Bill>> {
    return this.dataSource.createBill(input)
  }

  updateBill(input: UpdateBillInput): Promise<Result<Bill>> {
    return this.dataSource.updateBill(input)
  }

  deleteBill(billId: string): Promise<Result<null>> {
    return this.dataSource.deleteBill(billId)
  }
}
