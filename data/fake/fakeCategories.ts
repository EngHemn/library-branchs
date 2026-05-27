import type { Category } from "@/domain/entities/category/Category"

type FakeCategorySeed = Omit<Category, "totalBooks">

export const fakeCategorySeeds: FakeCategorySeed[] = [
  {
    id: "C001",
    name: "Novel",
    description: "Fiction novels and storytelling.",
    status: "active",
  },
  {
    id: "C002",
    name: "Poetry",
    description: "Poetry collections and verses.",
    status: "active",
  },
  {
    id: "C003",
    name: "History",
    description: "Historical books and biographies.",
    status: "active",
  },
  {
    id: "C004",
    name: "Children",
    description: "Children stories and learning books.",
    status: "active",
  },
  {
    id: "C005",
    name: "Science",
    description: "Science and technology books.",
    status: "active",
  },
  {
    id: "C006",
    name: "Self-Development",
    description: "Personal growth and productivity.",
    status: "active",
  },
]
