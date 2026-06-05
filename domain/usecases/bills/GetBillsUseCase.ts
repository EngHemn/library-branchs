import type { Bill } from "@/domain/entities/bill/Bill"
import type { BillDetail } from "@/domain/entities/bill/BillDetail"
import type {
  BillFormOptions,
  BillManagementRepository,
  CreateBillInput,
  UpdateBillInput,
} from "@/domain/repositories/BillManagementRepository"
import type { Result } from "@/domain/result/Result"

export class GetBillsUseCase {
  constructor(
    private readonly billManagementRepository: BillManagementRepository
  ) {}

  getBills(): Promise<Result<Bill[]>> {
    return this.billManagementRepository.getBills()
  }

  getBillById(billId: string): Promise<Result<BillDetail | null>> {
    return this.billManagementRepository.getBillById(billId)
  }

  getBillFormOptions(): Promise<Result<BillFormOptions>> {
    return this.billManagementRepository.getBillFormOptions()
  }

  createBill(input: CreateBillInput): Promise<Result<Bill>> {
    return this.billManagementRepository.createBill(input)
  }

  updateBill(input: UpdateBillInput): Promise<Result<Bill>> {
    return this.billManagementRepository.updateBill(input)
  }

  deleteBill(billId: string): Promise<Result<null>> {
    return this.billManagementRepository.deleteBill(billId)
  }
}
