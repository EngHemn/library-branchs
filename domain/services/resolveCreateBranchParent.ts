import type { Branch } from "@/domain/entities/branch/Branch"
import type { User } from "@/domain/entities/User"

export function resolveCreateBranchParentBranchName(
  user: User | null,
  branches: Branch[]
): string {
  if (!user) {
    throw new Error("You must be signed in to create a branch.")
  }

  if (user.branchType !== "main") {
    throw new Error("Only main branch administrators can create branches.")
  }

  const parentBranch =
    branches.find((branch) => branch.id === user.branchId) ??
    branches.find((branch) => branch.type === "main")

  if (!parentBranch || parentBranch.type !== "main") {
    throw new Error("Your main branch could not be resolved.")
  }

  return parentBranch.branchName
}
