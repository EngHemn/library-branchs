import type { UpdateBranchInput } from "@/domain/repositories/BranchManagementRepository"
import type { Result } from "@/domain/result/Result"

export type BranchFormErrors = {
  branchName: string | null
  email: string | null
  adminName: string | null
  address: string | null
  phone: string | null
  parentBranch: string | null
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

export function validateBranchForm(
  input: UpdateBranchInput,
  branchType: "main" | "sub"
): Result<UpdateBranchInput> {
  const errors: BranchFormErrors = {
    branchName: input.branchName.trim()
      ? null
      : "Branch name is required",
    email: validateEmail(input.email),
    adminName: input.adminName.trim()
      ? null
      : "Admin name is required",
    address: input.address.trim()
      ? null
      : "Address is required",
    phone: validatePhone(input.phone),
    parentBranch:
      branchType === "sub" && !input.parentBranch
        ? "Parent branch is required for sub branches"
        : null,
    password:
      input.password !== undefined && input.password.trim().length > 0 && input.password.trim().length < 6
        ? "Password must be at least 6 characters"
        : null,
  }

  const hasErrors = Object.values(errors).some(
    (error) => error !== null
  )

  if (hasErrors) {
    const firstError = Object.values(errors).find(
      (error) => error !== null
    )

    return {
      success: false,
      error: firstError ?? "Please fix the form errors",
    }
  }

  return {
    success: true,
    data: {
      branchName: input.branchName.trim(),
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

export function getFieldErrors(
  input: UpdateBranchInput,
  branchType: "main" | "sub"
): BranchFormErrors {
  return {
    branchName: input.branchName.trim()
      ? null
      : "Branch name is required",
    email: validateEmail(input.email),
    adminName: input.adminName.trim()
      ? null
      : "Admin name is required",
    address: input.address.trim()
      ? null
      : "Address is required",
    phone: validatePhone(input.phone),
    parentBranch:
      branchType === "sub" && !input.parentBranch
        ? "Parent branch is required for sub branches"
        : null,
    password:
      input.password !== undefined && input.password.trim().length > 0 && input.password.trim().length < 6
        ? "Password must be at least 6 characters"
        : null,
  }
}
