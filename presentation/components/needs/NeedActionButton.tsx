"use client"

import type { LucideIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type NeedActionButtonProps = {
  icon: LucideIcon
  label: string
  variant?: "ghost" | "outline" | "destructive"
  onClick: () => void
  disabled?: boolean
}

export function NeedActionButton({
  icon: Icon,
  label,
  variant = "ghost",
  onClick,
  disabled = false,
}: NeedActionButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant={variant}
          size="icon-sm"
          title={label}
          aria-label={label}
          onClick={onClick}
          disabled={disabled}
        >
          <Icon />
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  )
}
