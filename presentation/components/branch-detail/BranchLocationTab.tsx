"use client"

import { useEffect, useRef, useState } from "react"
import { MapPinIcon, NavigationIcon } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import type { BranchDetail } from "@/domain/entities/branch/BranchDetail"
import { useTranslation } from "@/presentation/i18n/useTranslation"

type BranchLocationTabProps = {
  branchDetail: BranchDetail
}

type MapState = "loading" | "ready"

const DEFAULT_CENTER: [number, number] = [42.3601, -71.0589]
const DEFAULT_ZOOM = 12

export function BranchLocationTab({ branchDetail }: BranchLocationTabProps) {
  const { t } = useTranslation()
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<import("leaflet").Map | null>(null)
  const [mapState, setMapState] = useState<MapState>("loading")

  const hasLocation =
    branchDetail.latitude !== null && branchDetail.longitude !== null

  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) {
      return
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

      if (cancelled || !mapContainerRef.current) {
        return
      }

      const center: [number, number] =
        branchDetail.latitude !== null && branchDetail.longitude !== null
          ? [branchDetail.latitude, branchDetail.longitude]
          : DEFAULT_CENTER

      const map = L.map(mapContainerRef.current, {
        center,
        zoom: DEFAULT_ZOOM,
        zoomControl: true,
        dragging: true,
        scrollWheelZoom: false,
      })

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map)

      if (branchDetail.latitude !== null && branchDetail.longitude !== null) {
        L.marker([branchDetail.latitude, branchDetail.longitude]).addTo(map)
      }

      mapInstanceRef.current = map
      setMapState("ready")
    }

    void initMap()

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  if (!hasLocation) {
    return (
      <Card className="rounded-lg">
        <CardContent className="flex flex-col items-center justify-center gap-3 py-16">
          <div className="flex size-12 items-center justify-center rounded-full bg-muted">
            <MapPinIcon className="size-6 text-muted-foreground" />
          </div>
          <div className="text-center">
            <p className="font-medium">{t("branches.location.noLocationSet")}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("branches.location.noLocationDescription")}
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <Card className="rounded-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <MapPinIcon className="size-4" />
            {t("branches.location.title")}
          </CardTitle>
          <CardDescription>{branchDetail.address}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-[400px] w-full overflow-hidden rounded-md border">
            {mapState === "loading" ? (
              <Skeleton className="h-full w-full" />
            ) : null}
            <div
              ref={mapContainerRef}
              className="h-full w-full"
              style={{ zIndex: 0 }}
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="view-latitude">{t("branches.location.latitude")}</Label>
              <Input
                id="view-latitude"
                value={String(branchDetail.latitude)}
                readOnly
                className="bg-muted/40 font-mono text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="view-longitude">{t("branches.location.longitude")}</Label>
              <Input
                id="view-longitude"
                value={String(branchDetail.longitude)}
                readOnly
                className="bg-muted/40 font-mono text-sm"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <NavigationIcon className="size-4" />
            {t("branches.location.addressDetails")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{branchDetail.address}</p>
        </CardContent>
      </Card>
    </div>
  )
}
