import {
  BookOpenIcon,
  Building2Icon,
  CircleCheckIcon,
  CircleSlashIcon,
  NetworkIcon,
} from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"

import type { BranchStats } from "@/domain/entities/branch/Branch"
import type { TranslationKey } from "@/presentation/i18n/messages"
import { useTranslation } from "@/presentation/i18n/useTranslation"

type BranchStatsCardsProps = {
  stats: BranchStats
  hideMainBranchCard?: boolean
}
const statKeys = [
  {
    key: "totalBranches" as const,
    icon: Building2Icon,
    className: "bg-sky-100 text-sky-600",
  },
  {
    key: "mainBranches" as const,
    icon: BookOpenIcon,
    className: "bg-violet-100 text-violet-600",
    mainOnly: true,
  },
  {
    key: "subBranches" as const,
    icon: NetworkIcon,
    className: "bg-orange-100 text-orange-600",
  },
  {
    key: "activeBranches" as const,
    icon: CircleCheckIcon,
    className: "bg-emerald-100 text-emerald-600",
  },
  {
    key: "inactiveBranches" as const,
    icon: CircleSlashIcon,
    className: "bg-rose-100 text-rose-600",
  },
]

export function BranchStatsCards({
  stats,
  hideMainBranchCard = false,
}: BranchStatsCardsProps) {
  const { t } = useTranslation()

  const cards = statKeys
    .filter((card) => !card.mainOnly || !hideMainBranchCard)
    .map((card) => ({
      label: t(`branches.stats.${card.key}` as TranslationKey),
      value: stats[card.key],
      icon: card.icon,
      className: card.className,
    }))

  return (
    <section
      className={`grid grid-cols-2 gap-4 ${hideMainBranchCard ? "sm:grid-cols-4" : "sm:grid-cols-5"}`}
    >
      {cards.map((card) => {
        const Icon = card.icon

        return (
          <Card
            key={card.label}
            className="flex w-full flex-row items-center gap-4 rounded-lg p-4 shadow-sm"
          >
            {/* Left Icon Chip */}
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full ${card.className}`}
            >
              <Icon className="size-4" />
            </div>

            {/* Right Text */}
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">
                {card.label}
              </span>
              <span className="text-lg font-semibold">
                {card.value.toLocaleString()}
              </span>
            </div>
          </Card>
        )
      })}
    </section>
  )
}
