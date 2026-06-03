"use client"

import { useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export function useFormSubmitSuccess(
  isSaved: boolean,
  message: string,
  returnTo?: string
): void {
  const router = useRouter()
  const handledRef = useRef(false)

  useEffect(() => {
    if (!isSaved || handledRef.current) return
    handledRef.current = true
    toast.success(message)
    if (returnTo) {
      router.push(returnTo)
      return
    }
    router.back()
  }, [isSaved, message, returnTo, router])
}
