import * as z from "zod"

import { validationKeys } from "@/domain/i18n/validationKeys"

export const categoryFormSchema = z.object({
  name: z.string().min(1, validationKeys.nameRequired),
  description: z.string().min(1, validationKeys.descriptionRequired),
})

export type CategoryFormInput = z.input<typeof categoryFormSchema>
export type CategoryFormValues = z.output<typeof categoryFormSchema>
