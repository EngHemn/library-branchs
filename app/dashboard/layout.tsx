"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"

import { AppSidebar } from "@/components/app-sidebar"
import { Toaster } from "@/components/ui/sonner"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { dashboardAuthUseCase } from "@/app/dashboard/dashboardAuthDependencies"
import { readStoredSessionUser } from "@/lib/authSession"
import { setAuthBranchTypeCookie } from "@/lib/authSessionCookie"
import {
  isMainBranchOnlyPath,
  MAIN_BRANCH_ONLY_DENIED_PATH,
} from "@/lib/mainBranchRouteAccess"
import { DashboardHeader } from "@/presentation/components/dashboard/DashboardHeader"
import { DashboardBreadcrumbProvider } from "@/presentation/hooks/useDashboardBreadcrumbs"
import { useLocale } from "@/presentation/i18n/useLocale"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const { isRtl } = useLocale()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const { data: sessionUser, isFetched } = useQuery({
    queryKey: ["dashboard", "sessionUser"],
    queryFn: async () => {
      const result = await dashboardAuthUseCase.getCurrentUser()
      if (!result.success) throw new Error(result.error)
      return result.data
    },
    staleTime: 60_000,
    enabled: mounted,
  })

  const resolvedUser = mounted ? (sessionUser ?? readStoredSessionUser()) : null

  useEffect(() => {
    if (!mounted || !isFetched) return
    if (sessionUser === null) {
      router.replace("/")
    }
  }, [mounted, router, sessionUser, isFetched])

  useEffect(() => {
    if (!resolvedUser) return
    setAuthBranchTypeCookie(resolvedUser.branchType)
  }, [resolvedUser])

  useEffect(() => {
    if (!mounted || !resolvedUser || resolvedUser.branchType !== "sub") return
    if (!isMainBranchOnlyPath(pathname)) return
    router.replace(MAIN_BRANCH_ONLY_DENIED_PATH)
  }, [mounted, pathname, resolvedUser, router])

  async function handleLogout(): Promise<void> {
    await dashboardAuthUseCase.logout()
    router.replace("/")
  }

  const sidebarUser = resolvedUser
    ? {
        name: resolvedUser.fullName,
        email: resolvedUser.username,
        avatar: "",
      }
    : undefined

  return (
    <DashboardBreadcrumbProvider>
      <SidebarProvider>
        <AppSidebar
          branchType={resolvedUser?.branchType}
          loginType={resolvedUser?.loginType}
          user={sidebarUser}
          onLogout={handleLogout}
        />
        <SidebarInset>
          <DashboardHeader />
          {children}
          <Toaster position={isRtl ? "top-left" : "top-right"} />
        </SidebarInset>
      </SidebarProvider>
    </DashboardBreadcrumbProvider>
  )
}
