import * as z from "zod"

export const createStockFormSchema = z.object({
  bookId: z.string().min(1, "Book is required"),
  branchId: z.string().min(1, "Branch is required"),
  subBranchId: z.string().default("none"),
  initialStock: z.coerce.number().int().min(0, "Initial stock cannot be negative"),
  minStock: z.coerce.number().int().min(1, "Minimum stock must be at least 1"),
})

export const editStockFormSchema = z.object({
  quantity: z.coerce.number().int().min(0, "Quantity cannot be negative"),
  minStock: z.coerce.number().int().min(1, "Minimum stock must be at least 1"),
  notes: z.string().max(500, "Notes cannot exceed 500 characters").default(""),
})

export type CreateStockFormValues = z.output<typeof createStockFormSchema>
export type EditStockFormValues = z.output<typeof editStockFormSchema>
