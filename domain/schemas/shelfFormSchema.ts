import * as z from "zod"

import { SHELF_TYPES } from "@/domain/entities/shelf/ShelfType"

const positiveNumber = z.preprocess(
  (value) => {
    if (value === "" || value === null || value === undefined) return 1
    return value
  },
  z.coerce.number().min(1, "Capacity must be at least 1")
)

export const shelfDetailsStepSchema = z.object({
  name: z.string().min(1, "Shelf name is required"),
  shelfType: z.enum(SHELF_TYPES, {
    message: "Shelf type is required",
  }),
  branchId: z.string().min(1, "Branch is required"),
  capacity: positiveNumber,
  status: z.enum(["active", "inactive"]),
})

export const shelfFormSchema = shelfDetailsStepSchema.extend({
  locationValues: z.record(z.string(), z.string()).default({}),
})

export type ShelfFormInput = z.input<typeof shelfFormSchema>
export type ShelfFormValues = z.output<typeof shelfFormSchema>
