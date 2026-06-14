import * as z from "zod"

import { validationKeys } from "@/domain/i18n/validationKeys"
import { SHELF_TYPES } from "@/domain/entities/shelf/ShelfType"

const positiveNumber = z.preprocess(
  (value) => {
    if (value === "" || value === null || value === undefined) return 1
    return value
  },
  z.coerce.number().min(1, validationKeys.capacityMin)
)

export const shelfDetailsStepSchema = z.object({
  name: z.string().min(1, validationKeys.shelfNameRequired),
  shelfType: z.enum(SHELF_TYPES, {
    message: validationKeys.shelfTypeRequired,
  }),
  branchId: z.string().min(1, validationKeys.branchRequired),
  capacity: positiveNumber,
  status: z.enum(["active", "inactive"]),
})

export const shelfFormSchema = shelfDetailsStepSchema.extend({
  locationValues: z.record(z.string(), z.string()).default({}),
})

export type ShelfFormInput = z.input<typeof shelfFormSchema>
export type ShelfFormValues = z.output<typeof shelfFormSchema>
