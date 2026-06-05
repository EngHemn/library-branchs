"use client"

import { use } from "react"

import { getEventsUseCase } from "../eventsDependencies"
import { ViewEventScreen } from "@/presentation/screens/events/ViewEventScreen"

type ViewEventPageProps = {
  params: Promise<{
    id: string
  }>
}

export default function ViewEventPage({ params }: ViewEventPageProps) {
  const { id } = use(params)

  return <ViewEventScreen eventId={id} getEventsUseCase={getEventsUseCase} />
}
