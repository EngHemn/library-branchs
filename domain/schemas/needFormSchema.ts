import * as z from "zod"

import { validationKeys } from "@/domain/i18n/validationKeys"
import { NEED_CATEGORIES } from "@/domain/entities/need/NeedCategory"
import { NEED_PRIORITIES } from "@/domain/entities/need/NeedPriority"
import { optionalImageUrlSchema } from "@/domain/schemas/optionalImageSchema"

export const needFormSchema = z.object({
  name: z.string().min(1, validationKeys.needNameRequired),
  category: z.enum(NEED_CATEGORIES, {
    message: validationKeys.categoryRequired,
  }),
  description: z.string(),
  quantity: z.coerce.number().int().min(1, validationKeys.quantityMin),
  priority: z.enum(NEED_PRIORITIES),
  branchId: z.string().min(1, validationKeys.branchRequired),
  requestedBy: z.string().min(1, validationKeys.requestedByRequired),
  notes: z.string(),
  attachmentUrl: optionalImageUrlSchema,
})

export type NeedFormInput = z.input<typeof needFormSchema>
export type NeedFormValues = z.output<typeof needFormSchema>
