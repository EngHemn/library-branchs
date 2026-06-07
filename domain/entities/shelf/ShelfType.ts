export const SHELF_TYPES = [
  "standard",
  "reference",
  "display",
  "storage",
  "archive",
] as const

export type ShelfType = (typeof SHELF_TYPES)[number]

const shelfTypeLabels: Record<ShelfType, string> = {
  standard: "Standard",
  reference: "Reference",
  display: "Display",
  storage: "Storage",
  archive: "Archive",
}

export function getShelfTypeLabel(type: ShelfType): string {
  return shelfTypeLabels[type]
}
