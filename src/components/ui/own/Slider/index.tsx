"use client";
import { forwardRef, useEffect, useState, useRef, CSSProperties } from "react";

import { useGlobalStyles } from "@/hooks/useGlobalStyles";
import fStyles from "./style.module.scss";

type TSliderVariant = "primary";
interface IVariantConfig {
  wrapper: string;
  thumb: string;
  track: string;
};

type TSliderIndicatorVariant = "circle" | "line";
interface IVariantIndicatorConfig {
  style: CSSProperties;
  className: string;
};

type TSliderDirection = "horizontal" | "vertical";

interface ISlider {
  variant?: TSliderVariant;
  indicator?: TSliderIndicatorVariant;
  direction?: TSliderDirection;

  value?: number;
  onChangeValue?: (value: number) => void;
  onChange?: () => void;
  defaultValue?: number;

  min?: number;
  max?: number;
  step?: number;

  updateOnDrag?: boolean;
  allowTrackClick?: boolean;

  thumbColor?: string | { high?: string; normal?: string; low?: string; };
  trackColor?: string;

  width?: CSSProperties["width"];
  height?: CSSProperties["height"];
  style?: CSSProperties;
  className?: string;

  disabled?: boolean;
}

export interface ISliderRef {};

export const Slider = forwardRef<ISliderRef, ISlider>(({
  variant = "primary",
  indicator = "circle",
  direction = "horizontal",

  value,
  onChangeValue,
  onChange,
  defaultValue,

  min,
  max,
  step,

  updateOnDrag = false,
  allowTrackClick = true,

  thumbColor = undefined,
  trackColor = undefined,
  
  width,
  height,
  style,
  className,

  disabled
}, ref) => {
  const { gColors } = useGlobalStyles();

  const sliderRef = useRef<HTMLDivElement>(null);

  const [dragging, setDragging] = useState(false);

  const resolvedMin = min ?? 0;
  const resolvedMax = max ?? 100;
  const resolvedStep = step ?? 1;

  const lastEmittedValueRef = useRef<number>(
    value ?? defaultValue ?? resolvedMin
  );

  const [internalValue, setInternalValue] = useState<number>(
    value ?? defaultValue ?? resolvedMin
  );

  const isVertical = direction === "vertical";
  const rWidth = width ?? (!isVertical ? 150 : 12);
  const rHeight = height ?? (!isVertical ? 12 : 150);

  // Other's

  const resolvedTrackColor = trackColor ?? gColors.bgSecondary;

  // Function's

  const getThumbColor = (percent: number) => {
    if (typeof thumbColor === "string") return thumbColor;

    if (!thumbColor) return gColors.primary;

    if (percent >= 75 && thumbColor.high) {
      return thumbColor.high ?? gColors.success;
    }

    if (percent <= 15 && thumbColor.low) {
      return thumbColor.low ?? gColors.danger;
    }

    return thumbColor.normal ?? gColors.primary;
  };

  const normalizeValue = (raw: number) => {
    const clamped = Math.min(resolvedMax, Math.max(resolvedMin, raw));

    const stepped =
      Math.round((clamped - resolvedMin) / resolvedStep) *
        resolvedStep +
      resolvedMin;

    return stepped;
  };

  const getValueFromPointer = (clientX: number, clientY: number) => {
    if (!sliderRef.current) return internalValue;

    const rect = sliderRef.current.getBoundingClientRect();

    const percent = isVertical
      ? 1 - (clientY - rect.top) / rect.height
      : (clientX - rect.left) / rect.width;

    const clampedPercent = Math.min(1, Math.max(0, percent));

    const raw =
      resolvedMin +
      clampedPercent * (resolvedMax - resolvedMin);

    return normalizeValue(raw);
  };

  const emitValue = (nextValue: number) => {
    if (disabled) return;

    const normalized = normalizeValue(nextValue);

    if (normalized === lastEmittedValueRef.current) return;

    lastEmittedValueRef.current = normalized;

    onChangeValue?.(normalized);
    onChange?.();
  };

  // Handler's

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    setDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handleTrackClick = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!allowTrackClick) return;

    const nextValue = getValueFromPointer(event.clientX, event.clientY);

    handlePointerDown(event);
    setInternalValue(nextValue);
    emitValue(nextValue);
  };

  // Auto Select if "defaultValue"
  useEffect(() => {
    if (defaultValue === undefined || defaultValue === null) return;
    if (value !== defaultValue) {
      onChangeValue?.(defaultValue);
      onChange?.();
    }
  }, []);

  // Drag's Effect

  // PointerMove
  useEffect(() => {
    if (!dragging) return;

    const handleMove = (event: PointerEvent) => {
      const nextValue = getValueFromPointer(event.clientX, event.clientY);

      setInternalValue(nextValue);

      if (updateOnDrag) {
        emitValue(nextValue);
      }
    };

    window.addEventListener("pointermove", handleMove);

    return () => {
      window.removeEventListener("pointermove", handleMove);
    };
  }, [dragging]);

  // PointerUp
  useEffect(() => {
    if (!dragging) return;

    const handleUp = (event: PointerEvent) => {
      const nextValue = getValueFromPointer(event.clientX, event.clientY);

      setDragging(false);
      emitValue(nextValue);
    };

    window.addEventListener("pointerup", handleUp);

    return () => {
      window.removeEventListener("pointerup", handleUp);
    };
  }, [dragging]);

  // Value's

  const fallbackValue = defaultValue ?? resolvedMin;

  const isControlled = value !== undefined;

  const currentValue =
    dragging
      ? internalValue
      : isControlled
        ? value
        : internalValue ?? fallbackValue;

  const percentRaw =
    ((currentValue - resolvedMin) /
      (resolvedMax - resolvedMin)) *
    100;

  const percent = percentRaw;

  // Controlled

  useEffect(() => {
    if (value !== undefined && !dragging) {
      setInternalValue(value);
    }
  }, [value, dragging]);

  useEffect(() => {
    lastEmittedValueRef.current = value ?? fallbackValue;
  }, [value]);

  // =============== Styles ===============
  
  // Slider Variant's
  const variantConfig: Record<TSliderVariant, IVariantConfig> = {
    primary: {
      "wrapper": fStyles.sliderWrapper,
      "track": fStyles.sliderTrack,
      "thumb": fStyles.sliderThumb
    },
  } as const;

  const getVariant = (variant: TSliderVariant) => {
    return variantConfig[variant];
  };
  const resolvedVariant = getVariant(variant);
  
  // Slider Indicator
  const indicatorConfig: Record<TSliderIndicatorVariant, IVariantIndicatorConfig> = {
    "circle": {
      style: {
        bottom: !isVertical ? undefined :`${percent}%`,
        left: isVertical ? undefined :`${percent}%`,
        width: !isVertical ? undefined : typeof rWidth === "number" ? `${rWidth * 1.5}px` : "16px",
        height: isVertical ? undefined : typeof rHeight === "number" ? `${rHeight * 1.5}px` : "16px",
        backgroundColor: getThumbColor(percent),
      },
      className: `
        ${fStyles.sliderIndicatorDot}
        ${fStyles.sliderThumbHover}
      `,
    },
    "line": {
      style: {
        left: `${percent}%`,
        width: !isVertical ? 4 : typeof rWidth === "number" ? `${rWidth + 12}px` : "16px",
        height: isVertical ? 4 : typeof rHeight === "number" ? `${rHeight + 12}px` : "16px",
        backgroundColor: gColors.light
      },
      className: `
        ${fStyles.sliderIndicatorLine}
      `,
    }
  } as const;

  const getIndicator = (indicator: TSliderIndicatorVariant) => {
    return indicatorConfig[indicator];
  };
  const resolvedIndicator = getIndicator(indicator);

  return (
    <div
      ref={sliderRef}
      data-direction={direction}
      draggable={false}
      className={`${resolvedVariant.wrapper} ${className}`}
      style={{
        ...style,
        width: typeof rWidth === "number" ? `${rWidth}px` : rWidth,
        height: typeof rHeight === "number" ? `${rHeight}px` : rHeight,
      }}
    >

      <div
        onPointerDown={handleTrackClick}
        className={`${resolvedVariant.track}`} 
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: resolvedTrackColor,
        }}
      />

      <div
        onPointerDown={handleTrackClick}
        className={`
          ${resolvedVariant.thumb}
          ${isVertical ? fStyles.sliderThumbVertical : fStyles.sliderThumbHorizontal}
          ${allowTrackClick ? fStyles.sliderThumbHover : ""}
        `} 
        style={{
          width: !isVertical ? `${percent}%` : "100%",
          height: !isVertical ? "100%" : `${percent}%`,
          backgroundColor: getThumbColor(percent),
        }}
      />

      <div
        onPointerDown={handlePointerDown}
        className={`
          ${fStyles.sliderIndicator}
          ${isVertical ? fStyles.sliderIndicatorVertical : fStyles.sliderIndicatorHorizontal}
          ${resolvedIndicator.className}
        `}
        style={resolvedIndicator.style}
      />

    </div>
  );
});
