"use client"

import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react"
import { useTheme } from "next-themes"
import { useMemo } from "react"

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
import { useTranslation } from "@/presentation/i18n/useTranslation"

const themeOptions = [
  { value: "light", labelKey: "theme.light" as const, icon: SunIcon },
  { value: "dark", labelKey: "theme.dark" as const, icon: MoonIcon },
  { value: "system", labelKey: "theme.system" as const, icon: MonitorIcon },
] as const

function ThemeTriggerIcon({ theme }: { theme: string | undefined }) {
  if (theme === "dark") return <MoonIcon />
  if (theme === "system") return <MonitorIcon />
  return <SunIcon />
}

export function ThemeModeDropdown() {
  const { theme, setTheme } = useTheme()
  const hydrated = useHydrated()
  const { t } = useTranslation()

  const activeTheme = hydrated ? (theme ?? "system") : "system"
  const options = useMemo(
    () =>
      themeOptions.map((option) => ({
        ...option,
        label: t(option.labelKey),
      })),
    [t]
  )
  const activeLabel =
    options.find((o) => o.value === activeTheme)?.label ?? t("header.theme")

  const trigger = (
    <Button
      variant="outline"
      size="sm"
      className="gap-1.5"
      aria-label={t("header.theme")}
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
        <DropdownMenuLabel>{t("header.theme")}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={activeTheme} onValueChange={setTheme}>
          {options.map((option) => {
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
