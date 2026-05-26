export type AuthorStatus = "active" | "inactive"

export type Author = {
  id: string
  name: string
  nationality: string
  totalBooks: number
  status: AuthorStatus
  branchId: string
}
