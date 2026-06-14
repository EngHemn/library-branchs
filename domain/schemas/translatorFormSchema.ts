import * as z from "zod"

import { validationKeys } from "@/domain/i18n/validationKeys"
import { optionalImageUrlSchema } from "@/domain/schemas/optionalImageSchema"

export const translatorFormSchema = z.object({
  name: z.string().min(1, validationKeys.nameRequired),
  language: z.string().min(1, validationKeys.languageRequired),
  status: z.enum(["active", "inactive"]),
  biography: z.string().min(1, validationKeys.biographyRequired),
  imageUrl: optionalImageUrlSchema,
})

export type TranslatorFormInput = z.input<typeof translatorFormSchema>
export type TranslatorFormValues = z.output<typeof translatorFormSchema>
