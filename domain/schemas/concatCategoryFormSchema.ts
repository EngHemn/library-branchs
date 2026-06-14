import * as z from "zod"

import { validationKeys } from "@/domain/i18n/validationKeys"

export const concatCategoryFormSchema = z.object({
  sourceCategoryIds: z
    .array(z.string())
    .min(2, validationKeys.selectAtLeastTwoCategories),
  name: z.string().min(1, validationKeys.nameRequired),
  description: z.string().min(1, validationKeys.descriptionRequired),
  status: z.enum(["active", "inactive"]),
})

export type ConcatCategoryFormInput = z.input<typeof concatCategoryFormSchema>
export type ConcatCategoryFormValues = z.output<typeof concatCategoryFormSchema>
