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
import { useTranslation } from "@/presentation/i18n/useTranslation"

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
  const { t } = useTranslation()
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
        setSearchError(t("orders.location.searchNotFound"))
        setIsSearching(false)
        return
      }

      setDraftLatitude(Math.round(parseFloat(results[0].lat) * 1e6) / 1e6)
      setDraftLongitude(Math.round(parseFloat(results[0].lon) * 1e6) / 1e6)
    } catch {
      setSearchError(t("orders.location.searchFailed"))
    }

    setIsSearching(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t("orders.location.pickerTitle")}</DialogTitle>
          <DialogDescription>
            {t("orders.location.pickerDescription")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>{t("orders.location.searchByAddress")}</Label>
            <div className="flex gap-2">
              <Input
                placeholder={t("orders.location.searchPlaceholder")}
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
                {t("orders.location.clickToSelect")}
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
              <Label>{t("orders.location.latitude")}</Label>
              <Input
                value={draftLatitude !== null ? String(draftLatitude) : ""}
                readOnly
                placeholder={t("orders.location.selectOnMapPlaceholder")}
                className="bg-muted/40 font-mono text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label>{t("orders.location.longitude")}</Label>
              <Input
                value={draftLongitude !== null ? String(draftLongitude) : ""}
                readOnly
                placeholder={t("orders.location.selectOnMapPlaceholder")}
                className="bg-muted/40 font-mono text-sm"
              />
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            {t("common.cancel")}
          </Button>
          <Button
            type="button"
            onClick={() => {
              onApply(draftLatitude, draftLongitude)
              onOpenChange(false)
            }}
          >
            {t("orders.location.applyLocation")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
