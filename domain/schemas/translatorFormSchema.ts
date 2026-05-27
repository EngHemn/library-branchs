import * as z from "zod"

export const translatorFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  language: z.string().min(1, "Language is required"),
  status: z.enum(["active", "inactive"]),
  biography: z.string().min(1, "Biography is required"),
})

export type TranslatorFormInput = z.input<typeof translatorFormSchema>
export type TranslatorFormValues = z.output<typeof translatorFormSchema>
