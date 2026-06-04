export const MAIN_BRANCH_ONLY_DENIED_PATH = "/dashboard/main-branch-only"

const mainBranchOnlyPrefix = "/dashboard/branches"

export function isMainBranchOnlyPath(pathname: string): boolean {
  return (
    pathname === mainBranchOnlyPrefix ||
    pathname.startsWith(`${mainBranchOnlyPrefix}/`)
  )
}
