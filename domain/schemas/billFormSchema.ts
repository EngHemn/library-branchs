import * as z from "zod"

import { optionalImageUrlSchema } from "@/domain/schemas/optionalImageSchema"

export const billFormSchema = z.object({
  branchId: z.string().min(1, "Branch is required"),
  companyName: z.string().min(1, "Company name is required"),
  billDate: z.string().min(1, "Bill date is required"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  price: z.number().positive("Price must be greater than zero"),
  imageUrl: optionalImageUrlSchema,
  bookIds: z.array(z.string()).min(1, "Select at least one book"),
})

export type BillFormValues = z.output<typeof billFormSchema>
