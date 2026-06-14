"use client"

import { useEffect, useRef, useState } from "react"
import { MapPinIcon } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { useTranslation } from "@/presentation/i18n/useTranslation"

export type BranchRequestLocationView = {
  branchName: string
  address: string
  latitude: number | null
  longitude: number | null
}

type BranchRequestLocationDialogProps = {
  location: BranchRequestLocationView | null
  onClose: () => void
}

type MapState = "loading" | "ready"

const DEFAULT_ZOOM = 14

export function BranchRequestLocationDialog({
  location,
  onClose,
}: BranchRequestLocationDialogProps) {
  const { t } = useTranslation()
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<import("leaflet").Map | null>(null)
  const [mapState, setMapState] = useState<MapState>("loading")

  const hasLocation =
    location !== null &&
    location.latitude !== null &&
    location.longitude !== null

  useEffect(() => {
    if (!location || !hasLocation) {
      return
    }

    setMapState("loading")

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove()
      mapInstanceRef.current = null
    }

    let cancelled = false

    async function initMap(): Promise<void> {
      const L = (await import("leaflet")).default

      delete (L.Icon.Default.prototype as { _getIconUrl?: () => string })
        ._getIconUrl

      L.Icon.Default.mergeOptions({
        iconRetinaUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      })

      if (cancelled || !mapContainerRef.current || !location) {
        return
      }

      const center: [number, number] = [
        location.latitude!,
        location.longitude!,
      ]

      const map = L.map(mapContainerRef.current, {
        center,
        zoom: DEFAULT_ZOOM,
        zoomControl: true,
        dragging: true,
        scrollWheelZoom: true,
      })

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map)

      L.marker(center).addTo(map)

      mapInstanceRef.current = map
      setMapState("ready")
    }

    void initMap()

    return () => {
      cancelled = true
    }
  }, [hasLocation, location])

  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  return (
    <Dialog
      open={Boolean(location)}
      onOpenChange={(open) => {
        if (!open) {
          onClose()
        }
      }}
    >
      <DialogContent className="min-w-lg sm:max-w-2xl">
        {location ? (
          <>
            <DialogHeader>
              <div className="mb-2 flex items-center gap-2">
                <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900/30">
                  <MapPinIcon className="size-5 text-blue-600 dark:text-blue-400" />
                </div>
                <DialogTitle>{t("branches.locationDialog.title")}</DialogTitle>
              </div>
              <DialogDescription className="text-left">
                {t("branches.locationDialog.description", { name: location.branchName })}
              </DialogDescription>
            </DialogHeader>

            {!hasLocation ? (
              <div className="rounded-lg border bg-muted/30 px-4 py-8 text-center text-sm text-muted-foreground">
                {t("branches.locationDialog.noMapLocation")}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="h-[320px] w-full overflow-hidden rounded-md border">
                  {mapState === "loading" ? (
                    <Skeleton className="h-full w-full" />
                  ) : null}
                  <div
                    ref={mapContainerRef}
                    className="h-full w-full"
                    style={{ zIndex: 0 }}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="request-address">{t("branches.locationDialog.address")}</Label>
                  <Input
                    id="request-address"
                    value={location.address || t("branches.locationDialog.noAddress")}
                    readOnly
                    className="bg-muted/40"
                  />
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="request-latitude">{t("branches.locationDialog.latitude")}</Label>
                    <Input
                      id="request-latitude"
                      value={String(location.latitude)}
                      readOnly
                      className="bg-muted/40 font-mono text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="request-longitude">{t("branches.locationDialog.longitude")}</Label>
                    <Input
                      id="request-longitude"
                      value={String(location.longitude)}
                      readOnly
                      className="bg-muted/40 font-mono text-sm"
                    />
                  </div>
                </div>
              </div>
            )}
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
