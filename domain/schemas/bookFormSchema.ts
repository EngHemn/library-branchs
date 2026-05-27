import * as z from "zod"

export const bookFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  language: z.string().min(1, "Language is required"),
  category: z.string().min(1, "Category is required"),
  author: z.string().min(1, "Author is required"),
  translator: z.string().default(""),
  isbn: z.string().min(1, "ISBN is required"),
  description: z.string().min(1, "Description is required"),
  pages: z.coerce.number().min(1, "Pages must be at least 1"),
  publicationDate: z.string().min(1, "Publication date is required"),
})

export type BookFormInput = z.input<typeof bookFormSchema>
export type BookFormValues = z.output<typeof bookFormSchema>
