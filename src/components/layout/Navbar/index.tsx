"use client";
import { usePathname } from "next/navigation";
import { CSSProperties, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";

// Icons
import { LuMenu, LuX } from "react-icons/lu";

// Styles
import fStyles from "./style.module.scss"

// Components
import View from "@/components/ui/View"
import Text from "@/components/ui/Text"
import Button from "@/components/ui/Button"

// Hooks
import { useMedia } from "@/hooks/useMedia";
import { useTheme } from "@/hooks/useTheme";

// Types
import { LayoutTypeOptions } from "@/configs/media.metadata";



type INavbarDir = "horizontal" | "vertical";

interface INavbar {
  style?: CSSProperties;
  className?: string;
  direction?: INavbarDir | null;
  headerSize?: number;
}

export const Navbar = ({
  style,
  className,
  direction = null,
  headerSize,
}: INavbar) => {

  const pathname = usePathname();

  const { mediaLayoutType, mediaScreenType } = useMedia();
  const { resolvedThemeMode, setThemeMode } = useTheme();

  const [currentLayout, setCurrentLayout] = useState<LayoutTypeOptions | null>(null)

  const [navbarExpanded, setNavbarExpanded] = useState(false);
  const [navbarMounted, setNavbarMounted] = useState(false);

  // Button's Ref
  const openButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Layout
  const isCompact = currentLayout === "compact";
  const resolvedListDirectionClassName = direction ? direction : isCompact ? fStyles.navbarListCol : fStyles.navbarListRow;

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
    }
  }, [navbarExpanded])

  // Autoclose
  useEffect(() => {
    if (mediaLayoutType !== currentLayout) {
      setCurrentLayout(mediaLayoutType);
      setNavbarExpanded(false)
    };
  }, [mediaLayoutType])

  // useEffect(() => {
  //   console.log(JSON.stringify(navbarExpanded, null, 2))
  // }, [navbarExpanded])

  // Render's

  // Navbar List
  const NavBarList = () => {
    return (
      <div className={`${resolvedListDirectionClassName}`}>
        <a href="#">Item 1</a>
        <a href="#">Item 2</a>
        <a href="#">Item 3</a>
        <a href="#">Item 4</a>
        <a href="#">Item 5</a>
      </div>
    )
  }

  return (
    <nav
      aria-expanded={navbarExpanded}
      aria-controls="main-navbar"
      className={`${fStyles.navbar}`}
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
              className={`${fStyles.navbarCompactedContent} ${navbarExpanded ? fStyles.open : ""}`}
            >
              <View className={`${fStyles.navbarHeader}`} style={{ height: headerSize }}>
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
}

Navbar.displayName = "Navbar";
