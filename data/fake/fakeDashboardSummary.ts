import type { DashboardSummary } from "@/domain/entities/dashboard/DashboardSummary"

export const fakeDashboardSummary: DashboardSummary = {
  metrics: [
    {
      id: "metric-revenue",
      label: "Revenue",
      value: "$48.2K",
      change: "+12.4%",
      helperText: "Compared with last month",
      trend: "up",
    },
    {
      id: "metric-orders",
      label: "Orders",
      value: "1,284",
      change: "+8.1%",
      helperText: "162 orders need review",
      trend: "up",
    },
    {
      id: "metric-customers",
      label: "Customers",
      value: "9,842",
      change: "+3.6%",
      helperText: "Active customers this period",
      trend: "up",
    },
    {
      id: "metric-risk",
      label: "Open Issues",
      value: "18",
      change: "-4",
      helperText: "Issues resolved this week",
      trend: "down",
    },
  ],
  tasks: [
    {
      id: "task-stock",
      title: "Review low-stock products",
      owner: "Operations",
      dueDate: "Today",
      progress: 72,
      status: "in-progress",
    },
    {
      id: "task-orders",
      title: "Approve priority orders",
      owner: "Sales",
      dueDate: "Tomorrow",
      progress: 48,
      status: "pending",
    },
    {
      id: "task-catalog",
      title: "Publish catalog updates",
      owner: "Product",
      dueDate: "Friday",
      progress: 100,
      status: "done",
    },
  ],
  activities: [
    {
      id: "activity-payment",
      title: "Payment review completed",
      description: "12 flagged payments were cleared for fulfillment.",
      time: "10 min ago",
      tone: "success",
    },
    {
      id: "activity-stock",
      title: "Inventory threshold reached",
      description: "Three product groups are below the reorder point.",
      time: "34 min ago",
      tone: "warning",
    },
    {
      id: "activity-customer",
      title: "Customer segment refreshed",
      description: "The loyalty segment was updated with recent orders.",
      time: "1 hr ago",
      tone: "default",
    },
  ],
}
