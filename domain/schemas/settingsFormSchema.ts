import * as z from "zod"

export const libraryInfoFormSchema = z.object({
  name: z.string().min(1, "Library name is required"),
  address: z.string().min(1, "Address is required"),
  phone: z.string().min(1, "Phone number is required"),
  email: z.string().email("Invalid email address"),
  website: z.string().url("Invalid website URL").or(z.literal("")),
  logoUrl: z.string().url("Invalid logo URL").or(z.literal("")),
})

export const borrowingRulesFormSchema = z.object({
  loanDurationDays: z
    .number()
    .int()
    .min(1, "Minimum 1 day")
    .max(365, "Maximum 365 days"),
  maxRenewals: z.number().int().min(0, "Cannot be negative").max(10),
  maxActiveBookings: z
    .number()
    .int()
    .min(1, "At least 1 booking allowed")
    .max(50),
  finePerDay: z.number().min(0, "Cannot be negative"),
  gracePeriodDays: z.number().int().min(0, "Cannot be negative").max(30),
})

export const notificationsFormSchema = z.object({
  emailNotifications: z.boolean(),
  smsNotifications: z.boolean(),
  overdueReminders: z.boolean(),
  newMemberWelcome: z.boolean(),
  dueDateReminders: z.boolean(),
})

export type LibraryInfoFormValues = z.output<typeof libraryInfoFormSchema>
export type BorrowingRulesFormValues = z.output<typeof borrowingRulesFormSchema>
export type NotificationsFormValues = z.output<typeof notificationsFormSchema>
