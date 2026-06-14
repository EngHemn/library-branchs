import * as z from "zod"

import { validationKeys } from "@/domain/i18n/validationKeys"

const positiveQuantity = z.preprocess(
  (value) => {
    if (value === "" || value === null || value === undefined) return 1
    return value
  },
  z.coerce.number().min(1, validationKeys.quantityMin)
)

export const shelfBookFormSchema = z.object({
  bookId: z.string().min(1, validationKeys.bookRequired),
  bayValue: z.string().min(1, validationKeys.bayRequired),
  slotValue: z.string().min(1, validationKeys.slotRequired),
  quantity: positiveQuantity,
})

export type ShelfBookFormInput = z.input<typeof shelfBookFormSchema>
export type ShelfBookFormValues = z.output<typeof shelfBookFormSchema>
