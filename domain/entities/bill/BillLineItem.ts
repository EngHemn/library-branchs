export type BillLineItem = {
  bookId: string
  quantity: number
  initialPrice: number
  newPrice: number | null
}

export function getBillLineUnitPrice(item: Pick<BillLineItem, "initialPrice" | "newPrice">): number {
  if (item.newPrice != null && item.newPrice > 0) {
    return item.newPrice
  }

  return item.initialPrice
}

export function getBillLineFinalPrice(item: BillLineItem): number {
  return getBillLineUnitPrice(item) * item.quantity
}
