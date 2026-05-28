import type { EventBranchBook } from "@/domain/entities/event/EventBranchBook"

type EventBranchBookSeed = Omit<EventBranchBook, "id">

const centralSummerBooks: EventBranchBookSeed[] = [
  {
    bookId: "BK-101",
    title: "The Midnight Library",
    isbn: "9780525559474",
    language: "English",
    category: "Fiction",
    author: "Matt Haig",
    translator: null,
    quantityAllocated: 45,
    quantityOnDisplay: 0,
  },
  {
    bookId: "BK-204",
    title: "Klara and the Sun",
    isbn: "9780593318171",
    language: "English",
    category: "Science Fiction",
    author: "Kazuo Ishiguro",
    translator: null,
    quantityAllocated: 32,
    quantityOnDisplay: 0,
  },
  {
    bookId: "BK-318",
    title: "Les Misérables",
    isbn: "9780140444308",
    language: "French",
    category: "Classics",
    author: "Victor Hugo",
    translator: "Julie Rose",
    quantityAllocated: 28,
    quantityOnDisplay: 0,
  },
  {
    bookId: "BK-422",
    title: "One Hundred Years of Solitude",
    isbn: "9780060883287",
    language: "Spanish",
    category: "Literary Fiction",
    author: "Gabriel García Márquez",
    translator: "Gregory Rabassa",
    quantityAllocated: 24,
    quantityOnDisplay: 0,
  },
  {
    bookId: "BK-509",
    title: "The Very Hungry Caterpillar",
    isbn: "9780399226908",
    language: "English",
    category: "Children",
    author: "Eric Carle",
    translator: null,
    quantityAllocated: 60,
    quantityOnDisplay: 0,
  },
  {
    bookId: "BK-611",
    title: "Sapiens",
    isbn: "9780062316097",
    language: "English",
    category: "Non-Fiction",
    author: "Yuval Noah Harari",
    translator: null,
    quantityAllocated: 38,
    quantityOnDisplay: 0,
  },
  {
    bookId: "BK-702",
    title: "Norwegian Wood",
    isbn: "9780375704024",
    language: "Japanese",
    category: "Literary Fiction",
    author: "Haruki Murakami",
    translator: "Jay Rubin",
    quantityAllocated: 22,
    quantityOnDisplay: 0,
  },
  {
    bookId: "BK-815",
    title: "The Alchemist",
    isbn: "9780062315007",
    language: "Portuguese",
    category: "Fiction",
    author: "Paulo Coelho",
    translator: "Alan R. Clarke",
    quantityAllocated: 35,
    quantityOnDisplay: 0,
  },
]

const authorMeetBooks: EventBranchBookSeed[] = [
  {
    bookId: "BK-901",
    title: "The Glass Orchard",
    isbn: "9780593322109",
    language: "English",
    category: "Fiction",
    author: "Elena Voss",
    translator: null,
    quantityAllocated: 50,
    quantityOnDisplay: 42,
  },
  {
    bookId: "BK-902",
    title: "Winter Letters",
    isbn: "9780593322116",
    language: "English",
    category: "Fiction",
    author: "Elena Voss",
    translator: null,
    quantityAllocated: 35,
    quantityOnDisplay: 30,
  },
]

const northsideStoryBooks: EventBranchBookSeed[] = [
  {
    bookId: "BK-509",
    title: "The Very Hungry Caterpillar",
    isbn: "9780399226908",
    language: "English",
    category: "Children",
    author: "Eric Carle",
    translator: null,
    quantityAllocated: 20,
    quantityOnDisplay: 0,
  },
  {
    bookId: "BK-510",
    title: "Where the Wild Things Are",
    isbn: "9780064431781",
    language: "English",
    category: "Children",
    author: "Maurice Sendak",
    translator: null,
    quantityAllocated: 15,
    quantityOnDisplay: 0,
  },
  {
    bookId: "BK-511",
    title: "Goodnight Moon",
    isbn: "9780694003617",
    language: "English",
    category: "Children",
    author: "Margaret Wise Brown",
    translator: null,
    quantityAllocated: 10,
    quantityOnDisplay: 0,
  },
]

const seedCatalog: Record<string, EventBranchBookSeed[]> = {
  "EVT-001:BR-001": centralSummerBooks,
  "EVT-001:BR-002": centralSummerBooks.slice(0, 5),
  "EVT-001:BR-003": centralSummerBooks.slice(2, 7),
  "EVT-002:BR-001": authorMeetBooks,
  "EVT-003:BR-002": northsideStoryBooks,
  "EVT-004:BR-003": [
    {
      bookId: "BK-801",
      title: "Selected Poems",
      isbn: "9780141185430",
      language: "English",
      category: "Poetry",
      author: "W.H. Auden",
      translator: null,
      quantityAllocated: 12,
      quantityOnDisplay: 0,
    },
    {
      bookId: "BK-802",
      title: "The Waste Land",
      isbn: "9780156005345",
      language: "English",
      category: "Poetry",
      author: "T.S. Eliot",
      translator: null,
      quantityAllocated: 10,
      quantityOnDisplay: 0,
    },
  ],
  "EVT-005:BR-001": centralSummerBooks.slice(0, 6),
  "EVT-005:BR-004": centralSummerBooks.slice(1, 5),
  "EVT-006:BR-007": [
    {
      bookId: "BK-701",
      title: "Codex Manuscript I",
      isbn: "9780007010012",
      language: "Latin",
      category: "History",
      author: "Anonymous",
      translator: "Iris Dalton",
      quantityAllocated: 4,
      quantityOnDisplay: 0,
    },
  ],
}

const fallbackBooks: EventBranchBookSeed[] = [
  {
    bookId: "BK-101",
    title: "The Midnight Library",
    isbn: "9780525559474",
    language: "English",
    category: "Fiction",
    author: "Matt Haig",
    translator: null,
    quantityAllocated: 12,
    quantityOnDisplay: 0,
  },
  {
    bookId: "BK-611",
    title: "Sapiens",
    isbn: "9780062316097",
    language: "English",
    category: "Non-Fiction",
    author: "Yuval Noah Harari",
    translator: null,
    quantityAllocated: 8,
    quantityOnDisplay: 0,
  },
  {
    bookId: "BK-318",
    title: "Les Misérables",
    isbn: "9780140444308",
    language: "French",
    category: "Classics",
    author: "Victor Hugo",
    translator: "Julie Rose",
    quantityAllocated: 6,
    quantityOnDisplay: 0,
  },
]

function toEventBranchBooks(
  eventId: string,
  branchId: string,
  seeds: EventBranchBookSeed[]
): EventBranchBook[] {
  return seeds.map((seed, index) => ({
    ...seed,
    id: `${eventId}-${branchId}-${index + 1}`,
  }))
}

export function getFakeEventBranchBooks(
  eventId: string,
  branchId: string
): EventBranchBook[] {
  const key = `${eventId}:${branchId}`
  const seeds = seedCatalog[key] ?? fallbackBooks

  return toEventBranchBooks(eventId, branchId, seeds)
}
