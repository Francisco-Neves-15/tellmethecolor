"use client";
import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  useEffect,
  CSSProperties,
  useMemo
} from "react";

// Icons
import { LuX, LuChevronDown } from "react-icons/lu";

// Styles
import useGlobalStyles from "@/hooks/useGlobalStyles";
import fStyles from "./style.module.scss"

// Components
import View from "@/components/ui/View"
import Text from "@/components/ui/Text"
import Button from "@/components/ui/Button"
import Input from "@/components/ui/Input"

// Hooks
import { useI18n } from "@/hooks/useI18n";
import { useMedia } from "@/hooks/useMedia";




// Types & Interfaces

interface IListDropdown {
  value: unknown;
  labelBox?: string;
  labelList?: string | React.ReactNode;
  id: string;
}

export type TDropdownItems = IListDropdown | number | string;
type TDropdownVariant = "primary";
type TDropdownBehavoir = "adapt" | "dropdown" | "modal";

// Ref Control
type TShowOptions = {
  behavior?: TDropdownBehavoir;
};

export interface ISelectDropdownRef {
  show: (options?: TShowOptions) => void;
  hide: () => void;
  toggle: () => void;
}

type TState = {
  open: boolean;
  mounted: boolean;
  runtimeBehavior: TDropdownBehavoir | null;
};

// Component

interface ISelectDropdown {
  items: TDropdownItems[];
  value: TDropdownItems | null;
  onChangeValue: (item: TDropdownItems) => void;
  search?: boolean;
  defaultValueIdOrIndex?: string | number | null;
  placeholder?: string;
  hideButton?: boolean;
  behavoir?: TDropdownBehavoir;
  // Fixs Values (Suffix's and Prefix's)
  fixTexts?: {
    boxSuffix?: string | null;
    boxPrefix?: string | null;
    listSuffix?: string | null;
    listPrefix?: string | null;
  };
  // Styles
  boxVariant?: TDropdownVariant;
  boxStyles?: {
    style?: CSSProperties;
    className?: string;
  };
  modalStyles?: {
    style?: CSSProperties;
    className?: string;
  };
  dropdownStyles?: {
    style?: CSSProperties;
    className?: string;
  };
  listItemStyles?: {
    style?: CSSProperties;
    className?: string;
  };
};

// Util
function valueIsPrimitive(item: TDropdownItems): item is string | number {
  return typeof item === "string" || typeof item === "number";
}

export const SelectDropdown = forwardRef<ISelectDropdownRef, ISelectDropdown>(({
  items = [],
  value,
  onChangeValue,
  defaultValueIdOrIndex = null,
  placeholder,
  behavoir = "adapt",
  fixTexts,
  // Styles
  boxVariant = "primary",
  boxStyles,
  modalStyles,
  dropdownStyles,
  listItemStyles,
  hideButton = false,
}, ref) => {

  // const pathname = usePathname();
  const tCommon = useI18n("common");
  const { gColors } = useGlobalStyles();

  const { mediaLayoutType, mediaScreenType } = useMedia();

  // For Dropdown

  const [state, setState] = useState<TState>({
    open: false,
    mounted: false,
    runtimeBehavior: null
  });

  useImperativeHandle(ref, () => ({
    show: (options?: TShowOptions) => open(options),
    hide: () => close(),
    toggle: () => toggle()
  }));

  // Button's Ref
  const openButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Ui
  const resolvedPlaceholder = placeholder ? placeholder : tCommon["common-select"];

  // Layout

  const isSmall = mediaScreenType === "small";

  const resolveBehavior = (): "modal" | "dropdown" => {
    const behavior = state.runtimeBehavior ?? behavoir;

    if (behavior !== "adapt") return behavior;

    return isSmall ? "modal" : "dropdown";
  };

  // Flags

  const behavior = resolveBehavior();

  const isModal = behavior === "modal";
  const isDropdown = behavior === "dropdown";

  // Toggle

  const open = (options?: TShowOptions) => {
    setState(prev => ({
      ...prev,
      open: true,
      runtimeBehavior: options?.behavior ?? null
    }));

    requestAnimationFrame(() => {
      setState(prev => ({
        ...prev,
        mounted: true
      }));
    });
  };

  const close = () => {
    setState(prev => ({
      ...prev,
      mounted: false
    }));
    setState(prev => ({
      ...prev,
      open: false,
      runtimeBehavior: null
    }));
  };

  const toggle = () => {
    if (state.open) close();
    else open();
  };

  // Autofocus on buttons
  useEffect(() => {
    if (state.open && isModal) {
      closeButtonRef.current?.focus();
    } else {
      openButtonRef.current?.focus();
    };
  }, [state.open]);

  // Autoclose
  useEffect(() => {
    if (isSmall) close();
    if (!isSmall) close();
  }, [mediaScreenType]);

  // Auto Select if "defaultValue"
  useEffect(() => {
    if (defaultValueIdOrIndex === null || defaultValueIdOrIndex === undefined) return;
    if (!items.length) return;

    let selectedItem: TDropdownItems | undefined;

    // Primitive List
    if (valueIsPrimitive(items[0])) {
      if (typeof defaultValueIdOrIndex === "number") {
        selectedItem = items[defaultValueIdOrIndex];
      } else {
        console.error(`DEVs: For primitive items (number list or string list), defaultValue must be an index.`);
        return;
      }
    } else {
      // Obj's List
      selectedItem = (items as IListDropdown[]).find(
        item => item.id === defaultValueIdOrIndex
      );
    };

    if (selectedItem !== undefined) {
      onChangeValue(selectedItem);
    }

  }, [defaultValueIdOrIndex, items]);

  // Current Showing
  const currentDisplayText = useMemo(() => {
    if (!value) return resolvedPlaceholder;
    let final: unknown;
    if (valueIsPrimitive(value)) {
      final = value;
    } else {
      final = value.labelBox ?? value.labelList ?? value.value ?? value.id;
    };
    return String(final);
  }, [value]);

  useEffect(() => {
    console.log(state.open)
  }, [state.open]);

  // Render
  return (
    <>

      {!hideButton && (
        <Button
          ref={openButtonRef}
          variant="outline"
          className={`${fStyles.boxContainer} ${boxStyles?.className}`} 
          style={{ ...boxStyles?.style }}
          onClick={toggle}
        >
          <Text size="button">
            {fixTexts?.boxPrefix && fixTexts?.boxPrefix}
            {currentDisplayText}
            {fixTexts?.boxSuffix && fixTexts?.boxSuffix}
          </Text>
          <View
            className={`transform transition-transform ${!state.open ? "rotate-0" : "-rotate-180"}`} 
          >
            <LuChevronDown size={24} color={gColors.text} />
          </View>
        </Button>
      )}

      {!state.open ? null : (
        <>
          {isModal && (
            <>
              {/* Modal Overlay */}
              <div onClick={close} className={`${fStyles.modalOverlay} ${state.open ? fStyles.open : ""}`}/>
              {/* Modal */}
              <View
                className={`${fStyles.modalContent} ${modalStyles?.className} ${state.open ? fStyles.open : ""}`} 
                style={{ ...modalStyles?.style }}
              >
                <View className={`${fStyles.modalContentList}`}>
                  {items.map((value, index, array) => (
                    <View className="w-full">
                      <button
                        key={`${index}-list-item`}
                        className={`${fStyles.modalContentListItem} ${listItemStyles?.className}`}
                        style={{ ...listItemStyles?.style }}
                        onClick={() => console.log(`${index}: ${value}`)}
                      >
                        {valueIsPrimitive(value) ? (
                          <Text size="body">{String(value)}</Text>
                        ) : typeof value.labelList === "string" ? (
                          <Text size="body">{value.labelList}</Text>
                        ) : (
                          value.labelList
                        )}
                      </button>
                      {(index + 1) !== array.length && 
                        <div style={{ width: "100%", height: 1, backgroundColor: gColors.border, borderRadius: 4 }}></div>
                      }
                    </View>
                  ))}
                </View>
              </View>
            </>
          )}
        </>
      )}

    </>
  )
});

SelectDropdown.displayName = "SelectDropdown";
