import type { CreateStaffInput } from "@/domain/repositories/StaffManagementRepository"
import type { Result } from "@/domain/result/Result"

export type CreateStaffFormErrors = {
  staffName: string | null
  role: string | null
  branch: string | null
  email: string | null
  phone: string | null
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validateEmail(email: string): string | null {
  if (!email.trim()) {
    return "Email is required"
  }

  if (!EMAIL_PATTERN.test(email.trim())) {
    return "Enter a valid email address"
  }

  return null
}

function validatePhone(phone: string): string | null {
  if (!phone.trim()) {
    return "Phone number is required"
  }

  if (phone.trim().length < 7) {
    return "Phone number is too short"
  }

  return null
}

export function validateCreateStaffForm(
  input: CreateStaffInput
): Result<CreateStaffInput> {
  const errors = getCreateStaffFieldErrors(input)

  const hasErrors = Object.values(errors).some((error) => error !== null)

  if (hasErrors) {
    const firstError = Object.values(errors).find((error) => error !== null)

    return {
      success: false,
      error: firstError ?? "Please fix the form errors",
    }
  }

  return {
    success: true,
    data: {
      staffName: input.staffName.trim(),
      role: input.role,
      branchId: input.branchId,
      branch: input.branch,
      email: input.email.trim(),
      phone: input.phone.trim(),
    },
  }
}

export function getCreateStaffFieldErrors(
  input: CreateStaffInput
): CreateStaffFormErrors {
  return {
    staffName: input.staffName.trim() ? null : "Staff name is required",
    role: input.role ? null : "Role is required",
    branch: input.branchId ? null : "Branch is required",
    email: validateEmail(input.email),
    phone: validatePhone(input.phone),
  }
}
