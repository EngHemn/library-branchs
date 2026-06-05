"use client"

import type { Sale } from "@/domain/entities/sales/Sale"
import type { SalesUseCase } from "@/domain/usecases/sales/SalesUseCase"

export type SalesHistoryStatus = "idle" | "loading" | "success" | "error"

export type SalesHistoryViewModelState = {
  status: SalesHistoryStatus
  sales: Sale[]
  error: string | null
}
