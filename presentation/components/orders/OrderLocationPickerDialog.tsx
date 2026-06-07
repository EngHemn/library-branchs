"use client"

import { useEffect, useState } from "react"
import { SearchIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { OrderLocationMap } from "@/presentation/components/orders/OrderLocationMap"
import { normalizeCoordinate } from "@/presentation/components/orders/orderDisplay"

type OrderLocationPickerDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  latitude: number | null
  longitude: number | null
  address?: string
  onApply: (latitude: number | null, longitude: number | null) => void
}

export function OrderLocationPickerDialog({
  open,
  onOpenChange,
  latitude,
  longitude,
  address,
  onApply,
}: OrderLocationPickerDialogProps) {
  const [draftLatitude, setDraftLatitude] = useState<number | null>(latitude)
  const [draftLongitude, setDraftLongitude] = useState<number | null>(longitude)
  const [searchQuery, setSearchQuery] = useState(address ?? "")
  const [searchError, setSearchError] = useState<string | null>(null)
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    if (!open) {
      return
    }

    setDraftLatitude(normalizeCoordinate(latitude))
    setDraftLongitude(normalizeCoordinate(longitude))
    setSearchQuery(address ?? "")
    setSearchError(null)
  }, [open, latitude, longitude, address])

  async function handleSearch(): Promise<void> {
    if (!searchQuery.trim()) {
      return
    }

    setIsSearching(true)
    setSearchError(null)

    try {
      const encoded = encodeURIComponent(searchQuery.trim())
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encoded}&format=json&limit=1`,
        { headers: { "Accept-Language": "en" } }
      )

      type NominatimResult = { lat: string; lon: string }
      const results = (await response.json()) as NominatimResult[]

      if (!results.length) {
        setSearchError("No location found for that address.")
        setIsSearching(false)
        return
      }

      setDraftLatitude(Math.round(parseFloat(results[0].lat) * 1e6) / 1e6)
      setDraftLongitude(Math.round(parseFloat(results[0].lon) * 1e6) / 1e6)
    } catch {
      setSearchError("Location search failed. Please try again.")
    }

    setIsSearching(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Select delivery location</DialogTitle>
          <DialogDescription>
            Search an address or click on the map to place the marker.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Search by address</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Enter an address to search..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault()
                    void handleSearch()
                  }
                }}
                disabled={isSearching}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => void handleSearch()}
                disabled={isSearching || !searchQuery.trim()}
              >
                <SearchIcon className="size-4" />
              </Button>
            </div>
            {searchError ? (
              <p className="text-sm text-destructive">{searchError}</p>
            ) : (
              <p className="text-xs text-muted-foreground">
                Click on the map to select or adjust the delivery point.
              </p>
            )}
          </div>

          <OrderLocationMap
            latitude={draftLatitude}
            longitude={draftLongitude}
            heightClassName="h-[340px]"
            interactive
            onLocationChange={(lat, lng) => {
              setDraftLatitude(lat)
              setDraftLongitude(lng)
            }}
          />

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Latitude</Label>
              <Input
                value={draftLatitude !== null ? String(draftLatitude) : ""}
                readOnly
                placeholder="Select on map"
                className="bg-muted/40 font-mono text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Longitude</Label>
              <Input
                value={draftLongitude !== null ? String(draftLongitude) : ""}
                readOnly
                placeholder="Select on map"
                className="bg-muted/40 font-mono text-sm"
              />
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            type="button"
            onClick={() => {
              onApply(draftLatitude, draftLongitude)
              onOpenChange(false)
            }}
          >
            Apply location
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
