"use client";
import { CSSProperties, forwardRef, useEffect, useRef, useState } from "react";

import { useGlobalStyles } from "@/hooks/useGlobalStyles";
import fStyles from "./style.module.scss";
import { ColorByBoolean, ValueByBoolean } from "@/types/components";

type TSwitchVariant = "primary";

type TSwitchThumbVariant = "primary";

interface IVariantConfig {
  wrapper: string;
  thumb: string;
  track: string;
};

interface ISwitch {
  variant?: TSwitchVariant;

  value?: boolean;
  defaultValue?: boolean;
  onChangeValue?: (value: boolean) => void;
  onChange?: () => void;
  onActivate?: () => void;
  onDeactivate?: () => void;

  trackColor?: string | ColorByBoolean;
  thumbColor?: string | ColorByBoolean;
  thumbVariant?: TSwitchThumbVariant | ValueByBoolean;

  style?: CSSProperties;
  className?: string;

  disabled?: boolean;
}

export interface ISwitchRef {};

export const Switch = forwardRef<ISwitchRef, ISwitch>(({
  variant = "primary",

  value,
  onChangeValue,
  onChange,
  defaultValue,
  onActivate,
  onDeactivate,

  thumbColor,
  trackColor,
  thumbVariant,

  style,
  className,

  disabled
}, ref) => {
  const { gColors } = useGlobalStyles();

  const lastEmittedValueRef = useRef<boolean>(value ?? defaultValue);
  const [internalValue, setInternalValue] = useState<boolean | undefined>(value ?? defaultValue);

  // Value

  const fallbackValue = defaultValue;

  const isControlled = value !== undefined;

  const currentValue =
    isControlled
      ? value
      : internalValue ?? fallbackValue;

  const emitValue = (nextValue: boolean) => {
    if (disabled) return;

    if (nextValue === lastEmittedValueRef.current) return;

    lastEmittedValueRef.current = nextValue;

    onChangeValue?.(nextValue);
    onChange?.();

    if (nextValue) {
      onActivate?.();
    } else { 
      onDeactivate?.();
    }

  };

  // Handler's
  const handleSwitch = () => {
    const nextValue = !currentValue;
    setInternalValue(nextValue);
    emitValue(nextValue);
  };

  // Auto Select if "defaultValue"
  useEffect(() => {
    if (defaultValue === undefined || defaultValue === null) return;
    if (value !== defaultValue) {
      onChangeValue?.(defaultValue);
      onChange?.();
      if (defaultValue) {
        onActivate?.();
      } else { 
        onDeactivate?.();
      };
    };
  }, []);

  // Controlled
  
  useEffect(() => {
    if (value !== undefined) {
      setInternalValue(value);
    };
    lastEmittedValueRef.current = value ?? fallbackValue;
  }, [value]);

  // =============== Styles ===============

  const getColors = (v: boolean | undefined) => {

    if (!v) v = false;

    const thumb =
      typeof thumbColor === "string"
        ? thumbColor
        : thumbColor?.[v ? "true" : "false"] ?? gColors.bgSecondary;

    const track =
      typeof trackColor === "string"
        ? trackColor
        : trackColor?.[v ? "true" : "false"] ?? (v ? gColors.success : gColors.bgBase);

    return { thumb, track };
  }
  const resolvedColors = getColors(currentValue);
  
  // Switch Variant's
  const variantConfig: Record<TSwitchVariant, IVariantConfig> = {
    primary: {
      "wrapper": fStyles.switchWrapperPrimary,
      "track": fStyles.switchTrackPrimary,
      "thumb": fStyles.switchThumbPrimary
    }
  } as const;

  const getVariant = (variant: TSwitchVariant) => {
    return variantConfig[variant];
  };
  const resolvedVariant = getVariant(variant);

  // Return

  return (
    <button
      draggable={false}
      data-value={currentValue ? "active" : "desactive"}
      className={`
        ${fStyles.switchWrapper}
        ${resolvedVariant.wrapper}
        ${className}
        ${disabled ? fStyles.switchDisabled : null}
      `}
      inert={disabled}
      style={{
        ...style,
      }}
      onClick={() => {
        handleSwitch()
      }}
    >
      <div
        className={`${fStyles.switchTrack} ${resolvedVariant.track}`}
        style={{
          backgroundColor: resolvedColors.track
        }}
      />
      <div
        className={`${fStyles.switchThumb} ${resolvedVariant.thumb}`}
        style={{
          backgroundColor: resolvedColors.thumb
        }}
      />
    </button>
  );
});
