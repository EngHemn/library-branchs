"use client"

import { useEffect, useState } from "react"

export type ColorThemeId =
  | "default"
  | "blue"
  | "purple"
  | "green"
  | "amber"
  | "rose"
  | "cyan"
  | "orange"
  | "pink"
  

export type ColorTheme = {
  id: ColorThemeId
  label: string
  color: string
  foreground: "white" | "dark"
}

export const colorThemes: ColorTheme[] = [
  { id: "default", label: "Default", color: "#a1a1aa", foreground: "white" },
  { id: "blue",    label: "Blue",    color: "#818cf8", foreground: "white" },
  { id: "purple",  label: "Purple",  color: "#a78bfa", foreground: "white" },
  { id: "green",   label: "Green",   color: "#34d399", foreground: "white" },
  { id: "amber",   label: "Amber",   color: "#fbbf24", foreground: "white" },
  { id: "rose",    label: "Rose",    color: "#fb7185", foreground: "white" },
  { id: "cyan",    label: "Cyan",    color: "#22d3ee", foreground: "white" },
  { id: "orange",  label: "Orange",  color: "#fb923c", foreground: "white" },
  { id: "pink",    label: "Pink",    color: "#f472b6", foreground: "white" },
]

const STORAGE_KEY = "liba-color-theme"
const DEFAULT_THEME: ColorThemeId = "default"

function applyColorTheme(themeId: ColorThemeId): void {
  if (themeId === "default") {
    document.documentElement.removeAttribute("data-color-theme")
  } else {
    document.documentElement.setAttribute("data-color-theme", themeId)
  }
}

export function useColorTheme() {
  const [colorTheme, setColorThemeState] =
    useState<ColorThemeId>(DEFAULT_THEME)

  useEffect(() => {
    const stored = (localStorage.getItem(STORAGE_KEY) ??
      DEFAULT_THEME) as ColorThemeId
    setColorThemeState(stored)
    applyColorTheme(stored)
  }, [])

  function setColorTheme(themeId: ColorThemeId): void {
    setColorThemeState(themeId)
    localStorage.setItem(STORAGE_KEY, themeId)
    applyColorTheme(themeId)
  }

  return { colorTheme, setColorTheme, colorThemes }
}