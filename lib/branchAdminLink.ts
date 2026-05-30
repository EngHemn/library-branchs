import { fakeStaff } from "@/data/fake/fakeStaff"

export function resolveBranchAdminStaffId(
  branchId: string,
  adminName: string
): string | null {
  const branchStaff = fakeStaff.filter((member) => member.branchId === branchId)

  const byName = branchStaff.find((member) => member.staffName === adminName)
  if (byName) {
    return byName.id
  }

  const branchAdmin = branchStaff.find((member) => member.role === "branch_admin")
  if (branchAdmin) {
    return branchAdmin.id
  }

  const activeStaff = branchStaff.find((member) => member.status === "active")
  return activeStaff?.id ?? null
}

export function getBranchAdminStaffHref(
  branchId: string,
  adminName: string
): string | null {
  const staffId = resolveBranchAdminStaffId(branchId, adminName)

  if (!staffId) {
    return null
  }

  return `/dashboard/staff/${staffId}`
}
