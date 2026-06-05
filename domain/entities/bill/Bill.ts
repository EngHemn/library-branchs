export type Bill = {
  id: string
  branchId: string
  branchName: string
  companyName: string
  billDate: string
  phoneNumber: string
  price: number
  productCount: number
  imageUrl?: string | null
}
