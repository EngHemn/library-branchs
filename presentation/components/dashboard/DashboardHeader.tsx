"use client"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { NotificationsDropdown } from "@/presentation/components/dashboard/NotificationsDropdown"
import { ThemeModeDropdown } from "@/presentation/components/dashboard/ThemeModeDropdown"
import { LocaleSwitcher } from "@/presentation/components/shared/LocaleSwitcher"
import { useBreadcrumbs } from "@/presentation/hooks/useDashboardBreadcrumbs"

export function DashboardHeader() {
  const breadcrumbs = useBreadcrumbs()

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex min-w-0 flex-1 items-center gap-2 px-4">
        <SidebarTrigger className="-ms-1" />
        <Separator
          orientation="vertical"
          className="me-2 data-vertical:h-4 data-vertical:self-auto"
        />
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((item, index) => {
              const isLast = index === breadcrumbs.length - 1
              return (
                <span key={index} className="flex items-center gap-1.5">
                  {index > 0 && (
                    <BreadcrumbSeparator className="hidden md:block" />
                  )}
                  <BreadcrumbItem className={index < breadcrumbs.length - 1 ? "hidden md:block" : undefined}>
                    {isLast ? (
                      <BreadcrumbPage>{item.label}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink href={item.href ?? "#"}>{item.label}</BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </span>
              )
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="flex shrink-0 items-center gap-2 px-4">
        <NotificationsDropdown />
        <LocaleSwitcher />
        <ThemeModeDropdown />
      </div>
    </header>
  )
}
