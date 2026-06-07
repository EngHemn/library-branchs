import * as z from "zod"

import { ORDER_STATUSES } from "@/domain/entities/order/OrderStatus"

export const orderFormSchema = z.object({
  branchId: z.string().min(1, "Branch is required"),
  supplierName: z.string().min(1, "Supplier name is required"),
  orderDate: z.string().min(1, "Order date is required"),
  expectedDeliveryDate: z.string().min(1, "Expected delivery date is required"),
  status: z.enum(ORDER_STATUSES),
  phoneNumber: z.string().min(1, "Phone number is required"),
  supplierEmail: z
    .string()
    .email("Enter a valid email")
    .optional()
    .or(z.literal("")),
  totalAmount: z.number().positive("Total amount must be greater than zero"),
  notes: z.string().optional(),
  bookIds: z.array(z.string()).min(1, "Select at least one book"),
  latitude: z.number().nullable(),
  longitude: z.number().nullable(),
})

export type OrderFormValues = z.output<typeof orderFormSchema>
