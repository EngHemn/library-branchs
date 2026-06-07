import * as z from "zod"

const positiveQuantity = z.preprocess(
  (value) => {
    if (value === "" || value === null || value === undefined) return 1
    return value
  },
  z.coerce.number().min(1, "Quantity must be at least 1")
)

export const shelfBookFormSchema = z.object({
  bookId: z.string().min(1, "Book is required"),
  bayValue: z.string().min(1, "Bay is required"),
  slotValue: z.string().min(1, "Slot is required"),
  quantity: positiveQuantity,
})

export type ShelfBookFormInput = z.input<typeof shelfBookFormSchema>
export type ShelfBookFormValues = z.output<typeof shelfBookFormSchema>
