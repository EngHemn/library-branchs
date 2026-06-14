import * as z from "zod"

import { validationKeys } from "@/domain/i18n/validationKeys"

export const libraryInfoFormSchema = z.object({
  name: z.string().min(1, validationKeys.libraryNameRequired),
  address: z.string().min(1, validationKeys.addressRequired),
  phone: z.string().min(1, validationKeys.phoneNumberRequired),
  email: z.string().email(validationKeys.emailInvalid),
  website: z.string().url(validationKeys.websiteInvalid).or(z.literal("")),
  logoUrl: z.string().url(validationKeys.logoUrlInvalid).or(z.literal("")),
})

export const borrowingRulesFormSchema = z.object({
  loanDurationDays: z
    .number()
    .int()
    .min(1, validationKeys.loanDurationMin)
    .max(365, validationKeys.loanDurationMax),
  maxRenewals: z.number().int().min(0, validationKeys.cannotBeNegative).max(10),
  maxActiveBookings: z
    .number()
    .int()
    .min(1, validationKeys.atLeastOneBooking)
    .max(50),
  finePerDay: z.number().min(0, validationKeys.cannotBeNegative),
  gracePeriodDays: z.number().int().min(0, validationKeys.cannotBeNegative).max(30),
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
