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
import { useLocale } from "@/presentation/i18n/useLocale"

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
    titleKey: "navGroups.main",
    items: [
      {
        titleKey: "nav.dashboard",
        href: "/dashboard",
        icon: LayoutDashboardIcon,
      },
    ],
  },
  {
    titleKey: "navGroups.management",
    items: [
      {
        titleKey: "nav.branches",
        href: "/dashboard/branches",
        icon: Building2Icon,
      },
      {
        titleKey: "nav.staff",
        href: "/dashboard/staff",
        icon: UsersRoundIcon,
      },
      {
        titleKey: "nav.permissions",
        href: "/dashboard/permissions",
        icon: ShieldCheckIcon,
      },
    ],
  },
  {
    titleKey: "navGroups.library",
    items: [
      {
        titleKey: "nav.books",
        href: "/dashboard/books",
        icon: BookOpenIcon,
      },
      {
        titleKey: "nav.authors",
        href: "/dashboard/authors",
        icon: PenLineIcon,
      },
      {
        titleKey: "nav.translators",
        href: "/dashboard/translators",
        icon: LanguagesIcon,
      },
      {
        titleKey: "nav.categories",
        href: "/dashboard/categories",
        icon: TagsIcon,
      },
      {
        titleKey: "nav.shelves",
        href: "/dashboard/shelves",
        icon: BookMarkedIcon,
      },
      {
        titleKey: "nav.members",
        href: "/dashboard/members",
        icon: UserRoundIcon,
      },
      {
        titleKey: "nav.bookings",
        href: "/dashboard/bookings",
        icon: CalendarCheckIcon,
      },
    ],
  },
  {
    titleKey: "navGroups.commerce",
    items: [
      {
        titleKey: "nav.sales",
        href: "/dashboard/sales",
        icon: ShoppingCartIcon,
      },
      {
        titleKey: "nav.stock",
        href: "/dashboard/stock",
        icon: BoxesIcon,
      },
      {
        titleKey: "nav.bills",
        href: "/dashboard/bills",
        icon: FileTextIcon,
      },
      {
        titleKey: "nav.orders",
        href: "/dashboard/orders",
        icon: ClipboardListIcon,
      },
      {
        titleKey: "nav.groups",
        href: "/dashboard/groups",
        icon: CalendarDaysIcon,
      },
      {
        titleKey: "nav.needs",
        href: "/dashboard/needs",
        icon: PackageSearchIcon,
      },
      {
        titleKey: "nav.alerts",
        href: "/dashboard/alerts/low-stock",
        icon: AlertTriangleIcon,
      },
    ],
  },
  {
    titleKey: "navGroups.system",
    items: [
      {
        titleKey: "nav.reports",
        href: "/dashboard/reports",
        icon: BarChart3Icon,
      },
      {
        titleKey: "nav.settings",
        href: "/dashboard/settings",
        icon: Settings2Icon,
      },
      {
        titleKey: "nav.notifications",
        href: "/dashboard/notifications",
        icon: BellIcon,
      },
      {
        titleKey: "nav.activityLogs",
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

export function AppSidebar({
  branchType,
  user,
  onLogout,
  side,
  dir,
  ...props
}: AppSidebarProps) {
  const { isRtl, direction } = useLocale()
  const teams = React.useMemo(() => buildTeams(branchType), [branchType])
  const groups = React.useMemo(
    () => buildSidebarGroups(branchType),
    [branchType]
  )

  return (
    <Sidebar
      collapsible="icon"
      side={side ?? (isRtl ? "right" : "left")}
      dir={dir ?? direction}
      {...props}
    >
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
