import * as z from "zod"

import { validationKeys } from "@/domain/i18n/validationKeys"
import { optionalImageUrlSchema } from "@/domain/schemas/optionalImageSchema"

export const authorFormSchema = z.object({
  name: z.string().min(1, validationKeys.nameRequired),
  nationality: z.string().min(1, validationKeys.nationalityRequired),
  dateOfBirth: z.string().min(1, validationKeys.dateOfBirthRequired),
  status: z.enum(["active", "inactive"]),
  biography: z.string().min(1, validationKeys.biographyRequired),
  imageUrl: optionalImageUrlSchema,
})

export type AuthorFormInput = z.input<typeof authorFormSchema>
export type AuthorFormValues = z.output<typeof authorFormSchema>
