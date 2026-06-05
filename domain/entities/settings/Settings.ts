export type LibraryInfo = {
  name: string
  address: string
  phone: string
  email: string
  website: string
  logoUrl: string
}

export type BorrowingRules = {
  loanDurationDays: number
  maxRenewals: number
  maxActiveBookings: number
  finePerDay: number
  gracePeriodDays: number
}

export type NotificationSettings = {
  emailNotifications: boolean
  smsNotifications: boolean
  overdueReminders: boolean
  newMemberWelcome: boolean
  dueDateReminders: boolean
}

export type Settings = {
  id: string
  libraryInfo: LibraryInfo
  borrowingRules: BorrowingRules
  notifications: NotificationSettings
  updatedAt: string
}
