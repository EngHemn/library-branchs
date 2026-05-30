"use client"

import Link from "next/link"

import { getBranchViewHref } from "@/lib/branchLink"

type BranchLinkProps = {
  branchId: string
  branchName: string
  className?: string
}

export function BranchLink({
  branchId,
  branchName,
  className,
}: BranchLinkProps) {
  return (
    <Link
      href={getBranchViewHref(branchId)}
      className={
        className ??
        "font-medium text-primary underline-offset-4 hover:underline"
      }
    >
      {branchName}
    </Link>
  )
}
