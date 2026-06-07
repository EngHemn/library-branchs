"use client"

import type { OrderDetail } from "@/domain/entities/order/OrderDetail"

export type OrderDetailStatus = "loading" | "loaded" | "not-found" | "error"

export type OrderDetailViewModelState = {
  status: OrderDetailStatus
  order: OrderDetail | null
  error: string | null
  isLoading: boolean
  isLoaded: boolean
  isNotFound: boolean
  isError: boolean
}
