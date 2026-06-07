import type {
  PermissionCategory,
  PermissionConfig,
  PermissionRole,
} from "@/domain/entities/permission/Permission"

export const fakePermissionCategories: PermissionCategory[] = [
  {
    name: "Books",
    permissions: ["book.view", "book.create", "book.update", "book.delete"],
  },
  {
    name: "Authors",
    permissions: [
      "author.view",
      "author.create",
      "author.update",
      "author.delete",
    ],
  },
  {
    name: "Translators",
    permissions: [
      "translator.view",
      "translator.create",
      "translator.update",
      "translator.delete",
    ],
  },
  {
    name: "Categories",
    permissions: [
      "category.view",
      "category.create",
      "category.update",
      "category.delete",
    ],
  },
  {
    name: "Members",
    permissions: [
      "member.view",
      "member.create",
      "member.update",
      "member.delete",
    ],
  },
  {
    name: "Groups",
    permissions: [
      "group.view",
      "group.create",
      "group.update",
      "group.delete",
      "group.assign.books",
      "group.assign.staff",
    ],
  },
  {
    name: "Bookings",
    permissions: [
      "booking.view",
      "booking.create",
      "booking.update",
      "booking.delete",
      "booking.return",
      "booking.extend",
      "booking.cancel",
    ],
  },
  {
    name: "Needs",
    permissions: [
      "needs.view",
      "needs.create",
      "needs.update",
      "needs.delete",
      "needs.approve",
      "needs.reject",
    ],
  },
  {
    name: "Alerts",
    permissions: ["alerts.view", "alerts.manage"],
  },
]

export const fakePermissionConfig: PermissionConfig = {
  categories: fakePermissionCategories,
  totalPermissions: fakePermissionCategories.reduce(
    (total, category) => total + category.permissions.length,
    0
  ),
}

const allPermissions = fakePermissionCategories.flatMap(
  (category) => category.permissions
)

export const fakePermissionRoles: PermissionRole[] = [
  {
    id: "branch_admin",
    name: "Branch Admin",
    description: "Full access to branch operations and staff management.",
    assignedPermissions: allPermissions,
    isSystem: true,
  },
  {
    id: "sub_branch_admin",
    name: "Sub-Branch Admin",
    description: "Manage sub-branch resources and limited staff actions.",
    assignedPermissions: allPermissions,
    isSystem: true,
  },
  {
    id: "staff",
    name: "Staff",
    description: "Standard staff access for day-to-day library operations.",
    assignedPermissions: [
      "book.view",
      "member.view",
      "booking.view",
      "group.view",
    ],
    isSystem: true,
  },
]
