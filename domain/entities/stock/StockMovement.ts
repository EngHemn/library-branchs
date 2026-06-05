export type MovementType =
  | "stock_added"
  | "stock_reduced"
  | "transfer"
  | "sale"
  | "return"
  | "damage"
  | "manual_adjustment"

export type StockMovement = {
  id: string
  movementType: MovementType
  bookId: string
  bookTitle: string
  fromBranchId: string | null
  fromBranchName: string | null
  toBranchId: string | null
  toBranchName: string | null
  quantity: number
  previousStock: number
  newStock: number
  userId: string
  userName: string
  createdAt: string
  notes: string | null
}
