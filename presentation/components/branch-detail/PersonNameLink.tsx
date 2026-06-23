"use client"

import Link from "next/link"

type PersonNameLinkProps = {
  name: string
  href: string | null
  className?: string
}

export function PersonNameLink({ name, href, className }: PersonNameLinkProps) {
  if (!href) {
    return <span className={className}>{name}</span>
  }

  return (
    <Link
      href={href}
      className={
        className ??
        "font-medium text-primary underline-offset-4 hover:underline"
      }
    >
      {name}
    </Link>
  )
}
