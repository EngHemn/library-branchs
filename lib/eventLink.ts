export function getEventViewHref(eventId: string): string {
  return `/dashboard/events/${eventId}`
}

export function getEventEditHref(eventId: string): string {
  return `/dashboard/events/${eventId}/edit`
}
