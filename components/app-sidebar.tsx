"use client"

import * as React from "react"
import {
  ActivityIcon,
  AlertTriangleIcon,
  BarChart3Icon,
  BellIcon,
  BookOpenIcon,
  BookMarkedIcon,
  BoxesIcon,
  Building2Icon,
  CalendarCheckIcon,
  CalendarDaysIcon,
  ClipboardListIcon,
  FileTextIcon,
  GalleryVerticalEndIcon,
  LanguagesIcon,
  LayoutDashboardIcon,
  PackageSearchIcon,
  PenLineIcon,
  Settings2Icon,
  ShieldCheckIcon,
  ShoppingCartIcon,
  TagsIcon,
  UserRoundIcon,
  UsersRoundIcon,
} from "lucide-react"

import type { BranchType } from "@/domain/entities/branch/Branch"
import { getBranchTypeLabel } from "@/lib/branchTypeLabel"
import { NavMain, type SidebarGroup } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  branchType?: BranchType
  user?: {
    name: string
    email: string
    avatar?: string
  }
  onLogout?: () => Promise<void> | void
}

const userFallback = {
  name: "Liba User",
  email: "workspace@liba.local",
  avatar: "",
}

function buildTeams(branchType: BranchType | undefined) {
  return [
    {
      name: "Liba",
      logo: <GalleryVerticalEndIcon />,
      plan: getBranchTypeLabel(branchType),
    },
  ]
}

const sidebarGroups: SidebarGroup[] = [
  {
    title: "Main",
    items: [
      {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboardIcon,
      },
    ],
  },
  {
    title: "Management",
    items: [
      {
        title: "Branch Management",
        href: "/dashboard/branches",
        icon: Building2Icon,
      },
      {
        title: "Staff Management",
        href: "/dashboard/staff",
        icon: UsersRoundIcon,
      },
      {
        title: "Permissions",
        href: "/dashboard/permissions",
        icon: ShieldCheckIcon,
      },
    ],
  },
  {
    title: "Library",
    items: [
      {
        title: "Books",
        href: "/dashboard/books",
        icon: BookOpenIcon,
      },
      {
        title: "Authors",
        href: "/dashboard/authors",
        icon: PenLineIcon,
      },
      {
        title: "Translators",
        href: "/dashboard/translators",
        icon: LanguagesIcon,
      },
      {
        title: "Categories",
        href: "/dashboard/categories",
        icon: TagsIcon,
      },
      {
        title: "Shelf Management",
        href: "/dashboard/shelves",
        icon: BookMarkedIcon,
      },
      {
        title: "Members",
        href: "/dashboard/members",
        icon: UserRoundIcon,
      },
      {
        title: "Bookings",
        href: "/dashboard/bookings",
        icon: CalendarCheckIcon,
      },
    ],
  },
  {
    title: "Commerce",
    items: [
      {
        title: "Shopping / Sales",
        href: "/dashboard/sales",
        icon: ShoppingCartIcon,
      },
      {
        title: "Stock Management",
        href: "/dashboard/stock",
        icon: BoxesIcon,
      },
      {
        title: "Bill Management",
        href: "/dashboard/bills",
        icon: FileTextIcon,
      },
      {
        title: "Order Management",
        href: "/dashboard/orders",
        icon: ClipboardListIcon,
      },
      {
        title: "Group Management",
        href: "/dashboard/groups",
        icon: CalendarDaysIcon,
      },
      {
        title: "Needs Management",
        href: "/dashboard/needs",
        icon: PackageSearchIcon,
      },
      {
        title: "Low Stock Alerts",
        href: "/dashboard/alerts/low-stock",
        icon: AlertTriangleIcon,
      },
    ],
  },
  {
    title: "System",
    items: [
      {
        title: "Reports",
        href: "/dashboard/reports",
        icon: BarChart3Icon,
      },
      {
        title: "Settings",
        href: "/dashboard/settings",
        icon: Settings2Icon,
      },
      {
        title: "Notifications",
        href: "/dashboard/notifications",
        icon: BellIcon,
      },
      {
        title: "Activity Logs",
        href: "/dashboard/activity-logs",
        icon: ActivityIcon,
      },
    ],
  },
]

const branchManagementHref = "/dashboard/branches"

function buildSidebarGroups(branchType: BranchType | undefined): SidebarGroup[] {
  const hideBranchManagement = branchType === "sub"

  return sidebarGroups
    .map((group) => ({
      ...group,
      items: group.items.filter(
        (item) =>
          !(hideBranchManagement && item.href === branchManagementHref)
      ),
    }))
    .filter((group) => group.items.length > 0)
}

export function AppSidebar({ branchType, user, onLogout, ...props }: AppSidebarProps) {
  const teams = React.useMemo(() => buildTeams(branchType), [branchType])
  const groups = React.useMemo(
    () => buildSidebarGroups(branchType),
    [branchType]
  )

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={teams} />
      </SidebarHeader>
      <SidebarContent className="py-1">
        <NavMain groups={groups} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user ?? userFallback} onLogout={onLogout} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
