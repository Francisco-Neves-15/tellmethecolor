"use client";
import { CSSProperties, forwardRef, useEffect, useState } from "react";

import { useGlobalStyles } from "@/hooks/useGlobalStyles";
import fStyles from "./style.module.scss";
import { ColorByState } from "@/types/components";

type TSwitchVariant = "primary";

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

  thumbColor?: string | ColorByState;
  trackColor?: ColorByState;

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

  thumbColor,
  trackColor,

  style,
  className,

  disabled
}, ref) => {
  const { gColors } = useGlobalStyles();

  // Dimensions
  // const metrics = SWITCH_METRICS[variant];

  // Colors

  const resolvedThumbColor =
    typeof thumbColor === "string"
      ? thumbColor
      : thumbColor?.[value ? "true" : "false"] ?? gColors.bgSecondary;

  const resolvedTrackColor = trackColor?.[value ? "true" : "false"] ?? (value ? gColors.success : gColors.bgBase);

  // =============== Styles ===============
  
  // Switch Variant's
  const variantConfig: Record<TSwitchVariant, IVariantConfig> = {
    primary: {
      "wrapper": fStyles.switchWrapper,
      "track": fStyles.switchTrack,
      "thumb": fStyles.switchThumb
    },
  } as const;

  const getVariant = (variant: TSwitchVariant) => {
    return variantConfig[variant];
  };
  const resolvedVariant = getVariant(variant);

  return (
    <div
      draggable={false}
      className={`${resolvedVariant.wrapper} ${className} ${disabled ? fStyles.switchDisabled : null}`}
      inert={disabled}
      style={{
        ...style,
      }}
    >
      <div
        className={`${resolvedVariant.track}`}
        style={{
          backgroundColor: resolvedTrackColor
        }}
      />
      <div
        className={`${resolvedVariant.thumb}`}
        style={{
          backgroundColor: resolvedThumbColor
        }}
      />
    </div>
  );
});
