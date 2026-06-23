import * as z from "zod"

import { validationKeys } from "@/domain/i18n/validationKeys"
import { optionalImageUrlSchema } from "@/domain/schemas/optionalImageSchema"

const optionalString = z.preprocess(
  (value) => (value === null || value === undefined ? "" : value),
  z.string()
)

const optionalNonNegativeNumber = z.preprocess((value) => {
  if (value === "" || value === null || value === undefined) return 0
  return value
}, z.coerce.number().min(0))

export const bookFormSchema = z.object({
  title: z.string().min(1, validationKeys.titleRequired),
  author: z.string().min(1, validationKeys.authorRequired),
  category: z.string().min(1, validationKeys.categoryRequired),
  publicationDate: z.string().min(1, validationKeys.publicationDateRequired),
  language: optionalString,
  translator: optionalString,
  isbn: optionalString,
  description: optionalString,
  pages: optionalNonNegativeNumber,
  stock: optionalNonNegativeNumber,
  available: optionalNonNegativeNumber,
  minAlert: optionalNonNegativeNumber,
  initialPrice: optionalNonNegativeNumber,
  finalPrice: optionalNonNegativeNumber,
  coverUrl: optionalImageUrlSchema,
  branchId: z.string().min(1, validationKeys.branchRequired),
  locationValues: z.record(z.string(), z.string()).default({}),
})

export type BookFormInput = z.input<typeof bookFormSchema>
export type BookFormValues = z.output<typeof bookFormSchema>
