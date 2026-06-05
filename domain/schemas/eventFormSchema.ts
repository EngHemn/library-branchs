import * as z from "zod"

import { optionalImageUrlSchema } from "@/domain/schemas/optionalImageSchema"

const eventStatusValues = [
  "upcoming",
  "active",
  "completed",
  "cancelled",
] as const

export const eventFormSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    description: z.string().min(1, "Description is required"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    status: z.enum(eventStatusValues),
    branchIds: z
      .array(z.string())
      .min(1, "Select at least one branch"),
    imageUrl: optionalImageUrlSchema,
  })
  .refine((values) => values.endDate >= values.startDate, {
    message: "End date must be on or after start date",
    path: ["endDate"],
  })

export type EventFormInput = z.input<typeof eventFormSchema>
export type EventFormValues = z.output<typeof eventFormSchema>
