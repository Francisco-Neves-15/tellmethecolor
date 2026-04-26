import {
  THEME_STORAGE_KEYS,
  THEME_COLOR_DEFAULTS,
  type ThemePrimaryColors,
} from "@/configs/theme-storage";
import { THEMES_MODES, type ThemeModeOptions } from "@/configs/theme-mode.metadata";

export function readStoredThemeMode(): ThemeModeOptions {
  if (typeof window === "undefined") return "system";

  const raw = localStorage.getItem(THEME_STORAGE_KEYS.mode) as ThemeModeOptions | null;
  if (raw && raw in THEMES_MODES) return raw;
  return "system";
}

export function readStoredPrimaryColors(): ThemePrimaryColors {
  if (typeof window === "undefined") return { ...THEME_COLOR_DEFAULTS };

  const colorPrimary =
    localStorage.getItem(THEME_STORAGE_KEYS.colorPrimary) ?? THEME_COLOR_DEFAULTS.colorPrimary;
  const colorPrimaryContrast =
    localStorage.getItem(THEME_STORAGE_KEYS.colorPrimaryContrast) ??
    THEME_COLOR_DEFAULTS.colorPrimaryContrast;
  const colorPrimaryAlpha =
    localStorage.getItem(THEME_STORAGE_KEYS.colorPrimaryAlpha) ??
    THEME_COLOR_DEFAULTS.colorPrimaryAlpha;

  return { colorPrimary, colorPrimaryContrast, colorPrimaryAlpha };
}
