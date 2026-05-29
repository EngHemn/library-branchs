import type { Settings } from "@/domain/entities/settings/Settings"

export const fakeSettings: Settings = {
  id: "settings-1",
  libraryInfo: {
    name: "Liba Central Library",
    address: "12 Knowledge Avenue, District 4, Capital City",
    phone: "+1 (555) 234-7890",
    email: "contact@libacentral.org",
    website: "https://libacentral.org",
    logoUrl: "",
  },
  borrowingRules: {
    loanDurationDays: 14,
    maxRenewals: 2,
    maxActiveBookings: 5,
    finePerDay: 0.5,
    gracePeriodDays: 2,
  },
  notifications: {
    emailNotifications: true,
    smsNotifications: false,
    overdueReminders: true,
    newMemberWelcome: true,
    dueDateReminders: true,
  },
  updatedAt: "2025-03-15T10:30:00Z",
}
