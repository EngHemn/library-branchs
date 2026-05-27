import * as z from "zod"

export const categoryFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
})

export type CategoryFormInput = z.input<typeof categoryFormSchema>
export type CategoryFormValues = z.output<typeof categoryFormSchema>
