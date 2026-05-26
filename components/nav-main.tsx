"use client"

import type { LucideIcon } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  SidebarGroup as SidebarSection,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export type SidebarItem = {
  title: string
  href: string
  icon: LucideIcon
}

export type SidebarGroup = {
  title: string
  items: SidebarItem[]
}

type NavMainProps = {
  groups: SidebarGroup[]
}

function isSidebarItemActive(pathname: string, href: string): boolean {
  if (href === "/dashboard") {
    return pathname === href
  }

  return pathname === href || pathname.startsWith(`${href}/`)
}

export function NavMain({ groups }: NavMainProps) {
  const pathname = usePathname()

  return (
    <>
      {groups.map((group) => (
        <SidebarSection key={group.title} className="py-2">
          <SidebarGroupLabel className="font-semibold">
            {group.title}
          </SidebarGroupLabel>
          <SidebarMenu className="gap-1">
            {group.items.map((item) => {
              const Icon = item.icon

              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isSidebarItemActive(pathname, item.href)}
                    tooltip={item.title}
                    className="h-9"
                  >
                    <Link href={item.href}>
                      <Icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarSection>
      ))}
    </>
  )
}
