export type DashboardMetricTrend = "up" | "down" | "neutral"

export type DashboardMetric = {
  id: string
  label: string
  value: string
  change: string
  helperText: string
  trend: DashboardMetricTrend
}

export type DashboardBranch = {
  id: string
  name: string
}

export type DashboardBookStatus = "available" | "borrowed" | "reserved" | "unavailable"

export type DashboardBook = {
  id: string
  title: string
  author: string
  category: string
  status: DashboardBookStatus
  stock: number
  available: number
  branchId: string
  branchName: string
  addedAt: string
}

export type DashboardMemberStatus = "active" | "inactive" | "suspended"

export type DashboardMember = {
  id: string
  memberName: string
  membershipNumber: string
  branchId: string
  registerBranch: string
  activeBookings: number
  status: DashboardMemberStatus
  registrationDate: string
  registeredAt: string
}

export type DashboardBookingStatus =
  | "reserved"
  | "borrowed"
  | "returned"
  | "overdue"
  | "cancelled"

export type DashboardBookingType = "inside" | "outside"

export type DashboardBooking = {
  id: string
  bookingId: string
  bookTitle: string
  memberName: string
  branchName: string
  branchId: string
  type: DashboardBookingType
  dueDate: string
  status: DashboardBookingStatus
  createdAt: string
}

export type DashboardSale = {
  id: string
  branchName: string
  branchId: string
  itemCount: number
  total: number
  displayDate: string
  createdAt: string
}

export type DashboardStaffRole =
  | "librarian"
  | "manager"
  | "assistant"
  | "clerk"
  | "security"

export type DashboardStaffStatus = "active" | "inactive"

export type DashboardStaff = {
  id: string
  staffName: string
  staffId: string
  role: DashboardStaffRole
  branchId: string
  branchName: string
  email: string
  status: DashboardStaffStatus
}

export type DashboardActivityTone = "default" | "success" | "warning"

export type DashboardActivity = {
  id: string
  title: string
  description: string
  time: string
  tone: DashboardActivityTone
}

export type DashboardChartBar = {
  key?: string
  label: string
  value: number
  color: string
}

export type DashboardChartTrend = {
  date: string
  value: number
}

export type DashboardSummary = {
  metrics: DashboardMetric[]
  branches: DashboardBranch[]
  recentBookings: DashboardBooking[]
  recentBooks: DashboardBook[]
  recentMembers: DashboardMember[]
  recentSales: DashboardSale[]
  recentStaff: DashboardStaff[]
  activities: DashboardActivity[]
  bookingsByStatus: DashboardChartBar[]
  bookingsByType: DashboardChartBar[]
  booksByStatus: DashboardChartBar[]
  booksByCategory: DashboardChartBar[]
  salesTrend: DashboardChartTrend[]
  staffByRole: DashboardChartBar[]
  staffByBranch: DashboardChartBar[]
  stockAlerts: number
  overdueBookings: number
  groupStats: {
    totalGroups: number
    activeGroups: number
    totalAssignedBooks: number
    totalAssignedStaff: number
  }
  needStats: {
    totalRequests: number
    pendingRequests: number
    approvedRequests: number
    criticalRequests: number
    lowStockBooks: number
    outOfStockBooks: number
  }
  criticalNeedRequests: Array<{
    id: string
    name: string
    branchName: string
    priority: string
  }>
  lowStockBooksPreview: Array<{
    id: string
    bookTitle: string
    currentStock: number
    minimumStock: number
  }>
}
