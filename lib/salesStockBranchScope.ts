import type { StockMovement } from "@/domain/entities/stock/StockMovement"
import type { StockRow } from "@/domain/entities/stock/Stock"
import type { User } from "@/domain/entities/User"
import {
  isBranchScopedDashboardUser,
  resolveUserBranchId,
} from "@/lib/dashboardBranchScope"

export function isSingleBranchManagedUser(
  user: Pick<User, "branchType" | "loginType">
): boolean {
  return isBranchScopedDashboardUser(user)
}

export function scopeStockRowsForUser(
  rows: StockRow[],
  user: User | null
): StockRow[] {
  if (!user) return rows

  const userBranchId = resolveUserBranchId(user)

  if (user.branchType === "sub") {
    return rows.filter((row) => row.subBranchId === userBranchId)
  }

  if (user.loginType === "main_no_sub") {
    return rows.filter(
      (row) => row.branchId === userBranchId && row.subBranchId === null
    )
  }

  return rows.filter((row) => row.branchId === userBranchId)
}

export function scopeStockMovementsForUser(
  movements: StockMovement[],
  user: User | null
): StockMovement[] {
  if (!user || !isSingleBranchManagedUser(user)) return movements

  const userBranchId = resolveUserBranchId(user)

  return movements.filter(
    (movement) =>
      movement.fromBranchId === userBranchId ||
      movement.toBranchId === userBranchId
  )
}
