"use client";
import { forwardRef, useEffect, useState, useRef } from "react";

import { useGlobalStyles } from "@/hooks/useGlobalStyles";
import fStyles from "./style.module.scss";

type TSliderVariant = "primary";
interface IVariantConfig {
  wrapper: string;
  thumb: string;
  track: string;
  dot: string;
}

interface ISlider {
  variant?: TSliderVariant;

  value: number;
  onChangeValue: (value: number) => void;
  onChange?: () => void;
  defaultValue?: number;

  min?: number;
  max?: number;
  step?: number;

  updateOnDrag?: boolean;
  allowTrackClick?: boolean;

  thumbColor?: string | { high?: string; normal?: string; low?: string; };
  trackColor?: string;
  disabled?: boolean;

  width?: React.CSSProperties["width"];
  height?: React.CSSProperties["height"];
}

export interface ISliderRef { };

export const Slider = forwardRef<ISliderRef, ISlider>(({
  variant = "primary",

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

  width = 150,
  height = 10,

  disabled
}, ref) => {
  const { gColors } = useGlobalStyles();

  const sliderRef = useRef<HTMLDivElement>(null);
  const lastEmittedValueRef = useRef<number>(value);

  const [dragging, setDragging] = useState(false);
  const [internalValue, setInternalValue] = useState(value);

  const resolvedMin = min ?? 0;
  const resolvedMax = max ?? 100;
  const resolvedStep = step ?? 1;

  // Styles
  
  const variantConfig: Record<TSliderVariant, IVariantConfig> = {
    primary: {
      wrapper: fStyles.sliderWrapper,
      track: fStyles.sliderTrack,
      thumb: fStyles.sliderThumb,
      dot: fStyles.sliderThumbDot,
    },
  } as const;

  const getVariant = (variant: TSliderVariant) => {
    return variantConfig[variant];
  };
  const resolvedVariant = getVariant(variant);

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

  const getValueFromClientX = (clientX: number) => {
    if (!sliderRef.current) return internalValue;

    const rect = sliderRef.current.getBoundingClientRect();

    const percent =
      (clientX - rect.left) / rect.width;

    const raw =
      resolvedMin +
      percent * (resolvedMax - resolvedMin);

    return normalizeValue(raw);
  };

  const emitValue = (nextValue: number) => {
    if (disabled) return;

    const normalized = normalizeValue(nextValue);

    if (normalized === lastEmittedValueRef.current) return;

    lastEmittedValueRef.current = normalized;

    onChangeValue(normalized);
    onChange?.();
  };

  // Handler's

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    setDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handleTrackClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!allowTrackClick) return;

    const nextValue = getValueFromClientX(event.clientX);

    setInternalValue(nextValue);
    emitValue(nextValue);
  };

  // Auto Select if "defaultValue"
  useEffect(() => {
    if (defaultValue === undefined || defaultValue === null) return;
    if (value !== defaultValue) {
      onChangeValue(defaultValue);
      onChange?.();
    }
  }, []);

  // Drag's Effect

  // PointerMove
  useEffect(() => {
    if (!dragging) return;

    const handleMove = (event: PointerEvent) => {
      const nextValue = getValueFromClientX(event.clientX);

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
      const nextValue = getValueFromClientX(event.clientX);

      setDragging(false);

      emitValue(nextValue);
    };

    window.addEventListener("pointerup", handleUp);

    return () => {
      window.removeEventListener("pointerup", handleUp);
    };
  }, [dragging]);

  // Controlled

  useEffect(() => {
    if (!dragging) {
      setInternalValue(value);
    }
  }, [value, dragging]);

  useEffect(() => {
    lastEmittedValueRef.current = value;
  }, [value]);

  // Value's

  const currentValue = dragging ? internalValue : value;
  const percent =
    ((currentValue - resolvedMin) /
      (resolvedMax - resolvedMin)) *
    100;

  return (
    <div 
      ref={sliderRef}
      draggable={false}
      className={`${resolvedVariant.wrapper}`}
      style={{
        width: `${width}px`,
        height: `${height}px`,
      }}
    >

      <div
        onPointerDown={handleTrackClick}
        className={`${resolvedVariant.track}`} 
        style={{
          height: `100%`,
          backgroundColor: resolvedTrackColor,
        }}
      />

      <div
        onPointerDown={handleTrackClick}
        className={`
          ${resolvedVariant.thumb}
          ${allowTrackClick ? fStyles.sliderThumbHover : null}
        `} 
        style={{
          width: `${percent}%`,
          height: `100%`,
          backgroundColor: getThumbColor(percent),
        }}
      />

      <div
        onPointerDown={handlePointerDown}
        className={`
          ${resolvedVariant.dot}
          ${allowTrackClick ? fStyles.sliderThumbHover : null}
        `} 
        style={{
          left: `${percent}%`,
          height: typeof height === "number"
            ? `${height * 1.5}px`
            : "16px",
          backgroundColor: getThumbColor(percent),
        }}
      />

    </div>
  );
});
