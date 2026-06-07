"use client"

import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useHydrated } from "@/hooks/use-hydrated"

const themeOptions = [
  { value: "light", label: "Light", icon: SunIcon },
  { value: "dark", label: "Dark", icon: MoonIcon },
  { value: "system", label: "System", icon: MonitorIcon },
] as const

function ThemeTriggerIcon({ theme }: { theme: string | undefined }) {
  if (theme === "dark") return <MoonIcon />
  if (theme === "system") return <MonitorIcon />
  return <SunIcon />
}

export function ThemeModeDropdown() {
  const { theme, setTheme } = useTheme()
  const hydrated = useHydrated()

  const activeTheme = hydrated ? (theme ?? "system") : "system"
  const activeLabel =
    themeOptions.find((o) => o.value === activeTheme)?.label ?? "Theme"

  const trigger = (
    <Button
      variant="outline"
      size="sm"
      className="gap-1.5"
      aria-label="Color mode"
    >
      {hydrated ? (
        <ThemeTriggerIcon theme={activeTheme} />
      ) : (
        <SunIcon className="opacity-0" aria-hidden />
      )}
      <span className="hidden sm:inline">{activeLabel}</span>
    </Button>
  )

  if (!hydrated) {
    return trigger
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuLabel>Color mode</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={activeTheme}
          onValueChange={setTheme}
        >
          {themeOptions.map((option) => {
            const Icon = option.icon
            return (
              <DropdownMenuRadioItem key={option.value} value={option.value}>
                <Icon />
                {option.label}
              </DropdownMenuRadioItem>
            )
          })}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
