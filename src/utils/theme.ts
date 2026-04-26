import {
  THEME_MODE_META,
  ThemeModeOptions,
  ThemeModeResolved,
} from "@/configs/theme-mode.metadata";

// Mode

export const getResolvedThemeMode = (mode: ThemeModeOptions): ThemeModeResolved => {
  return THEME_MODE_META[mode].resolve();
};

export const getSystemThemeMode = (): ThemeModeResolved => {
  // fallback SSR
  if (typeof window === "undefined") return "light";

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};
