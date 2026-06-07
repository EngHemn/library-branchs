export const NEED_CATEGORIES = [
  "laptop",
  "desktop_computer",
  "printer",
  "scanner",
  "hard_disk",
  "projector",
  "bookshelf",
  "chair",
  "table",
  "network_equipment",
  "office_supplies",
  "other_equipment",
] as const

export type NeedCategory = (typeof NEED_CATEGORIES)[number]

const needCategoryLabels: Record<NeedCategory, string> = {
  laptop: "Laptop",
  desktop_computer: "Desktop Computer",
  printer: "Printer",
  scanner: "Scanner",
  hard_disk: "Hard Disk",
  projector: "Projector",
  bookshelf: "Bookshelf",
  chair: "Chair",
  table: "Table",
  network_equipment: "Network Equipment",
  office_supplies: "Office Supplies",
  other_equipment: "Other Equipment",
}

export function getNeedCategoryLabel(category: NeedCategory): string {
  return needCategoryLabels[category]
}
