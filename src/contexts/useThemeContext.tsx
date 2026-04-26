"use client";

import { createContext, useCallback, useEffect, useState } from "react";

import { ThemeModeOptions, ThemeModeResolved } from "@/configs/theme-mode.metadata";

import {
  THEME_STORAGE_KEYS,
  THEME_COLOR_DEFAULTS,
  HTML_KEY_MODE,
} from "@/configs/theme-storage";
import {
  readStoredPrimaryColors,
  readStoredThemeMode,
} from "@/utils/read-theme-prefs";

import { getResolvedThemeMode } from "@/utils/theme";

// context
export const ThemeContext = createContext({} as ThemeContextType);

// fallback
const FALLBACK_MODE: ThemeModeOptions = "system";

// main

type ThemeContextType = {
  themeMode: ThemeModeOptions;
  resolvedThemeMode: ThemeModeResolved;
  setThemeMode: (t: ThemeModeOptions) => void;

  colorPrimary: string;
  setColorPrimary: (c: string) => void;
  colorPrimaryContrast: string;
  setColorPrimaryContrast: (c: string) => void;
  colorPrimaryAlpha: string;
  setColorPrimaryAlpha: (c: string) => void;
};

// Body Classname to theme mode
function setClassNameBody(resolved: ThemeModeResolved) {
  const addClass = resolved === "dark" ? "dark" : "light";
  const removeClass = resolved === "dark" ? "light" : "dark";
  document.body.classList.add(addClass);
  document.body.classList.remove(removeClass);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeMode, setThemeModeState] = useState<ThemeModeOptions>(() =>
    typeof window === "undefined" ? FALLBACK_MODE : readStoredThemeMode()
  );

  const initColors =
    typeof window === "undefined" ? { ...THEME_COLOR_DEFAULTS } : readStoredPrimaryColors();

  const [colorPrimary, setColorPrimaryState] = useState<string>(initColors.colorPrimary);
  const [colorPrimaryContrast, setColorPrimaryContrastState] = useState<string>(
    initColors.colorPrimaryContrast
  );
  const [colorPrimaryAlpha, setColorPrimaryAlphaState] = useState<string>(
    initColors.colorPrimaryAlpha
  );

  // Synchronizes DOM (and CSS variables) with state — no API side effects here.
  useEffect(() => {
    const root = document.documentElement;

    const resolvedThemeMode = getResolvedThemeMode(themeMode);

    root.setAttribute(HTML_KEY_MODE, resolvedThemeMode);

    setClassNameBody(resolvedThemeMode);

    root.style.setProperty("--color-primary", colorPrimary);
    root.style.setProperty("--color-primaryContrast", colorPrimaryContrast);
    root.style.setProperty("--color-primaryAlpha", colorPrimaryAlpha);
  }, [themeMode, colorPrimary, colorPrimaryContrast, colorPrimaryAlpha]);

  // listern when change the systemThemeMode
  useEffect(() => {
    if (themeMode !== "system") return;

    const media = window.matchMedia("(prefers-color-scheme: dark)");

    // main
    const handleChangeThemeMode = () => {
      const resolved = media.matches ? "dark" : "light";

      document.documentElement.setAttribute(HTML_KEY_MODE, resolved);
      setClassNameBody(resolved);
    };

    media.addEventListener("change", handleChangeThemeMode);

    return () => {
      media.removeEventListener("change", handleChangeThemeMode);
    };
  }, [themeMode]);

  // sets

  const setThemeMode = useCallback((t: ThemeModeOptions) => {
    setThemeModeState(t);

    if (t === "system") {
      localStorage.removeItem(THEME_STORAGE_KEYS.mode);
    } else {
      localStorage.setItem(THEME_STORAGE_KEYS.mode, t);
    }

    // API POINT
  }, []);

  const setColorPrimary = useCallback((c: string) => {
    setColorPrimaryState(c);
    localStorage.setItem(THEME_STORAGE_KEYS.colorPrimary, c);
    // API POINT
  }, []);

  const setColorPrimaryContrast = useCallback((c: string) => {
    setColorPrimaryContrastState(c);
    localStorage.setItem(THEME_STORAGE_KEYS.colorPrimaryContrast, c);
    // API POINT
  }, []);

  const setColorPrimaryAlpha = useCallback((c: string) => {
    setColorPrimaryAlphaState(c);
    localStorage.setItem(THEME_STORAGE_KEYS.colorPrimaryAlpha, c);
    // API POINT
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        themeMode,
        resolvedThemeMode: getResolvedThemeMode(themeMode),
        setThemeMode,

        colorPrimary,
        setColorPrimary,
        colorPrimaryContrast,
        setColorPrimaryContrast,
        colorPrimaryAlpha,
        setColorPrimaryAlpha,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
