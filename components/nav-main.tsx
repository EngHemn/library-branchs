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
import type { TranslationKey } from "@/presentation/i18n/messages"
import { useTranslation } from "@/presentation/i18n/useTranslation"

export type SidebarItem = {
  titleKey: TranslationKey
  href: string
  icon: LucideIcon
}

export type SidebarGroup = {
  titleKey: TranslationKey
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
  const { t } = useTranslation()

  return (
    <>
      {groups.map((group) => (
        <SidebarSection key={group.titleKey} className="py-2">
          <SidebarGroupLabel className="font-semibold">
            {t(group.titleKey)}
          </SidebarGroupLabel>
          <SidebarMenu className="gap-1">
            {group.items.map((item) => {
              const Icon = item.icon
              const label = t(item.titleKey)

              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={isSidebarItemActive(pathname, item.href)}
                    tooltip={label}
                    className="h-9"
                  >
                    <Link href={item.href}>
                      <Icon />
                      <span>{label}</span>
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
