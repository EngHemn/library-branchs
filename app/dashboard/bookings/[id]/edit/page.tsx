"use client"

import { use } from "react"

import { BookingManagementFakeDataSource } from "@/data/datasources/BookingManagementFakeDataSource"
import { BookingManagementRepositoryImpl } from "@/data/repositories/BookingManagementRepositoryImpl"
import { BookingManagementUseCase } from "@/domain/usecases/bookings/BookingManagementUseCase"
import { EditBookingScreen } from "@/presentation/screens/bookings/EditBookingScreen"

type EditBookingPageProps = {
  params: Promise<{
    id: string
  }>
}

const bookingManagementFakeDataSource = new BookingManagementFakeDataSource()
const bookingManagementRepository = new BookingManagementRepositoryImpl(
  bookingManagementFakeDataSource
)
const bookingManagementUseCase = new BookingManagementUseCase(
  bookingManagementRepository
)

export default function EditBookingPage({ params }: EditBookingPageProps) {
  const { id } = use(params)

  return (
    <EditBookingScreen
      bookingId={id}
      bookingManagementUseCase={bookingManagementUseCase}
    />
  )
}
