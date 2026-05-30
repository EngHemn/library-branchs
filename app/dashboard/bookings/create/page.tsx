"use client"

import { Suspense } from "react"

import { BookingManagementFakeDataSource } from "@/data/datasources/BookingManagementFakeDataSource"
import { BookingManagementRepositoryImpl } from "@/data/repositories/BookingManagementRepositoryImpl"
import { BookingManagementUseCase } from "@/domain/usecases/bookings/BookingManagementUseCase"
import { Skeleton } from "@/components/ui/skeleton"
import { CreateBookingScreen } from "@/presentation/screens/bookings/CreateBookingScreen"

const bookingManagementFakeDataSource = new BookingManagementFakeDataSource()
const bookingManagementRepository = new BookingManagementRepositoryImpl(
  bookingManagementFakeDataSource
)
const bookingManagementUseCase = new BookingManagementUseCase(bookingManagementRepository)

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
      <CreateBookingScreen bookingManagementUseCase={bookingManagementUseCase} />
    </Suspense>
  )
}
