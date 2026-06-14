import * as z from "zod"

import { validationKeys } from "@/domain/i18n/validationKeys"

export const createStockFormSchema = z.object({
  bookId: z.string().min(1, validationKeys.bookRequired),
  branchId: z.string().min(1, validationKeys.branchRequired),
  subBranchId: z.string().default("none"),
  initialStock: z.coerce.number().int().min(0, validationKeys.initialStockNegative),
  minStock: z.coerce.number().int().min(1, validationKeys.minStockMin),
})

export const editStockFormSchema = z.object({
  quantity: z.coerce.number().int().min(0, validationKeys.quantityNegative),
  minStock: z.coerce.number().int().min(1, validationKeys.minStockMin),
  notes: z.string().max(500, validationKeys.notesMaxLength).default(""),
})

export type CreateStockFormValues = z.output<typeof createStockFormSchema>
export type EditStockFormValues = z.output<typeof editStockFormSchema>
