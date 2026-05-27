"use client"

import { Suspense } from "react"

import { Skeleton } from "@/components/ui/skeleton"
import { CreateBookingScreen } from "@/presentation/screens/bookings/CreateBookingScreen"

function CreateBookingPageFallback() {
  return (
    <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
      <Skeleton className="mt-4 h-8 w-48" />
      <Skeleton className="h-4 w-96 max-w-full" />
      <Skeleton className="min-h-96 rounded-lg" />
    </div>
  )
}

export default function CreateBookingPage() {
  return (
    <Suspense fallback={<CreateBookingPageFallback />}>
      <CreateBookingScreen />
    </Suspense>
  )
}
