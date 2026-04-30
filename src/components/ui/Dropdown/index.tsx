"use client";
import { use, useEffect, useRef, useState } from "react";

// Icons
import { LuMenu, LuX, LuSun, LuMoon, LuMonitorSmartphone } from "react-icons/lu";

// Styles
import fStyles from "./style.module.scss"

// Components
import View from "@/components/ui/View"
import Text from "@/components/ui/Text"
import Button from "@/components/ui/Button"
import Input from "@/components/ui/Input"

// Hooks
// Hooks
import { useI18n } from "@/hooks/useI18n";
import { useMedia } from "@/hooks/useMedia";

// Configs
import { LayoutTypeOptions } from "@/configs/media.metadata";



//

interface IListDropdown {
  value: unknown;
  labelBox?: string;
  labelList?: string;
  id: string;
}

type TItemsTypes = IListDropdown | number | string;

interface IDropdown {
  items: TItemsTypes[];
  onChangeValue: (item: TItemsTypes) => void;
  search?: boolean;
  boxSuffix?: string | null;
  boxPrefix?: string | null;
  listSuffix?: string | null;
  listPrefix?: string | null;
  defaultValueIdOrIndex?: string | number | null;
  placeholder?: string;
}

export const Dropdown = ({
  items = [],
  onChangeValue,
  search = false,
  boxSuffix,
  boxPrefix,
  listSuffix,
  listPrefix,
  defaultValueIdOrIndex = null,
  placeholder = undefined
}: IDropdown) => {

  // const pathname = usePathname();
  const tCommon = useI18n("common");

  const { mediaLayoutType, mediaScreenType } = useMedia();
  const [currentLayout, setCurrentLayout] = useState<LayoutTypeOptions | null>(null)

  const [dropdownExpanded, setDropdownExpanded] = useState(false);
  const [dropdownMounted, setDropdownMounted] = useState(false);

  // Button's Ref
  const openButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Layout
  const isSmall = mediaScreenType === "small";
  const resolvedPlaceholder = placeholder ? placeholder : tCommon["common-select"];

  // Toggle
  const openDropdown = () => {
    setDropdownExpanded(true);
    requestAnimationFrame(() => {
      setDropdownMounted(true);
    });
  };

  const closeDropdown = () => {
    setDropdownMounted(false);
    setTimeout(() => {
      setDropdownExpanded(false);
    }, 200);
  };

  const handleToggle = () => {
    if (dropdownExpanded) closeDropdown();
    else openDropdown();
  };

  // Autofocus on buttons
  useEffect(() => {
    if (dropdownExpanded) {
      closeButtonRef.current?.focus();
    } else {
      openButtonRef.current?.focus();
    };
  }, [dropdownExpanded]);

  // Autoclose
  useEffect(() => {
    if (mediaLayoutType !== currentLayout) {
      setCurrentLayout(mediaLayoutType);
      setDropdownExpanded(false);
    };
  }, [mediaLayoutType]);

  // Auto Select if "defaultValue"
  useEffect(() => {
    if (defaultValueIdOrIndex === null || defaultValueIdOrIndex === undefined) return;
    if (!items.length) return;

    let selectedItem: TItemsTypes | undefined;

    // Lista primitiva
    if (typeof items[0] === "string" || typeof items[0] === "number") {
      if (typeof defaultValueIdOrIndex === "number") {
        selectedItem = items[defaultValueIdOrIndex];
      } else {
        console.error(`DEVs: For primitive items (number list or string list), defaultValue must be an index.`);
        return;
      }
    } 
    // Lista de objetos
    else {
      selectedItem = (items as IListDropdown[]).find(
        item => item.id === defaultValueIdOrIndex
      );
    }

    if (selectedItem !== undefined) {
      onChangeValue(selectedItem);
    }

  }, [defaultValueIdOrIndex, items]);

  // Render
  return (
    <>

    </>
  )
}

Dropdown.displayName = "Dropdown";
