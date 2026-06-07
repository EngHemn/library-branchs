import type { Order } from "@/domain/entities/order/Order"
import type { OrderDetail } from "@/domain/entities/order/OrderDetail"
import type {
  CreateOrderInput,
  OrderFormOptions,
  OrderManagementRepository,
  UpdateOrderInput,
} from "@/domain/repositories/OrderManagementRepository"
import type { Result } from "@/domain/result/Result"

export class GetOrdersUseCase {
  constructor(
    private readonly orderManagementRepository: OrderManagementRepository
  ) {}

  getOrders(): Promise<Result<Order[]>> {
    return this.orderManagementRepository.getOrders()
  }

  getOrderById(orderId: string): Promise<Result<OrderDetail | null>> {
    return this.orderManagementRepository.getOrderById(orderId)
  }

  getOrderFormOptions(): Promise<Result<OrderFormOptions>> {
    return this.orderManagementRepository.getOrderFormOptions()
  }

  createOrder(input: CreateOrderInput): Promise<Result<Order>> {
    return this.orderManagementRepository.createOrder(input)
  }

  updateOrder(input: UpdateOrderInput): Promise<Result<Order>> {
    return this.orderManagementRepository.updateOrder(input)
  }

  deleteOrder(orderId: string): Promise<Result<null>> {
    return this.orderManagementRepository.deleteOrder(orderId)
  }
}
