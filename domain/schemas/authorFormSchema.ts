import * as z from "zod"

export const authorFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  nationality: z.string().min(1, "Nationality is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  status: z.enum(["active", "inactive"]),
  biography: z.string().min(1, "Biography is required"),
})

export type AuthorFormInput = z.input<typeof authorFormSchema>
export type AuthorFormValues = z.output<typeof authorFormSchema>
