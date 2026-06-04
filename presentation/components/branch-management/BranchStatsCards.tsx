import {
  BookOpenIcon,
  Building2Icon,
  CircleCheckIcon,
  CircleSlashIcon,
  NetworkIcon,
} from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import type { BranchStats } from "@/domain/entities/branch/Branch"

type BranchStatsCardsProps = {
  stats: BranchStats
  hideMainBranchCard?: boolean
}
export function BranchStatsCards({
  stats,
  hideMainBranchCard = false,
}: BranchStatsCardsProps) {
  const cards = [
    {
      label: "Total Branches",
      value: stats.totalBranches,
      icon: Building2Icon,
      className: "bg-sky-100 text-sky-600",
    },
    ...(!hideMainBranchCard
      ? [
          {
            label: "Main Branches",
            value: stats.mainBranches,
            icon: BookOpenIcon,
            className: "bg-violet-100 text-violet-600",
          },
        ]
      : []),
    {
      label: "Sub Branches",
      value: stats.subBranches,
      icon: NetworkIcon,
      className: "bg-orange-100 text-orange-600",
    },
    {
      label: "Active Branches",
      value: stats.activeBranches,
      icon: CircleCheckIcon,
      className: "bg-emerald-100 text-emerald-600",
    },
    {
      label: "Inactive Branches",
      value: stats.inactiveBranches,
      icon: CircleSlashIcon,
      className: "bg-rose-100 text-rose-600",
    },
  ]

  return (
    <section
      className={`grid grid-cols-2 gap-4 ${hideMainBranchCard ? "sm:grid-cols-4" : "sm:grid-cols-5"}`}
    >
      {cards.map((card) => {
        const Icon = card.icon

        return (
          <Card
            key={card.label}
            className="flex items-center flex-row shadow-sm  gap-4 p-4 rounded-lg w-full "
          >
            {/* Left Icon Chip */}
            <div
              className={`h-10 w-10 flex items-center justify-center rounded-full ${card.className}`}
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