import * as z from "zod"

import { validationKeys } from "@/domain/i18n/validationKeys"

export const bookingFormSchema = z.object({
  bookId: z.string().min(1, validationKeys.bookRequired),
  branchId: z.string().min(1, validationKeys.branchRequired),
  memberId: z.string().min(1, validationKeys.memberRequired),
  bookingType: z.enum(["inside", "outside"]),
  dueDate: z.string().min(1, validationKeys.dueDateRequired),
  status: z.enum(["reserved", "borrowed", "returned", "overdue", "cancelled"]),
  notes: z.string(),
})

export type BookingFormInput = z.input<typeof bookingFormSchema>
export type BookingFormValues = z.output<typeof bookingFormSchema>
