import * as z from "zod"

export const concatCategoryFormSchema = z.object({
  sourceCategoryIds: z
    .array(z.string())
    .min(2, "Select at least two categories to merge"),
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  status: z.enum(["active", "inactive"]),
})

export type ConcatCategoryFormInput = z.input<typeof concatCategoryFormSchema>
export type ConcatCategoryFormValues = z.output<typeof concatCategoryFormSchema>
