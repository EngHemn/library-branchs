import * as z from "zod"

import { validationKeys } from "@/domain/i18n/validationKeys"
import { optionalImageUrlSchema } from "@/domain/schemas/optionalImageSchema"

const groupStatusValues = ["active", "inactive"] as const

export const groupFormSchema = z.object({
  name: z.string().min(1, validationKeys.groupNameRequired),
  description: z.string(),
  status: z.enum(groupStatusValues),
  imageUrl: optionalImageUrlSchema,
  branchId: z.string().min(1, validationKeys.branchRequired),
  bookIds: z.array(z.string()),
  staffIds: z.array(z.string()),
})

export type GroupFormInput = z.input<typeof groupFormSchema>
export type GroupFormValues = z.output<typeof groupFormSchema>
