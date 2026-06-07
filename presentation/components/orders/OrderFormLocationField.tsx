"use client"

import { useState } from "react"
import { MapPinIcon } from "lucide-react"
import type { UseFormReturn } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { OrderBranchOption } from "@/domain/repositories/OrderManagementRepository"
import type { OrderFormValues } from "@/domain/schemas/orderFormSchema"
import { OrderLocationMap } from "@/presentation/components/orders/OrderLocationMap"
import { OrderLocationPickerDialog } from "@/presentation/components/orders/OrderLocationPickerDialog"
import { normalizeCoordinate } from "@/presentation/components/orders/orderDisplay"

type OrderFormLocationFieldProps = {
  form: UseFormReturn<OrderFormValues>
  branchOptions: OrderBranchOption[]
  disabled?: boolean
}

export function OrderFormLocationField({
  form,
  branchOptions,
  disabled = false,
}: OrderFormLocationFieldProps) {
  const [isMapDialogOpen, setIsMapDialogOpen] = useState(false)
  const branchId = form.watch("branchId")
  const latitude = normalizeCoordinate(form.watch("latitude"))
  const longitude = normalizeCoordinate(form.watch("longitude"))
  const selectedBranch = branchOptions.find((branch) => branch.id === branchId)
  const address = selectedBranch?.address ?? ""

  function applyBranchLocation(branch: OrderBranchOption): void {
    form.setValue("latitude", branch.latitude)
    form.setValue("longitude", branch.longitude)
  }

  return (
    <>
      <Card className="rounded-lg">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <MapPinIcon className="size-4" />
            Delivery Location
          </CardTitle>
          <CardDescription>
            {address || "Select a branch, then choose the delivery point on the map."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={disabled}
              onClick={() => setIsMapDialogOpen(true)}
            >
              <MapPinIcon className="size-4" />
              Select on map
            </Button>
            {selectedBranch ? (
              <Button
                type="button"
                variant="ghost"
                disabled={disabled}
                onClick={() => applyBranchLocation(selectedBranch)}
              >
                Use branch location
              </Button>
            ) : null}
          </div>

          <OrderLocationMap
            latitude={latitude}
            longitude={longitude}
            heightClassName="h-[260px]"
          />

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="order-form-latitude">Latitude</Label>
              <Input
                id="order-form-latitude"
                value={latitude !== null ? String(latitude) : ""}
                readOnly
                placeholder="Select on map"
                className="bg-muted/40 font-mono text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="order-form-longitude">Longitude</Label>
              <Input
                id="order-form-longitude"
                value={longitude !== null ? String(longitude) : ""}
                readOnly
                placeholder="Select on map"
                className="bg-muted/40 font-mono text-sm"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <OrderLocationPickerDialog
        open={isMapDialogOpen}
        onOpenChange={setIsMapDialogOpen}
        latitude={latitude}
        longitude={longitude}
        address={address}
        onApply={(lat, lng) => {
          form.setValue("latitude", lat)
          form.setValue("longitude", lng)
        }}
      />
    </>
  )
}
