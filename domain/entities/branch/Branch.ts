export type BranchType = "main" | "sub"

export type BranchStatus = "active" | "inactive"

export type Branch = {
  id: string
  branchName: string
  type: BranchType
  email: string
  adminName: string
  parentBranch: string | null
  address: string
  phone: string
  latitude: number | null
  longitude: number | null
  staffCount: number
  bookCount: number
  status: BranchStatus
}

export type MainBranchRequest = {
  id: string
  branchName: string
  phone: string
  email: string
  adminName: string
  adminEmail: string
  submittedDate: string
  note: string
}

export type SubBranchRequest = {
  id: string
  parentBranchName: string
  branchName: string
  phone: string
  email: string
  adminName: string
  adminEmail: string
  submittedDate: string
  note: string
}

export type BranchStats = {
  totalBranches: number
  mainBranches: number
  subBranches: number
  activeBranches: number
  inactiveBranches: number
}
