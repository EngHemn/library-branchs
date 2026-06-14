"use client"

import { ExternalLinkIcon, MapPinIcon } from "lucide-react"

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
import type { OrderDetail } from "@/domain/entities/order/OrderDetail"
import { OrderLocationMap } from "@/presentation/components/orders/OrderLocationMap"
import {
  getOrderMapHref,
  hasValidMapCoordinates,
  normalizeCoordinate,
} from "@/presentation/components/orders/orderDisplay"
import { useTranslation } from "@/presentation/i18n/useTranslation"

type OrderLocationSectionProps = {
  order: OrderDetail
}

export function OrderLocationSection({ order }: OrderLocationSectionProps) {
  const { t } = useTranslation()
  const latitude = normalizeCoordinate(order.latitude)
  const longitude = normalizeCoordinate(order.longitude)
  const hasLocation = hasValidMapCoordinates(latitude, longitude)

  return (
    <Card className="rounded-lg">
      <CardHeader className="flex flex-row items-start justify-between gap-3">
        <div>
          <CardTitle className="flex items-center gap-2 text-base">
            <MapPinIcon className="size-4" />
            {t("orders.location.deliveryTitle")}
          </CardTitle>
          <CardDescription>{order.branchLocation}</CardDescription>
        </div>
        {hasLocation ? (
          <Button variant="outline" size="sm" asChild>
            <a
              href={getOrderMapHref(latitude!, longitude!)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLinkIcon className="size-4" />
              {t("orders.location.openInMap")}
            </a>
          </Button>
        ) : (
          <Button variant="outline" size="sm" disabled>
            <ExternalLinkIcon className="size-4" />
            {t("orders.location.openInMap")}
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {hasLocation ? (
          <OrderLocationMap
            latitude={latitude}
            longitude={longitude}
            heightClassName="h-[360px]"
          />
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 rounded-md border border-dashed py-12 text-center">
            <MapPinIcon className="size-8 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">
              {t("orders.location.noCoordinates")}
            </p>
          </div>
        )}

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="order-view-latitude">{t("orders.location.latitude")}</Label>
            <Input
              id="order-view-latitude"
              value={latitude !== null ? String(latitude) : "—"}
              readOnly
              className="bg-muted/40 font-mono text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="order-view-longitude">{t("orders.location.longitude")}</Label>
            <Input
              id="order-view-longitude"
              value={longitude !== null ? String(longitude) : "—"}
              readOnly
              className="bg-muted/40 font-mono text-sm"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
