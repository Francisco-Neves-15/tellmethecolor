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
import Button, { TButtonVariants } from "@/components/ui/Button"
import Input from "@/components/ui/Input"

// Hooks
import { useI18n } from "@/hooks/useI18n";
import { useMedia } from "@/hooks/useMedia";




// Types & Interfaces

interface IListSelect {
  value: unknown;
  labelBox?: string;
  labelList?: string | React.ReactNode;
  id: string;
}

export type TSelectItems = IListSelect | number | string;
type TSelectVariant = TButtonVariants;
type TSelectBehavoir = "adapt" | "dropdown" | "modal";
type TDropdownPosition = "adapt" | "top-left" | "top-right" | "bottom-left" | "bottom-right";

// Ref Control
type TShowOptions = {
  behavior?: TSelectBehavoir;
};

export interface ISelectRef {
  open: (options?: TShowOptions) => void;
  close: () => void;
  toggle: (options?: TShowOptions) => void;
}

type TState = {
  open: boolean;
  mounted: boolean;
  runtimeBehavior: TSelectBehavoir | null;
};

// Component

interface ISelect {
  items: TSelectItems[];
  value: TSelectItems | null;
  onChangeValue: (item: TSelectItems) => void;
  search?: boolean;
  defaultValueIdOrIndex?: string | number | null;
  placeholder?: string;
  hideButton?: boolean;
  behavoir?: TSelectBehavoir;
  dropdownPosition?: TDropdownPosition;
  // Fixs Values (Suffix's and Prefix's)
  fixTexts?: {
    boxSuffix?: string | null;
    boxPrefix?: string | null;
    listSuffix?: string | null;
    listPrefix?: string | null;
  };
  // Styles
  boxVariant?: TSelectVariant;
  boxStyles?: {
    style?: CSSProperties;
    className?: string;
  };
  modalStyles?: {
    style?: CSSProperties;
    className?: string;
    listItemStyle?: CSSProperties;
    listItemClassName?: string;
  };
  dropdownStyles?: {
    style?: CSSProperties;
    className?: string;
    listItemStyle?: CSSProperties;
    listItemClassName?: string;
  };
};

// Util
export function selectValueIsPrimitive(item: TSelectItems): item is string | number {
  return typeof item === "string" || typeof item === "number";
}

export const Select = forwardRef<ISelectRef, ISelect>(({
  items = [],
  value,
  onChangeValue,
  defaultValueIdOrIndex = null,
  placeholder,
  behavoir = "adapt",
  fixTexts,
  // Styles
  boxVariant = "sub",
  boxStyles,
  modalStyles,
  dropdownStyles,
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
    open: (options?: TShowOptions) => open(options),
    close: () => close(),
    toggle: (options?: TShowOptions) => toggle(options)
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

  const toggle = (options?: TShowOptions) => {
    if (state.open) close();
    else open(options);
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

    let selectedItem: TSelectItems | undefined;

    // Primitive List
    if (selectValueIsPrimitive(items[0])) {
      if (typeof defaultValueIdOrIndex === "number") {
        selectedItem = items[defaultValueIdOrIndex];
      } else {
        console.error(`DEVs: For primitive items (number list or string list), defaultValue must be an index.`);
        return;
      }
    } else {
      // Obj's List
      selectedItem = (items as IListSelect[]).find(
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
    if (selectValueIsPrimitive(value)) {
      final = value;
    } else {
      final = value.labelBox ?? value.labelList ?? value.value ?? value.id;
    };
    return String(final);
  }, [value]);

  // On Select Hidden
  const onSelectValue = (value: TSelectItems) => {
    onChangeValue(value);
    close();
    // DEBUG
    selectValueIsPrimitive(value) ?
      console.log(value)
      :
      console.log(`${value.id} ${value.labelBox} ${value.labelList} ${value.value}`)
  }

  useEffect(() => {
    console.log(state.open)
  }, [state.open]);

  // Render
  return (
    <>

      {!hideButton && (
        <Button
          ref={openButtonRef}
          variant={boxVariant}
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
          {/* Dropdown */}
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
                    <View key={`${index}-list-item`} className="w-full">
                      <button
                        className={`${fStyles.modalContentListItem} ${modalStyles?.listItemClassName}`}
                        style={{ ...modalStyles?.listItemStyle }}
                        onClick={() => onSelectValue(value)}
                      >
                        {selectValueIsPrimitive(value) ? (
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
          {isDropdown && (
            <View
              className={`${fStyles.dropdownContent} ${dropdownStyles?.className} ${state.open ? fStyles.open : ""}`} 
              style={{ ...dropdownStyles?.style }}
            >
              <View className={`${fStyles.dropdownContentList}`}>
                {items.map((value, index, array) => (
                  <View key={`${index}-list-item`} className="w-full">
                    <button
                      className={`${fStyles.dropdownContentListItem} ${dropdownStyles?.listItemClassName}`}
                      style={{ ...dropdownStyles?.listItemStyle }}
                      onClick={() => onSelectValue(value)}
                    >
                      {selectValueIsPrimitive(value) ? (
                        <Text size="caption">{String(value)}</Text>
                      ) : typeof value.labelList === "string" ? (
                        <Text size="caption">{value.labelList}</Text>
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
          )}
        </>
      )}

    </>
  )
});

Select.displayName = "Select";
