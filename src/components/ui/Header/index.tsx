"use client";
import { usePathname } from "next/navigation";
import { CSSProperties, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";

// Styles
import fStyles from "./style.module.scss"

// Components
import View from "@/components/ui/View"
import Text from "@/components/ui/Text"
import Button from "@/components/ui/Button"

// Hooks
import { useMedia } from "@/hooks/useMedia";
import { useTheme } from "@/hooks/useTheme";


interface IHeader {
  style?: CSSProperties;
  className?: string;
}

const Header = ({
  style,
  className,
}: IHeader) => {
  const pathname = usePathname()

  const { mediaLayoutType, mediaScreenType, screenWidth, screenHeight } = useMedia();
  const { resolvedThemeMode, setThemeMode } = useTheme();

  // Size
  const getHeaderSize = () => {
    if (mediaScreenType === "large") return 80;
    else if (mediaScreenType === "medium") return 70;
    else return 60;
  };
  const headerSize: number = getHeaderSize();

  // Logo

  const PATH_ABS_LOGO_WHITE: string = "/logo/abs/tmtc-logo-white.png";
  const PATH_ABS_LOGO_BLACK: string = "/logo/abs/tmtc-logo-black.png";
  const PATH_WORD_LOGO_WHITE: string = "/logo/word/tmtc-word-white.png";
  const PATH_WORD_LOGO_BLACK: string = "/logo/word/tmtc-word-black.png";

  // Logo Theme

  const getLogosTheme = useMemo(() => {
    if (resolvedThemeMode === "light") return { abs: PATH_ABS_LOGO_BLACK, word: PATH_WORD_LOGO_BLACK };
    else return { abs: PATH_ABS_LOGO_WHITE, word: PATH_WORD_LOGO_WHITE };
  }, [resolvedThemeMode])
  
  const logoThemeAbs: string = getLogosTheme.abs; 
  const logoThemeWord: string = getLogosTheme.word; 

  // Size

  const getLogosSize = useMemo(() => {
    if (mediaScreenType === "large") {
      return { abs: headerSize - 16, word: { width: 320, height: 0 }}
    } else if (mediaScreenType === "medium") {
      return { abs: headerSize - 16, word: { width: 240, height: 0 }}
    } else {
      return { abs: headerSize - 16, word: { width: 0, height: 0 }}
    }
  }, [mediaScreenType])

  const logoAbsDimensions: number = getLogosSize.abs; 
  const logoWordDimensions: { width: number, height: number } = getLogosSize.word; 

  return (
    <header className={fStyles.header} style={{ height: headerSize }}>
      <View className={fStyles.headerLogo}>
        <Image
          src={logoThemeAbs}
          alt="Site Logo in Header (Abstract 1:1 Logo)"
          width={logoAbsDimensions}
          height={logoAbsDimensions}
        />
        {mediaScreenType !== "small" && (
          <Image
            src={logoThemeWord}
            alt="Site Logo in Header (Word/Letter Logo)"
            height={logoWordDimensions.height}
            width={logoWordDimensions.width}
          />
        )}
      </View>
      <View style={{ flexDirection: "row" }}>
        <Button
          onClick={() => setThemeMode("light")}
        >
          Claro
        </Button>
        <Button
          onClick={() => setThemeMode("dark")}
        >
          Escuro
        </Button>
      </View>
      <Text size="body">{pathname} | {resolvedThemeMode}</Text>
    </header>
  )
}

export default Header;
Header.displayName = "Header";
