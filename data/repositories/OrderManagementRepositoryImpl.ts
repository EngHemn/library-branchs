import type { OrderManagementFakeDataSource } from "@/data/datasources/OrderManagementFakeDataSource"
import type { Order } from "@/domain/entities/order/Order"
import type { OrderDetail } from "@/domain/entities/order/OrderDetail"
import type {
  CreateOrderInput,
  OrderFormOptions,
  OrderManagementRepository,
  UpdateOrderInput,
} from "@/domain/repositories/OrderManagementRepository"
import type { Result } from "@/domain/result/Result"

export class OrderManagementRepositoryImpl implements OrderManagementRepository {
  constructor(private readonly dataSource: OrderManagementFakeDataSource) {}

  getOrders(): Promise<Result<Order[]>> {
    return this.dataSource.getOrders()
  }

  getOrderById(orderId: string): Promise<Result<OrderDetail | null>> {
    return this.dataSource.getOrderById(orderId)
  }

  getOrderFormOptions(): Promise<Result<OrderFormOptions>> {
    return this.dataSource.getOrderFormOptions()
  }

  createOrder(input: CreateOrderInput): Promise<Result<Order>> {
    return this.dataSource.createOrder(input)
  }

  updateOrder(input: UpdateOrderInput): Promise<Result<Order>> {
    return this.dataSource.updateOrder(input)
  }

  deleteOrder(orderId: string): Promise<Result<null>> {
    return this.dataSource.deleteOrder(orderId)
  }
}
