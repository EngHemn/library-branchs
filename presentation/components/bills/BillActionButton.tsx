"use client"

import type { LucideIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type BillActionButtonProps = {
  icon: LucideIcon
  label: string
  variant?: "ghost" | "outline" | "destructive"
  onClick: () => void
}

export function BillActionButton({
  icon: Icon,
  label,
  variant = "ghost",
  onClick,
}: BillActionButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant={variant}
          size="icon-sm"
          aria-label={label}
          onClick={onClick}
        >
          <Icon />
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  )
}
