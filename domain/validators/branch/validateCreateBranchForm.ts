import type { CreateBranchInput } from "@/domain/repositories/BranchManagementRepository"
import type { Result } from "@/domain/result/Result"

export type CreateBranchFormErrors = {
  branchName: string | null
  email: string | null
  adminName: string | null
  address: string | null
  phone: string | null
  parentBranch: string | null
  location: string | null
  password: string | null
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

export function validateCreateBranchForm(
  input: CreateBranchInput
): Result<CreateBranchInput> {
  const errors = getCreateBranchFieldErrors(input)

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
      branchName: input.branchName.trim(),
      type: input.type,
      email: input.email.trim(),
      adminName: input.adminName.trim(),
      parentBranch: input.parentBranch,
      address: input.address.trim(),
      phone: input.phone.trim(),
      latitude: input.latitude,
      longitude: input.longitude,
      password: input.password,
    },
  }
}

export function getCreateBranchFieldErrors(
  input: CreateBranchInput
): CreateBranchFormErrors {
  return {
    branchName: input.branchName.trim() ? null : "Branch name is required",
    email: validateEmail(input.email),
    adminName: input.adminName.trim() ? null : "Admin name is required",
    address: input.address.trim() ? null : "Address is required",
    phone: validatePhone(input.phone),
    parentBranch:
      input.type === "sub" && !input.parentBranch
        ? "Parent branch is required for sub branches"
        : null,
    location:
      input.latitude === null || input.longitude === null
        ? "Branch location is required"
        : null,
    password:
      input.password.trim().length < 6
        ? "Password must be at least 6 characters"
        : null,
  }
}
