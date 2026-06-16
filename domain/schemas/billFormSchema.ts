import * as z from "zod"

import { validationKeys } from "@/domain/i18n/validationKeys"
import { optionalImageUrlSchema } from "@/domain/schemas/optionalImageSchema"

export const billLineItemFormSchema = z.object({
  bookId: z.string().min(1, validationKeys.bookRequired),
  quantity: z.number().int().min(1, validationKeys.quantityMin),
  initialPrice: z.number().positive(validationKeys.pricePositive),
  newPrice: z.number().positive(validationKeys.pricePositive).nullable(),
})

export const billFormSchema = z.object({
  branchId: z.string().min(1, validationKeys.branchRequired),
  companyName: z.string().min(1, validationKeys.companyNameRequired),
  billDate: z.string().min(1, validationKeys.billDateRequired),
  phoneNumber: z.string().min(1, validationKeys.phoneNumberRequired),
  price: z.number().positive(validationKeys.pricePositive),
  imageUrl: optionalImageUrlSchema,
  items: z.array(billLineItemFormSchema).min(1, validationKeys.selectAtLeastOneBook),
})

export type BillFormLineItem = z.output<typeof billLineItemFormSchema>
export type BillFormValues = z.output<typeof billFormSchema>
