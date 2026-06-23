"use client"

import { useEffect, useRef, useState } from "react"

import { Skeleton } from "@/components/ui/skeleton"
import {
  hasValidMapCoordinates,
  normalizeCoordinate,
} from "@/presentation/components/orders/orderDisplay"

type OrderLocationMapProps = {
  latitude: number | null | undefined
  longitude: number | null | undefined
  heightClassName?: string
  interactive?: boolean
  onLocationChange?: (latitude: number | null, longitude: number | null) => void
}

type MapState = "loading" | "ready"

const DEFAULT_CENTER: [number, number] = [42.3601, -71.0589]
const DEFAULT_ZOOM = 13

export function OrderLocationMap({
  latitude,
  longitude,
  heightClassName = "h-[320px]",
  interactive = false,
  onLocationChange,
}: OrderLocationMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<import("leaflet").Map | null>(null)
  const markerRef = useRef<import("leaflet").Marker | null>(null)
  const [mapState, setMapState] = useState<MapState>("loading")

  const normalizedLatitude = normalizeCoordinate(latitude)
  const normalizedLongitude = normalizeCoordinate(longitude)
  const hasLocation = hasValidMapCoordinates(
    normalizedLatitude,
    normalizedLongitude
  )

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
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      })

      if (cancelled || !mapContainerRef.current) {
        return
      }

      const center: [number, number] = hasLocation
        ? [normalizedLatitude!, normalizedLongitude!]
        : DEFAULT_CENTER

      const map = L.map(mapContainerRef.current, {
        center,
        zoom: DEFAULT_ZOOM,
        zoomControl: true,
        scrollWheelZoom: interactive,
      })

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map)

      if (hasLocation) {
        const marker = L.marker([normalizedLatitude!, normalizedLongitude!], {
          draggable: interactive,
        }).addTo(map)

        if (interactive && onLocationChange) {
          marker.on("dragend", () => {
            const position = marker.getLatLng()
            onLocationChange(
              Math.round(position.lat * 1e6) / 1e6,
              Math.round(position.lng * 1e6) / 1e6
            )
          })
        }

        markerRef.current = marker
      }

      if (interactive && onLocationChange) {
        map.on("click", (event: import("leaflet").LeafletMouseEvent) => {
          const lat = Math.round(event.latlng.lat * 1e6) / 1e6
          const lng = Math.round(event.latlng.lng * 1e6) / 1e6

          if (markerRef.current) {
            markerRef.current.setLatLng([lat, lng])
          } else {
            const newMarker = L.marker([lat, lng], { draggable: true }).addTo(
              map
            )
            newMarker.on("dragend", () => {
              const position = newMarker.getLatLng()
              onLocationChange(
                Math.round(position.lat * 1e6) / 1e6,
                Math.round(position.lng * 1e6) / 1e6
              )
            })
            markerRef.current = newMarker
          }

          onLocationChange(lat, lng)
        })
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
    if (!mapInstanceRef.current) {
      return
    }

    async function syncMarker(): Promise<void> {
      const L = (await import("leaflet")).default
      const map = mapInstanceRef.current

      if (!map) {
        return
      }

      if (hasValidMapCoordinates(normalizedLatitude, normalizedLongitude)) {
        const lat = normalizedLatitude!
        const lng = normalizedLongitude!

        if (markerRef.current) {
          markerRef.current.setLatLng([lat, lng])
        } else {
          const marker = L.marker([lat, lng], {
            draggable: interactive,
          }).addTo(map)

          if (interactive && onLocationChange) {
            marker.on("dragend", () => {
              const position = marker.getLatLng()
              onLocationChange(
                Math.round(position.lat * 1e6) / 1e6,
                Math.round(position.lng * 1e6) / 1e6
              )
            })
          }

          markerRef.current = marker
        }

        map.setView([lat, lng], map.getZoom())
      } else if (markerRef.current) {
        markerRef.current.remove()
        markerRef.current = null
      }
    }

    void syncMarker()
  }, [normalizedLatitude, normalizedLongitude, interactive, onLocationChange])

  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
        markerRef.current = null
      }
    }
  }, [])

  return (
    <div
      className={`w-full overflow-hidden rounded-md border ${heightClassName}`}
    >
      {mapState === "loading" ? <Skeleton className="h-full w-full" /> : null}
      <div
        ref={mapContainerRef}
        className="h-full w-full"
        style={{ zIndex: 0 }}
      />
    </div>
  )
}
