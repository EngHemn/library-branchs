"use client"

import { getEventsUseCase } from "../eventsDependencies"
import { CreateEventScreen } from "@/presentation/screens/events/CreateEventScreen"

export default function CreateEventPage() {
  return <CreateEventScreen getEventsUseCase={getEventsUseCase} />
}
