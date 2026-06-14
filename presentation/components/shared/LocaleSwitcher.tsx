"use client"

import { GlobeIcon } from "lucide-react"

import type { SupportedLocale } from "@/domain/entities/locale/SupportedLocale"
import { SUPPORTED_LOCALES } from "@/domain/entities/locale/SupportedLocale"
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
import { useLocale } from "@/presentation/i18n/useLocale"
import { useTranslation } from "@/presentation/i18n/useTranslation"

const localeLabelKey = {
  en: "language.en",
  ar: "language.ar",
  ku: "language.ku",
} as const

export function LocaleSwitcher() {
  const { locale, setLocale } = useLocale()
  const { t } = useTranslation()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5"
          aria-label={t("header.language")}
        >
          <GlobeIcon />
          <span className="hidden sm:inline">{t(localeLabelKey[locale])}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuLabel>{t("header.language")}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={locale}
          onValueChange={(value) => setLocale(value as SupportedLocale)}
        >
          {SUPPORTED_LOCALES.map((option) => (
            <DropdownMenuRadioItem key={option} value={option}>
              {t(localeLabelKey[option])}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
