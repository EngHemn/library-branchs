export function formatShelfLocation(parts: Array<{ value: string }>): string {
  return parts
    .map((part) => part.value)
    .filter((value) => value.trim().length > 0)
    .join(" / ")
}

export function formatShelfLocationParts(
  parts: Array<{ stepLabel: string; value: string }>
): string {
  return formatShelfLocation(parts)
}
