import * as z from "zod"

export const bookingFormSchema = z.object({
  bookId: z.string().min(1, "Book is required"),
  branchId: z.string().min(1, "Branch is required"),
  memberId: z.string().min(1, "Member is required"),
  bookingType: z.enum(["inside", "outside"]),
  dueDate: z.string().min(1, "Due date is required"),
  status: z.enum(["reserved", "borrowed", "returned", "overdue", "cancelled"]),
  notes: z.string(),
})

export type BookingFormInput = z.input<typeof bookingFormSchema>
export type BookingFormValues = z.output<typeof bookingFormSchema>
