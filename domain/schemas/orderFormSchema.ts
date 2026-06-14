import * as z from "zod"

import { validationKeys } from "@/domain/i18n/validationKeys"
import { ORDER_STATUSES } from "@/domain/entities/order/OrderStatus"

export const orderFormSchema = z.object({
  branchId: z.string().min(1, validationKeys.branchRequired),
  supplierName: z.string().min(1, validationKeys.supplierNameRequired),
  orderDate: z.string().min(1, validationKeys.orderDateRequired),
  expectedDeliveryDate: z
    .string()
    .min(1, validationKeys.expectedDeliveryDateRequired),
  status: z.enum(ORDER_STATUSES),
  phoneNumber: z.string().min(1, validationKeys.phoneNumberRequired),
  supplierEmail: z
    .string()
    .email(validationKeys.emailInvalid)
    .optional()
    .or(z.literal("")),
  totalAmount: z.number().positive(validationKeys.totalAmountPositive),
  notes: z.string().optional(),
  bookIds: z.array(z.string()).min(1, validationKeys.selectAtLeastOneBook),
  latitude: z.number().nullable(),
  longitude: z.number().nullable(),
})

export type OrderFormValues = z.output<typeof orderFormSchema>
