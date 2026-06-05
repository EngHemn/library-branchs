"use client"

import { useState } from "react"
import { PlusIcon, RefreshCwIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { TooltipProvider } from "@/components/ui/tooltip"
import type { Booking } from "@/domain/entities/booking/Booking"
import type { AuthUseCase } from "@/domain/usecases/auth/AuthUseCase"
import type { BookingManagementUseCase } from "@/domain/usecases/bookings/BookingManagementUseCase"
import { BookingStatsCards } from "@/presentation/components/bookings/BookingStatsCards"
import { BookingsFilters } from "@/presentation/components/bookings/BookingsFilters"
import { BookingsTable } from "@/presentation/components/bookings/BookingsTable"
import { CreateBookingDialog } from "@/presentation/components/bookings/CreateBookingDialog"
import { EditBookingDialog } from "@/presentation/components/bookings/EditBookingDialog"
import { useDashboardBreadcrumbs } from "@/presentation/hooks/useDashboardBreadcrumbs"
import { useBookingsViewModel } from "@/presentation/viewmodels/bookings/useBookingsViewModel"

type BookingsScreenProps = {
  authUseCase: AuthUseCase
  bookingManagementUseCase: BookingManagementUseCase
}

function LoadingBookingsScreen() {
  return (
    <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
      <div className="space-y-2 pt-4">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-7">
        {Array.from({ length: 7 }).map((_, index) => (
          <Skeleton key={index} className="h-20 rounded-lg" />
        ))}
      </div>
      <Skeleton className="h-10 rounded-lg" />
      <Skeleton className="min-h-96 rounded-lg" />
    </div>
  )
}

export function BookingsScreen({
  authUseCase,
  bookingManagementUseCase,
}: BookingsScreenProps) {
  const viewModel = useBookingsViewModel(authUseCase, bookingManagementUseCase)
  const { state } = viewModel
  const [deleteBooking, setDeleteBooking] = useState<Booking | null>(null)
  const [cancelBooking, setCancelBooking] = useState<Booking | null>(null)
  const [editBookingId, setEditBookingId] = useState<string | null>(null)
  const [createBookingOpen, setCreateBookingOpen] = useState(false)

  useDashboardBreadcrumbs([
    { label: "Workspace", href: "/dashboard" },
    { label: "Bookings" },
  ])

  const handleConfirmDelete = () => {
    if (!deleteBooking) return
    void (async () => {
      await viewModel.deleteBooking(deleteBooking.id)
      setDeleteBooking(null)
    })()
  }

  const handleConfirmCancel = () => {
    if (!cancelBooking) return
    void (async () => {
      await viewModel.cancelBooking(cancelBooking.id)
      setCancelBooking(null)
    })()
  }

  return (
    <>
      {state.isLoading ? <LoadingBookingsScreen /> : null}

      {state.error && state.status === "error" ? (
        <div className="flex flex-1 items-center justify-center p-4">
          <Card className="w-full max-w-md rounded-lg">
            <CardHeader>
              <CardTitle>Bookings unavailable</CardTitle>
              <CardDescription>{state.error}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => void viewModel.reload()}>
                <RefreshCwIcon />
                Retry
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : null}

      {state.isReady ? (
        <TooltipProvider>
          <div className="flex flex-1 flex-col gap-5 p-4 pt-0 md:p-6 md:pt-0">
            <section className="flex flex-col gap-3 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold tracking-normal">Bookings</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Track reservations, borrows, returns and overdue books.
                </p>
              </div>
              <Button onClick={() => setCreateBookingOpen(true)}>
                <PlusIcon />
                Create Booking
              </Button>
            </section>

            {state.error ? (
              <Card className="rounded-lg border-destructive/40 bg-destructive/5">
                <CardContent className="py-3 text-sm text-destructive">
                  {state.error}
                </CardContent>
              </Card>
            ) : null}

            <BookingStatsCards stats={state.stats} />

            <BookingsFilters
              searchQuery={state.filters.searchQuery}
              statusFilter={state.filters.statusFilter}
              typeFilter={state.filters.typeFilter}
              branchFilter={state.filters.branchFilter}
              branchFilterOptions={state.branchFilterOptions}
              showBranchFilter={state.showBranchFilter}
              onSearchQueryChange={viewModel.setSearchQuery}
              onStatusFilterChange={viewModel.setStatusFilter}
              onTypeFilterChange={viewModel.setTypeFilter}
              onBranchFilterChange={viewModel.setBranchFilter}
            />

            <BookingsTable
              bookings={state.filteredBookings}
              isActionPending={state.isActionPending}
              showBranchColumn={state.showBranchColumn}
              onReturn={(booking) => void viewModel.returnBooking(booking.id)}
              onExtend={(booking) => void viewModel.extendBooking(booking.id)}
              onCancel={(booking) => setCancelBooking(booking)}
              onEdit={(booking) => setEditBookingId(booking.id)}
              onDelete={(booking) => setDeleteBooking(booking)}
            />
          </div>
        </TooltipProvider>
      ) : null}

      <Dialog
        open={cancelBooking !== null}
        onOpenChange={(isOpen) => {
          if (!isOpen) setCancelBooking(null)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Booking</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel booking &ldquo;
              {cancelBooking?.bookingId}&rdquo; for &ldquo;
              {cancelBooking?.bookTitle}&rdquo;? The booking status will be set
              to cancelled.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelBooking(null)}>
              Keep Booking
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmCancel}
              disabled={state.isActionPending}
            >
              Cancel Booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={deleteBooking !== null}
        onOpenChange={(isOpen) => {
          if (!isOpen) setDeleteBooking(null)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Booking</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete booking &ldquo;
              {deleteBooking?.bookingId}&rdquo; for &ldquo;
              {deleteBooking?.bookTitle}&rdquo;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteBooking(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={state.isActionPending}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <CreateBookingDialog
        open={createBookingOpen}
        onOpenChange={setCreateBookingOpen}
        authUseCase={authUseCase}
        bookingManagementUseCase={bookingManagementUseCase}
      />

      <EditBookingDialog
        open={editBookingId !== null}
        onOpenChange={(isOpen) => {
          if (!isOpen) setEditBookingId(null)
        }}
        bookingId={editBookingId ?? ""}
        bookingManagementUseCase={bookingManagementUseCase}
      />
    </>
  )
}
