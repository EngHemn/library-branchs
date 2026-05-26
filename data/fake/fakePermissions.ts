import type {
  PermissionCategory,
  PermissionConfig,
  PermissionStaffMember,
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

export const fakePermissionStaff: PermissionStaffMember[] = [
  {
    id: "perm-staff-1",
    name: "Lara Hassan",
    email: "lara.hassan@liba.local",
    role: "branch_admin",
    branch: "Erbil Main Branch",
    assignedPermissions: allPermissions,
    isRoleLocked: true,
  },
  {
    id: "perm-staff-2",
    name: "Ranj Hussein",
    email: "ranj.hussein@liba.local",
    role: "sub_branch_admin",
    branch: "Ankawa Sub Branch",
    assignedPermissions: allPermissions,
    isRoleLocked: true,
  },
  {
    id: "perm-staff-3",
    name: "Noor Salim",
    email: "noor.salim@liba.local",
    role: "staff",
    branch: "Erbil Main Branch",
    assignedPermissions: ["book.view", "member.view", "booking.view"],
    isRoleLocked: false,
  },
  {
    id: "perm-staff-4",
    name: "Karzan Jamal",
    email: "karzan.jamal@liba.local",
    role: "staff",
    branch: "Ankawa Sub Branch",
    assignedPermissions: [],
    isRoleLocked: false,
  },
  {
    id: "perm-staff-5",
    name: "Shilan Yousif",
    email: "shilan.yousif@liba.local",
    role: "staff",
    branch: "Sulaymaniyah Main Branch",
    assignedPermissions: [],
    isRoleLocked: false,
  },
  {
    id: "perm-staff-6",
    name: "Hawar Karim",
    email: "hawar.karim@liba.local",
    role: "branch_admin",
    branch: "Sulaymaniyah Main Branch",
    assignedPermissions: allPermissions,
    isRoleLocked: true,
  },
]
