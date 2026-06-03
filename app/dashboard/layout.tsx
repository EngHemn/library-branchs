"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { Toaster } from "@/components/ui/sonner"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { DashboardHeader } from "@/presentation/components/dashboard/DashboardHeader"
import { DashboardBreadcrumbProvider } from "@/presentation/hooks/useDashboardBreadcrumbs"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <DashboardBreadcrumbProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <DashboardHeader />
          {children}
          <Toaster />
        </SidebarInset>
      </SidebarProvider>
    </DashboardBreadcrumbProvider>
  )
}
