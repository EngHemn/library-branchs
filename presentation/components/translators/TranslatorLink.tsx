"use client"

import Link from "next/link"

type TranslatorLinkProps = {
  translatorId: string
  translatorName: string
  className?: string
}

export function TranslatorLink({
  translatorId,
  translatorName,
  className,
}: TranslatorLinkProps) {
  return (
    <Link
      href={`/dashboard/translators/${translatorId}`}
      className={
        className ??
        "font-semibold text-primary underline-offset-4 hover:underline"
      }
    >
      {translatorName}
    </Link>
  )
}
