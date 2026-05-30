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

export type BranchRequestReply = {
  id: string
  message: string
  sentAt: string
  sentBy: string
}

export type MainBranchRequest = {
  id: string
  branchName: string
  phone: string
  email: string
  adminName: string
  adminEmail: string
  address: string
  latitude: number | null
  longitude: number | null
  submittedDate: string
  note: string
  replies: BranchRequestReply[]
}

export type SubBranchRequest = {
  id: string
  parentBranchName: string
  branchName: string
  phone: string
  email: string
  adminName: string
  adminEmail: string
  address: string
  latitude: number | null
  longitude: number | null
  submittedDate: string
  note: string
  replies: BranchRequestReply[]
}

export type BranchStats = {
  totalBranches: number
  mainBranches: number
  subBranches: number
  activeBranches: number
  inactiveBranches: number
}
