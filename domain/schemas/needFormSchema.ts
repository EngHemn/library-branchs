import * as z from "zod"

import { NEED_CATEGORIES } from "@/domain/entities/need/NeedCategory"
import { NEED_PRIORITIES } from "@/domain/entities/need/NeedPriority"
import { optionalImageUrlSchema } from "@/domain/schemas/optionalImageSchema"

export const needFormSchema = z.object({
  name: z.string().min(1, "Need name is required"),
  category: z.enum(NEED_CATEGORIES, {
    message: "Category is required",
  }),
  description: z.string(),
  quantity: z.coerce.number().int().min(1, "Quantity must be at least 1"),
  priority: z.enum(NEED_PRIORITIES),
  branchId: z.string().min(1, "Branch is required"),
  requestedBy: z.string().min(1, "Requested by is required"),
  notes: z.string(),
  attachmentUrl: optionalImageUrlSchema,
})

export type NeedFormInput = z.input<typeof needFormSchema>
export type NeedFormValues = z.output<typeof needFormSchema>
