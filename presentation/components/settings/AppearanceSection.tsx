"use client"

import { CheckIcon, MonitorIcon, MoonIcon, SunIcon } from "lucide-react"
import { useTheme } from "next-themes"

import { cn } from "@/lib/utils"
import { useColorTheme } from "@/presentation/hooks/useColorTheme"

type CSSWithVars = React.CSSProperties & Record<`--${string}`, string | number>

type ModeOption = {
  id: string
  label: string
  icon: React.ReactNode
}

const modeOptions: ModeOption[] = [
  {
    id: "light",
    label: "Light",
    icon: <SunIcon className="h-5 w-5" />,
  },
  {
    id: "dark",
    label: "Dark",
    icon: <MoonIcon className="h-5 w-5" />,
  },
  {
    id: "system",
    label: "System",
    icon: <MonitorIcon className="h-5 w-5" />,
  },
]

function ModePreview({ mode }: { mode: string }) {
  if (mode === "dark") {
    return (
      <div className="overflow-hidden rounded-md border border-border">
        <div className="flex h-[80px] flex-col bg-zinc-950 p-2 gap-1">
          <div className="h-2 w-16 rounded bg-zinc-800" />
          <div className="flex gap-1 flex-1">
            <div className="w-10 rounded bg-zinc-800" />
            <div className="flex-1 rounded bg-zinc-900" />
          </div>
        </div>
      </div>
    )
  }

  if (mode === "system") {
    return (
      <div className="overflow-hidden rounded-md border border-border">
        <div className="flex h-[80px]">
          <div className="flex flex-1 flex-col bg-white p-2 gap-1">
            <div className="h-2 w-8 rounded bg-zinc-200" />
            <div className="flex gap-1 flex-1">
              <div className="w-5 rounded bg-zinc-100" />
              <div className="flex-1 rounded bg-zinc-50" />
            </div>
          </div>
          <div className="flex flex-1 flex-col bg-zinc-950 p-2 gap-1">
            <div className="h-2 w-8 rounded bg-zinc-800" />
            <div className="flex gap-1 flex-1">
              <div className="w-5 rounded bg-zinc-800" />
              <div className="flex-1 rounded bg-zinc-900" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-md border border-border">
      <div className="flex h-[80px] flex-col bg-white p-2 gap-1">
        <div className="h-2 w-16 rounded bg-zinc-200" />
        <div className="flex gap-1 flex-1">
          <div className="w-10 rounded bg-zinc-100" />
          <div className="flex-1 rounded bg-zinc-50" />
        </div>
      </div>
    </div>
  )
}

export function AppearanceSection() {
  const { theme, setTheme } = useTheme()
  const { colorTheme, setColorTheme, colorThemes } = useColorTheme()

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <div className="space-y-1">
          <p className="text-sm font-medium">Color Mode</p>
          <p className="text-sm text-muted-foreground">
            Choose how the interface looks. System follows your OS preference.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-3 md:max-w-lg">
          {modeOptions.map((option) => {
            const isSelected = theme === option.id

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => setTheme(option.id)}
                className={cn(
                  "group flex flex-col gap-2 rounded-xl border-2 p-1 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  isSelected
                    ? "border-primary"
                    : "border-border hover:border-primary/40"
                )}
              >
                <ModePreview mode={option.id} />
                <span className="flex items-center justify-center gap-1.5 pb-1 text-xs font-medium">
                  {option.icon}
                  {option.label}
                  {isSelected && (
                    <CheckIcon className="h-3 w-3 text-primary" />
                  )}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="space-y-3">
        <div className="space-y-1">
          <p className="text-sm font-medium">Accent Color</p>
          <p className="text-sm text-muted-foreground">
            Sets the primary accent used for buttons, links, and highlights.
          </p>
        </div>
        <div
          className="flex flex-wrap gap-2 sm:gap-3"
          role="radiogroup"
          aria-label="Accent color"
        >
          {colorThemes.map((ct) => {
            const isSelected = colorTheme === ct.id

            return (
              <button
                key={ct.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => setColorTheme(ct.id)}
                className={cn(
                  "group flex flex-col items-center gap-2 rounded-lg p-1.5 transition-all duration-200 ease-in-out",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  isSelected && "ring-2 ring-offset-2 ring-offset-background"
                )}
                style={
                  isSelected
                    ? ({ "--tw-ring-color": ct.color } as CSSWithVars)
                    : undefined
                }
              >
                <span
                  className={cn(
                    "relative flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all duration-200 ease-in-out",
                    isSelected
                      ? "scale-110 border-white/90 shadow-md"
                      : "border-transparent group-hover:scale-105 group-hover:border-foreground/30"
                  )}
                  style={{ backgroundColor: ct.color }}
                  aria-hidden
                >
                  {isSelected && (
                    <CheckIcon className="h-4 w-4 text-white drop-shadow-sm" />
                  )}
                </span>
                <span
                  className={cn(
                    "rounded-full px-2.5 py-0.5 text-xs font-medium",
                    "transition-[background-color,color,box-shadow] duration-200 ease-in-out",
                    isSelected
                      ? "text-white shadow-sm"
                      : "bg-muted text-muted-foreground group-hover:text-foreground/80"
                  )}
                  style={
                    isSelected ? { backgroundColor: ct.color } : undefined
                  }
                >
                  {ct.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
