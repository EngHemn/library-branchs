"use client"

import Image from "next/image"

import { cn } from "@/lib/utils"

function shouldUseUnoptimized(src: string): boolean {
  return src.startsWith("data:") || src.startsWith("blob:")
}

export type EntityImageProps = {
  src: string | null | undefined
  alt: string
  fallback: React.ReactNode
  className?: string
  imageClassName?: string
  width?: number
  height?: number
  fill?: boolean
  sizes?: string
  priority?: boolean
}

export function EntityImage({
  src,
  alt,
  fallback,
  className,
  imageClassName,
  width = 96,
  height = 96,
  fill = false,
  sizes,
  priority = false,
}: EntityImageProps) {
  const wrapperClassName = cn(
    "flex shrink-0 items-center justify-center overflow-hidden bg-muted",
    className
  )

  if (!src) {
    return <div className={wrapperClassName}>{fallback}</div>
  }

  const unoptimized = shouldUseUnoptimized(src)

  if (fill) {
    return (
      <div className={cn(wrapperClassName, "relative")}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes ?? `${width}px`}
          unoptimized={unoptimized}
          priority={priority}
          className={cn("object-cover", imageClassName)}
        />
      </div>
    )
  }

  return (
    <div className={wrapperClassName}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        unoptimized={unoptimized}
        priority={priority}
        className={cn("size-full object-cover", imageClassName)}
      />
    </div>
  )
}
