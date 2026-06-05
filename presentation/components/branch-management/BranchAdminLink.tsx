"use client"

import Link from "next/link"

import { getBranchAdminStaffHref } from "@/lib/branchAdminLink"

type BranchAdminLinkProps = {
  branchId: string
  adminName: string
  className?: string
}

export function BranchAdminLink({
  branchId,
  adminName,
  className,
}: BranchAdminLinkProps) {
  const href = getBranchAdminStaffHref(branchId, adminName)

  if (!href) {
    return <span className={className}>{adminName}</span>
  }

  return (
    <Link
      href={href}
      className={
        className ??
        "font-medium text-primary underline-offset-4 hover:underline"
      }
    >
      {adminName}
    </Link>
  )
}
