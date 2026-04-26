import type { Metadata } from "next";
import Script from "next/script";
import { headers } from "next/headers";

// Fonts
import localFont from "next/font/local";

// Style
import "../styles/_reset.scss";
import "../styles/theme.scss";
import "./globals.css";
import "../styles/_variables.scss";
import "../styles/_mixins.scss";
import "../styles/_global.scss";
import "../styles/details/scrollbar.scss";
import "../styles/details/selection.scss";

// Providers
import { ThemeProvider } from "@/contexts/useThemeContext";
import { LangProvider } from "@/contexts/useLangContext";

// Script
import { getThemeBootInlineScript } from "./theme-boot-script";

// Using
import { AVAILABLE_LANGCODE, ISO_LANG_MAP } from "@/lang/main";

// Fonts Creating

const poppins = localFont({
  src: "../../public/fonts/Poppins/Poppins-Regular.ttf",
  variable: "--font-poppins",
});

const fugaz = localFont({
  src: "../../public/fonts/Fugaz_One/FugazOne-Regular.ttf",
  variable: "--font-fugaz",
});

// Favicon

const PATH_FAVICON_LIGHT: string = "favicon/tmtc-favicon-black.ico";
const PATH_FAVICON_DARK: string = "favicon/tmtc-favicon-white.ico";

// Meta

export const metadata: Metadata = {
  title: "Tell Me The Color!",
  description: "Tell Me The Color! A cooperative mini-game to guess the color. One person sees the color and the other has to guess.",
  icons: {
    icon: [
      { url: PATH_FAVICON_DARK, media: "(prefers-color-scheme: dark)" },
      { url: PATH_FAVICON_LIGHT, media: "(prefers-color-scheme: light)" },
    ],
  },
};

function resolveRequestLang(acceptLanguage: string | null | undefined) {
  const fallback = ISO_LANG_MAP.US;
  if (!acceptLanguage) return fallback;

  const supported = Object.values(ISO_LANG_MAP);

  // e.g.: "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7"
  const tokens = acceptLanguage
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  for (const token of tokens) {
    const code = token.split(";")[0]?.trim();
    if (!code) continue;

    // match
    if (supported.includes(code as AVAILABLE_LANGCODE)) return code;

    // match generic (pt -> pt-BR)
    const primary = code.split("-")[0]?.toLowerCase();
    if (!primary) continue;
    const found = supported.find((l) => l.toLowerCase().startsWith(primary + "-"));
    if (found) return found;
  }

  return fallback;
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const hdrs = await headers();
  const initialResolvedLang = resolveRequestLang(hdrs.get("accept-language"));

  return (
    <html 
      dir="ltr" 
      lang={initialResolvedLang} 
      suppressHydrationWarning
      className={`${poppins.variable} ${fugaz.variable} antialiased`}
    >
      <head>
        <Script
          id="theme-boot"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: getThemeBootInlineScript() }}
        />
      </head>

      <body className={`min-h-dvh min-w-dvw flex flex-col`}>
        <LangProvider initialResolvedLang={initialResolvedLang as AVAILABLE_LANGCODE}>
          <ThemeProvider>
            <main className="w-full h-full flex flex-col">{children}</main>
          </ThemeProvider>
        </LangProvider>
      </body>
    </html>
  );
}
