export type AuthorStatus = "active" | "inactive"

export type Author = {
  id: string
  name: string
  nationality: string
  dateOfBirth: string
  biography: string
  totalBooks: number
  status: AuthorStatus
  branchId: string
  imageUrl?: string | null
}
