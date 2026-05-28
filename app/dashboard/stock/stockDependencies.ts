"use client"

import { StockFakeDataSource } from "@/data/datasources/StockFakeDataSource"
import { StockRepositoryImpl } from "@/data/repositories/StockRepositoryImpl"
import { StockUseCase } from "@/domain/usecases/stock/StockUseCase"

const stockFakeDataSource = new StockFakeDataSource()
const stockRepository = new StockRepositoryImpl(stockFakeDataSource)

export const stockUseCase = new StockUseCase(stockRepository)
