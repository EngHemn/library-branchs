import * as z from "zod"

export const memberFormSchema = z.object({
  memberName: z.string().min(1, "Name is required"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(1, "Phone is required"),
  branchId: z.string().min(1, "Register branch is required"),
  address: z.string().min(1, "Address is required"),
  status: z.enum(["active", "inactive", "suspended"]),
})

export type MemberFormInput = z.input<typeof memberFormSchema>
export type MemberFormValues = z.output<typeof memberFormSchema>
