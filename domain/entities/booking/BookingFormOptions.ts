export type BookingFormOption = {
  value: string
  label: string
  searchText: string
  branchId?: string
}

export type BookingFormOptions = {
  books: BookingFormOption[]
  branches: BookingFormOption[]
  members: BookingFormOption[]
}
