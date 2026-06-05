"use client"

import { SalesFakeDataSource } from "@/data/datasources/SalesFakeDataSource"
import { SalesRepositoryImpl } from "@/data/repositories/SalesRepositoryImpl"
import { SalesUseCase } from "@/domain/usecases/sales/SalesUseCase"

const salesFakeDataSource = new SalesFakeDataSource()
const salesRepository = new SalesRepositoryImpl(salesFakeDataSource)

export const salesUseCase = new SalesUseCase(salesRepository)
