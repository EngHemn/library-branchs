import type { ShelfLocationOptions } from "@/domain/entities/shelf/ShelfLocationOptions"

const sectionValues = [
  "Fiction",
  "Reference",
  "Non-Fiction",
  "New Arrivals",
  "Archive",
  "Storage",
  "Overflow",
  "Featured",
  "Display",
  "Processing",
  "Receiving",
  "Picture Books",
  "Young Readers",
]

export const fakeShelfLocationOptions: ShelfLocationOptions = {
  steps: [
    { id: "LOC-STEP-001", label: "Zone" },
    { id: "LOC-STEP-002", label: "Section" },
    { id: "LOC-STEP-003", label: "Row" },
    { id: "LOC-STEP-BAY", label: "Bay" },
    { id: "LOC-STEP-SLOT", label: "Slot" },
  ],
  valuesByStepId: {
    "LOC-STEP-001": [
      "Ground Floor",
      "Basement",
      "Lobby",
      "Back Office",
      "Warehouse",
      "Children Area",
    ],
    "LOC-STEP-002": sectionValues,
    "LOC-STEP-003": [
      "Row 1",
      "Row 2",
      "Row 3",
      "Row 4",
      "Bay 1",
      "Bay 2",
      "Aisle 4",
      "Display Wall",
      "Front Window",
      "Corner A",
      "Room A",
    ],
    "LOC-STEP-BAY": [
      "Left Bay",
      "Center Bay",
      "Right Bay",
      "Top Row",
      "Bottom Row",
    ],
    "LOC-STEP-SLOT": Array.from({ length: 20 }, (_, index) =>
      `Slot ${String(index + 1).padStart(2, "0")}`
    ),
  },
}
