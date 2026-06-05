export type CategoryStatus = "active" | "inactive"

export type Category = {
  id: string
  name: string
  description: string
  totalBooks: number
  status: CategoryStatus
}
