import * as z from "zod"

import { optionalImageUrlSchema } from "@/domain/schemas/optionalImageSchema"

export const translatorFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  language: z.string().min(1, "Language is required"),
  status: z.enum(["active", "inactive"]),
  biography: z.string().min(1, "Biography is required"),
  imageUrl: optionalImageUrlSchema,
})

export type TranslatorFormInput = z.input<typeof translatorFormSchema>
export type TranslatorFormValues = z.output<typeof translatorFormSchema>
