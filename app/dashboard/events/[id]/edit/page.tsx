"use client"

import { use } from "react"

import { getEventsUseCase } from "../../eventsDependencies"
import { EditEventScreen } from "@/presentation/screens/events/EditEventScreen"

type EditEventPageProps = {
  params: Promise<{
    id: string
  }>
}

export default function EditEventPage({ params }: EditEventPageProps) {
  const { id } = use(params)

  return <EditEventScreen eventId={id} getEventsUseCase={getEventsUseCase} />
}
