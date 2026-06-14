import * as z from "zod"

import { validationKeys } from "@/domain/i18n/validationKeys"

export const memberFormSchema = z.object({
  memberName: z.string().min(1, validationKeys.nameRequired),
  email: z.string().email(validationKeys.emailInvalid),
  phone: z.string().min(1, validationKeys.phoneRequired),
  address: z.string().min(1, validationKeys.addressRequired),
  status: z.enum(["active", "inactive", "suspended"]),
})

export type MemberFormInput = z.input<typeof memberFormSchema>
export type MemberFormValues = z.output<typeof memberFormSchema>
