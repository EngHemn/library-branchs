import type { LoginType } from "@/domain/entities/LoginType"
import type { TranslationKey } from "@/presentation/i18n/messages"

type TranslateFn = (key: TranslationKey) => string

const loginTypeLabelKeys: Record<LoginType, TranslationKey> = {
  main: "auth.mainBranch",
  main_no_sub: "auth.mainBranchNoSub",
  sub: "auth.subBranch",
}

export function getLoginTypeLabel(
  loginType: LoginType | undefined,
  t: TranslateFn
): string {
  if (!loginType) return ""
  return t(loginTypeLabelKeys[loginType])
}
