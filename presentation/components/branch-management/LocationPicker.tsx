  "use client"

  import { useEffect, useRef, useState } from "react"
  import { MapPinIcon, SearchIcon, XCircleIcon } from "lucide-react"

  import { Button } from "@/components/ui/button"
  import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
  import { Input } from "@/components/ui/input"
  import { Label } from "@/components/ui/label"
  import { Skeleton } from "@/components/ui/skeleton"

  type LocationPickerProps = {
    latitude: number | null
    longitude: number | null
    locationError?: string | null
    onChange: (latitude: number | null, longitude: number | null) => void
    disabled?: boolean
  }

  type LeafletMapState = "loading" | "ready"

  const DEFAULT_CENTER: [number, number] = [42.3601, -71.0589]
  const DEFAULT_ZOOM = 12

  export function LocationPicker({
    latitude,
    longitude,
    locationError,
    onChange,
    disabled = false,
  }: LocationPickerProps) {
    const mapContainerRef = useRef<HTMLDivElement>(null)
    const mapInstanceRef = useRef<import("leaflet").Map | null>(null)
    const markerRef = useRef<import("leaflet").Marker | null>(null)
    const [mapState, setMapState] = useState<LeafletMapState>("loading")
    const [searchQuery, setSearchQuery] = useState("")
    const [isSearching, setIsSearching] = useState(false)
    const [searchError, setSearchError] = useState<string | null>(null)

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
          latitude !== null && longitude !== null
            ? [latitude, longitude]
            : DEFAULT_CENTER

        const map = L.map(mapContainerRef.current, {
          center,
          zoom: DEFAULT_ZOOM,
          zoomControl: true,
        })

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(map)

        if (latitude !== null && longitude !== null) {
          const marker = L.marker([latitude, longitude], {
            draggable: !disabled,
          }).addTo(map)

          marker.on("dragend", () => {
            const position = marker.getLatLng()
            onChange(
              Math.round(position.lat * 1e6) / 1e6,
              Math.round(position.lng * 1e6) / 1e6
            )
          })

          markerRef.current = marker
        }

        if (!disabled) {
          map.on("click", (event: import("leaflet").LeafletMouseEvent) => {
            const lat = Math.round(event.latlng.lat * 1e6) / 1e6
            const lng = Math.round(event.latlng.lng * 1e6) / 1e6

            if (markerRef.current) {
              markerRef.current.setLatLng([lat, lng])
            } else {
              const newMarker = L.marker([lat, lng], {
                draggable: true,
              }).addTo(map)

              newMarker.on("dragend", () => {
                const position = newMarker.getLatLng()
                onChange(
                  Math.round(position.lat * 1e6) / 1e6,
                  Math.round(position.lng * 1e6) / 1e6
                )
              })

              markerRef.current = newMarker
            }

            onChange(lat, lng)
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

        if (latitude !== null && longitude !== null) {
          if (markerRef.current) {
            markerRef.current.setLatLng([latitude, longitude])
          } else {
            const marker = L.marker([latitude, longitude], {
              draggable: !disabled,
            }).addTo(map)

            marker.on("dragend", () => {
              const position = marker.getLatLng()
              onChange(
                Math.round(position.lat * 1e6) / 1e6,
                Math.round(position.lng * 1e6) / 1e6
              )
            })

            markerRef.current = marker
          }

          map.setView([latitude, longitude], map.getZoom())
        } else if (markerRef.current) {
          markerRef.current.remove()
          markerRef.current = null
        }
      }

      void syncMarker()
    }, [latitude, longitude, disabled, onChange])

    useEffect(() => {
      return () => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove()
          mapInstanceRef.current = null
          markerRef.current = null
        }
      }
    }, [])

    async function handleSearch(): Promise<void> {
      if (!searchQuery.trim() || !mapInstanceRef.current) {
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

        const lat = Math.round(parseFloat(results[0].lat) * 1e6) / 1e6
        const lng = Math.round(parseFloat(results[0].lon) * 1e6) / 1e6

        onChange(lat, lng)
      } catch {
        setSearchError("Location search failed. Please try again.")
      }

      setIsSearching(false)
    }

    function handleClearLocation(): void {
      onChange(null, null)
    }

    return (
      <Card className="rounded-lg">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <MapPinIcon className="size-4" />
            Branch Location
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!disabled ? (
            <div className="space-y-2">
              <Label>Search by address</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter an address to search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      void handleSearch()
                    }
                  }}
                  disabled={disabled || isSearching}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => void handleSearch()}
                  disabled={disabled || isSearching || !searchQuery.trim()}
                >
                  <SearchIcon className="size-4" />
                  <span className="sr-only">Search</span>
                </Button>
              </div>
              {searchError ? (
                <p className="text-sm text-destructive">{searchError}</p>
              ) : null}
              <p className="text-xs text-muted-foreground">
                Or click on the map to place the marker.
              </p>
            </div>
          ) : null}

          <div className="h-[300px] w-full overflow-hidden rounded-md border">
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
              <Label htmlFor="latitude">Latitude</Label>
              <Input
                id="latitude"
                value={latitude !== null ? String(latitude) : ""}
                readOnly
                placeholder="Select location on map"
                className="bg-muted/40 font-mono text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="longitude">Longitude</Label>
              <Input
                id="longitude"
                value={longitude !== null ? String(longitude) : ""}
                readOnly
                placeholder="Select location on map"
                className="bg-muted/40 font-mono text-sm"
              />
            </div>
          </div>

          {locationError ? (
            <p className="text-sm text-destructive">{locationError}</p>
          ) : null}

          {latitude !== null && longitude !== null && !disabled ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClearLocation}
              className="text-muted-foreground hover:text-destructive"
            >
              <XCircleIcon className="size-4" />
              Clear location
            </Button>
          ) : null}
        </CardContent>
      </Card>
    )
  }
