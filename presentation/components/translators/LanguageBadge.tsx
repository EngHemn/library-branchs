import { Badge } from "@/components/ui/badge"
import { isBuiltInLanguage } from "@/lib/builtInLanguages"

type LanguageBadgeProps = {
  language: string
}

export function LanguageBadge({ language }: LanguageBadgeProps) {
  const builtIn = isBuiltInLanguage(language)

  return (
    <Badge
      variant={builtIn ? "secondary" : "outline"}
      className={
        builtIn
          ? "font-normal"
          : "font-normal text-muted-foreground"
      }
    >
      {language}
    </Badge>
  )
}
