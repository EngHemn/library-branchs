import { cookies } from "next/headers"
import { Geist, Geist_Mono, Noto_Sans_Arabic } from "next/font/google"

import "./globals.css"
import {
  DEFAULT_LOCALE,
  isSupportedLocale,
  type SupportedLocale,
} from "@/domain/entities/locale/SupportedLocale"
import { getLocaleDirection } from "@/domain/i18n/getLocaleDirection"
import { LOCALE_COOKIE } from "@/lib/localeCookie"
import { ThemeProvider } from "@/components/theme-provider"
import { TooltipProvider } from "@/components/ui/tooltip"
import { ReactQueryProvider } from "@/components/query-provider"
import { I18nProvider } from "@/presentation/i18n/I18nProvider"
import { cn } from "@/lib/utils"

const geist = Geist({ subsets: ["latin"], variable: "--font-sans-en" })

const notoArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans-ar",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

async function readLocale(): Promise<SupportedLocale> {
  const cookieStore = await cookies()
  const value = cookieStore.get(LOCALE_COOKIE)?.value
  if (value && isSupportedLocale(value)) {
    return value
  }
  return DEFAULT_LOCALE
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const locale = await readLocale()
  const direction = getLocaleDirection(locale)

  return (
    <html
      lang={locale}
      dir={direction}
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        geist.variable,
        notoArabic.variable
      )}
    >
      <body>
        <ReactQueryProvider>
          <ThemeProvider>
            <I18nProvider initialLocale={locale}>
              <TooltipProvider>{children}</TooltipProvider>
            </I18nProvider>
          </ThemeProvider>
        </ReactQueryProvider>
      </body>
    </html>
  )
}
