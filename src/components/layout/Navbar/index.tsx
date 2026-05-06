"use client";
import { CSSProperties, useEffect, useRef, useState } from "react";

// Icons
import { LuMenu, LuX, LuSun, LuMoon, LuMonitorSmartphone } from "react-icons/lu";

// Styles
import fStyles from "./style.module.scss";

// Components
import { View } from "@/components/ui/own/View";
import { Text } from "@/components/ui/own/Text";
import { Button } from "@/components/ui/own/Button";
import { Select, selectValueIsPrimitive, TSelectItems } from "@/components/ui/own/Select";

// Hooks
import { useI18n } from "@/hooks/useI18n";
import { useMedia } from "@/hooks/useMedia";
import { useTheme } from "@/hooks/useTheme";

// Configs
import { LayoutTypeOptions } from "@/configs/media.metadata";
import { ThemeModeOptions } from "@/configs/theme-mode.metadata";



type INavbarOrigin = "right" | "left";

interface INavbar {
  style?: CSSProperties;
  className?: string;
  origin?: INavbarOrigin | null;
}

export const Navbar = ({
  style,
  className,
  origin = "right",
}: INavbar) => {

  // const pathname = usePathname();
  const tDataSettings = useI18n("data-settings");

  const { mediaLayoutType } = useMedia();
  const { resolvedThemeMode, themeMode, systemThemeMode, setThemeMode } = useTheme();

  const [currentLayout, setCurrentLayout] = useState<LayoutTypeOptions | null>(null)

  const [navbarExpanded, setNavbarExpanded] = useState(false);
  const [navbarMounted, setNavbarMounted] = useState(false);

  // Button's Ref
  const openButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Layout
  const isCompact = currentLayout === "compact";
  const resolvedListDirectionClassName = isCompact ? fStyles.navbarListCol : fStyles.navbarListRow;

  // Toggle
  const openNavbar = () => {
    setNavbarMounted(true);
    requestAnimationFrame(() => {
      setNavbarExpanded(true);
    });
  };

  const closeNavbar = () => {
    setNavbarExpanded(false);
    setTimeout(() => {
      setNavbarMounted(false);
    }, 200);
  };

  const handleToggle = () => {
    if (navbarExpanded) closeNavbar();
    else openNavbar();
  };

  // Autofocus on buttons
  useEffect(() => {
    if (navbarExpanded) {
      closeButtonRef.current?.focus();
    } else {
      openButtonRef.current?.focus();
    };
  }, [navbarExpanded]);

  // Autoclose
  useEffect(() => {
    if (mediaLayoutType !== currentLayout) {
      setCurrentLayout(mediaLayoutType);
      setNavbarExpanded(false);
    };
  }, [mediaLayoutType]);

  // Handle's
  const handleChangeTheme = (i: TSelectItems) => {
    if (!selectValueIsPrimitive(i)) {
      setThemeMode(i.value as ThemeModeOptions);
    }
  }

  // ===== Config's =====
  const themeModeOptions: TSelectItems[] = [
    { 
      id: "system",
      value: "system",
      labelBox: 
        <View className={fStyles.configOptionItemBox}>
          <LuMonitorSmartphone size={32}/>
          {isCompact && (
            <Text size="button">
              {tDataSettings[`th-mode-opt-system`]} ({tDataSettings[`th-mode-opt-${systemThemeMode}`]})
            </Text>
          )}
        </View>,
      labelList:
        <View className={fStyles.configOptionItemList}>
          <LuMonitorSmartphone size={32}/>
          <Text size="button">
            {tDataSettings[`th-mode-opt-system`]} ({tDataSettings[`th-mode-opt-${systemThemeMode}`]})
          </Text>
        </View>,
    },
    { 
      id: "light",
      value: "light",
      labelBox: 
        <View className={fStyles.configOptionItemBox}>
          <LuSun size={32}/>
          {isCompact && (
            <Text size="button">
              {tDataSettings[`th-mode-opt-light`]}
            </Text>
          )}
        </View>,
      labelList:
        <View className={fStyles.configOptionItemList}>
          <LuSun size={32}/>
          <Text size="button">
            {tDataSettings[`th-mode-opt-light`]}
          </Text>
        </View>,
    },
    { 
      id: "dark",
      value: "dark",
      labelBox: 
        <View className={fStyles.configOptionItemBox}>
          <LuMoon size={32}/>
          {isCompact && (
            <Text size="button">
              {tDataSettings[`th-mode-opt-dark`]}
            </Text>
          )}
        </View>,
      labelList:
        <View className={fStyles.configOptionItemList}>
          <LuMoon size={32}/>
          <Text size="button">
            {tDataSettings[`th-mode-opt-dark`]}
          </Text>
        </View>,
    }
  ]

  // Render's

  // Navbar List
  const NavBarList = () => {
    return (
      <div className={`${resolvedListDirectionClassName}`}>
        <View className={fStyles.configOptionRow}>
          {isCompact && (
            <Text size="h3">{tDataSettings["th-mode-title"]}</Text>
          )}
          <Select
            boxStyles={{
              boxVariant: !isCompact ? "ghost" : "outline",
              boxProportion: !isCompact ? "square" : "normal",
              boxSize: !isCompact ? "small" : "normal",
              icon: !isCompact,
              // style: !isCompact ? { padding: 8 } : {}
            }}
            hideChevron={!isCompact}
            items={themeModeOptions}
            value={themeMode}
            onChangeValue={(i) => handleChangeTheme(i)}
          />
        </View>
      </div>
    )
  }

  return (
    <nav
      aria-expanded={navbarExpanded}
      aria-controls="main-navbar"
      className={`${fStyles.navbar} ${className}`} 
      style={{ ...style }}
    >
      {isCompact && (
        <Button
          ref={openButtonRef}
          icon
          variant="ghost"
          onClick={handleToggle}
        >
          <LuMenu size={32} />
        </Button>
      )}
      {isCompact ? <>
        {navbarMounted && (
          <>
            <div 
              onClick={handleToggle}
              className={`${fStyles.navbarOverlay} ${navbarExpanded ? fStyles.open : ""}`} 
            />
            <View
              className={`
                ${fStyles.navbarCompactedContent} 
                ${origin === "right" ? fStyles.right : fStyles.left} 
                ${navbarExpanded ? fStyles.open : ""}
              `}
            >
              <View className={`${fStyles.navbarHeader}`}>
                <Button
                  ref={closeButtonRef}
                  icon
                  variant="ghost"
                  onClick={handleToggle}
                >
                  <LuX size={32} />
                </Button>
              </View>
              <NavBarList />
            </View>
          </>
        )}
      </>
        : <NavBarList />
      }
    </nav>
  )
};
