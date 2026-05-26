"use client"

import * as React from "react"
import {
  ActivityIcon,
  BarChart3Icon,
  BookOpenIcon,
  BoxesIcon,
  Building2Icon,
  CalendarCheckIcon,
  CalendarDaysIcon,
  GalleryVerticalEndIcon,
  LanguagesIcon,
  LayoutDashboardIcon,
  PenLineIcon,
  Settings2Icon,
  ShieldCheckIcon,
  ShoppingCartIcon,
  TagsIcon,
  UserRoundIcon,
  UsersRoundIcon,
} from "lucide-react"

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

const teams = [
  {
    name: "Liba",
    logo: <GalleryVerticalEndIcon />,
    plan: "Workspace",
  },
]

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
        title: "Event Management",
        href: "/dashboard/events",
        icon: CalendarDaysIcon,
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
        title: "Activity Logs",
        href: "/dashboard/activity-logs",
        icon: ActivityIcon,
      },
    ],
  },
]

export function AppSidebar({ user, onLogout, ...props }: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={teams} />
      </SidebarHeader>
      <SidebarContent className="py-1">
        <NavMain groups={sidebarGroups} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user ?? userFallback} onLogout={onLogout} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
