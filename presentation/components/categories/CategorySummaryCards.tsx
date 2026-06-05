"use client"

import { Card, CardContent } from "@/components/ui/card"
import type { Category } from "@/domain/entities/category/Category"

type CategorySummaryCardsProps = {
  categories: Category[]
}

export function CategorySummaryCards({ categories }: CategorySummaryCardsProps) {
  if (categories.length === 0) {
    return null
  }

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {categories.map((category) => (
        <Card key={category.id} className="rounded-lg">
          <CardContent className="flex items-start justify-between gap-4 py-4">
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold">{category.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                {category.description}
              </p>
            </div>
            <div className="flex shrink-0 flex-col items-center text-center">
              <span className="text-2xl font-bold text-violet-600 dark:text-violet-400">
                {category.totalBooks}
              </span>
              <span className="text-xs text-muted-foreground">books</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </section>
  )
}
