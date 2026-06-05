"use client"

import { dashboardAuthUseCase } from "@/app/dashboard/dashboardAuthDependencies"
import { BookingManagementFakeDataSource } from "@/data/datasources/BookingManagementFakeDataSource"
import { BookingManagementRepositoryImpl } from "@/data/repositories/BookingManagementRepositoryImpl"
import { BookingManagementUseCase } from "@/domain/usecases/bookings/BookingManagementUseCase"
import { BookingsScreen } from "@/presentation/screens/bookings/BookingsScreen"

const bookingManagementFakeDataSource = new BookingManagementFakeDataSource()
const bookingManagementRepository = new BookingManagementRepositoryImpl(
  bookingManagementFakeDataSource
)
const bookingManagementUseCase = new BookingManagementUseCase(
  bookingManagementRepository
)

export default function Page() {
  return (
    <BookingsScreen
      authUseCase={dashboardAuthUseCase}
      bookingManagementUseCase={bookingManagementUseCase}
    />
  )
}
