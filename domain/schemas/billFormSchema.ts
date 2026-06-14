import * as z from "zod"

import { validationKeys } from "@/domain/i18n/validationKeys"
import { optionalImageUrlSchema } from "@/domain/schemas/optionalImageSchema"

export const billFormSchema = z.object({
  branchId: z.string().min(1, validationKeys.branchRequired),
  companyName: z.string().min(1, validationKeys.companyNameRequired),
  billDate: z.string().min(1, validationKeys.billDateRequired),
  phoneNumber: z.string().min(1, validationKeys.phoneNumberRequired),
  price: z.number().positive(validationKeys.pricePositive),
  imageUrl: optionalImageUrlSchema,
  bookIds: z.array(z.string()).min(1, validationKeys.selectAtLeastOneBook),
})

export type BillFormValues = z.output<typeof billFormSchema>
