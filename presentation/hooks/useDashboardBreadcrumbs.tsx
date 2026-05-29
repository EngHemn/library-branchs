"use client"

import { createContext, useContext, useState, useEffect, useCallback } from "react"
import type { ReactNode } from "react"

type BreadcrumbItem = {
  label: string
  href?: string
}

type DashboardBreadcrumbContextValue = {
  breadcrumbs: BreadcrumbItem[]
  setBreadcrumbs: (items: BreadcrumbItem[]) => void
}

export const DashboardBreadcrumbContext =
  createContext<DashboardBreadcrumbContextValue | null>(null)

export type { BreadcrumbItem }

export function DashboardBreadcrumbProvider({ children }: { children: ReactNode }) {
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([])
  const set = useCallback((items: BreadcrumbItem[]) => setBreadcrumbs(items), [])

  return (
    <DashboardBreadcrumbContext.Provider value={{ breadcrumbs, setBreadcrumbs: set }}>
      {children}
    </DashboardBreadcrumbContext.Provider>
  )
}

export function useDashboardBreadcrumbs(items: BreadcrumbItem[]) {
  const ctx = useContext(DashboardBreadcrumbContext)
  if (!ctx) throw new Error("useDashboardBreadcrumbs must be used within DashboardBreadcrumbProvider")

  const { setBreadcrumbs } = ctx
  const key = items.map((i) => `${i.label}|${i.href ?? ""}`).join(",")

  useEffect(() => {
    setBreadcrumbs(items)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, setBreadcrumbs])
}

export function useBreadcrumbs() {
  const ctx = useContext(DashboardBreadcrumbContext)
  if (!ctx) throw new Error("useBreadcrumbs must be used within DashboardBreadcrumbProvider")
  return ctx.breadcrumbs
}
