"use client"

import Link from "next/link"

import { getAuthorViewHref } from "@/lib/authorLink"
import { getBranchViewHref } from "@/lib/branchLink"
import { getGroupViewHref } from "@/lib/groupLink"
import { getTranslatorViewHref } from "@/lib/translatorLink"

const defaultLinkClassName =
  "font-medium text-primary underline-offset-4 hover:underline"

type DashboardEntityLinkProps = {
  href: string
  children: React.ReactNode
  className?: string
}

export function DashboardEntityLink({
  href,
  children,
  className,
}: DashboardEntityLinkProps) {
  return (
    <Link href={href} className={className ?? defaultLinkClassName}>
      {children}
    </Link>
  )
}

type OptionalEntityLinkProps = {
  href: string | null
  children: React.ReactNode
  className?: string
  fallbackClassName?: string
}

export function OptionalEntityLink({
  href,
  children,
  className,
  fallbackClassName,
}: OptionalEntityLinkProps) {
  if (!href) {
    return <span className={fallbackClassName}>{children}</span>
  }

  return (
    <DashboardEntityLink href={href} className={className}>
      {children}
    </DashboardEntityLink>
  )
}

type BookLinkProps = {
  bookId: string
  title: string
  className?: string
}

export function BookLink({ bookId, title, className }: BookLinkProps) {
  return (
    <DashboardEntityLink
      href={`/dashboard/books/${bookId}`}
      className={className}
    >
      {title}
    </DashboardEntityLink>
  )
}

type GroupLinkProps = {
  groupId: string
  name: string
  className?: string
}

export function GroupLink({ groupId, name, className }: GroupLinkProps) {
  return (
    <DashboardEntityLink href={getGroupViewHref(groupId)} className={className}>
      {name}
    </DashboardEntityLink>
  )
}

type MemberLinkProps = {
  memberId: string
  name: string
  className?: string
}

export function MemberLink({ memberId, name, className }: MemberLinkProps) {
  return (
    <DashboardEntityLink
      href={`/dashboard/members/${memberId}`}
      className={className}
    >
      {name}
    </DashboardEntityLink>
  )
}

type StaffLinkProps = {
  staffId: string
  name: string
  className?: string
}

export function StaffLink({ staffId, name, className }: StaffLinkProps) {
  return (
    <DashboardEntityLink
      href={`/dashboard/staff/${staffId}`}
      className={className}
    >
      {name}
    </DashboardEntityLink>
  )
}

type AuthorLinkProps = {
  name: string
  className?: string
}

export function AuthorLink({ name, className }: AuthorLinkProps) {
  return (
    <OptionalEntityLink href={getAuthorViewHref(name)} className={className}>
      {name}
    </OptionalEntityLink>
  )
}

type TranslatorLinkProps = {
  name: string | null
  className?: string
}

export function TranslatorLink({ name, className }: TranslatorLinkProps) {
  if (!name) {
    return <span className="text-muted-foreground">—</span>
  }

  return (
    <OptionalEntityLink
      href={getTranslatorViewHref(name)}
      className={className}
    >
      {name}
    </OptionalEntityLink>
  )
}

type BranchDetailLinkProps = {
  branchId: string
  branchName: string
  className?: string
}

export function BranchDetailLink({
  branchId,
  branchName,
  className,
}: BranchDetailLinkProps) {
  return (
    <DashboardEntityLink
      href={getBranchViewHref(branchId)}
      className={className}
    >
      {branchName}
    </DashboardEntityLink>
  )
}

export function buildCreateHrefWithReturn(
  basePath: string,
  returnTo: string
): string {
  const params = new URLSearchParams({ returnTo })
  return `${basePath}?${params.toString()}`
}
