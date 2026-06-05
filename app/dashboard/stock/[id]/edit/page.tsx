"use client"

import { use } from "react"
import { EditStockScreen } from "@/presentation/screens/stock/EditStockScreen"
import { stockUseCase } from "../../stockDependencies"

type EditStockPageProps = {
  params: Promise<{
    id: string
  }>
}

export default function EditStockPage({ params }: EditStockPageProps) {
  const { id } = use(params)
  return <EditStockScreen stockId={id} stockUseCase={stockUseCase} />
}
