"use client"

import { getEventsUseCase } from "./eventsDependencies"
import { EventsScreen } from "@/presentation/screens/events/EventsScreen"

export default function EventsPage() {
  return <EventsScreen getEventsUseCase={getEventsUseCase} />
}
