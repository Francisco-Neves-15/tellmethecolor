 git diff
diff --git a/src/app/page.tsx b/src/app/page.tsx
index 18d8758..79bc6db 100644
--- a/src/app/page.tsx
+++ b/src/app/page.tsx
@@ -68,10 +68,18 @@ export default function Home() {
       <input type="range" name="" id="" />

       <Slider
+        indicator="circle"
+        value={slider}
+        onChangeValue={(v) => { setSlider(v); console.log(v) }}
+
+      />
+
+      <br /> <br /> <br />
+
+      <Slider
+        indicator="line"
         value={slider}
         onChangeValue={(v) => { setSlider(v); console.log(v) }}
-        updateOnDrag
-        thumbColor={{ high: "#00ff00", low: "#ff0000" }}
       />

       <br />
diff --git a/src/components/ui/own/Slider/index.tsx b/src/components/ui/own/Slider/index.tsx
index 4c22ecf..d0040f3 100644
--- a/src/components/ui/own/Slider/index.tsx
+++ b/src/components/ui/own/Slider/index.tsx
@@ -1,5 +1,5 @@
 "use client";
-import { forwardRef, useEffect, useState, useRef } from "react";
+import { forwardRef, useEffect, useState, useRef, CSSProperties } from "react";

 import { useGlobalStyles } from "@/hooks/useGlobalStyles";
 import fStyles from "./style.module.scss";
@@ -9,14 +9,20 @@ interface IVariantConfig {
   wrapper: string;
   thumb: string;
   track: string;
-  dot: string;
-}
+};
+
+type TSliderIndicatorVariant = "circle" | "line";
+interface IVariantIndicatorConfig {
+  style: CSSProperties;
+  className: string;
+};

 interface ISlider {
   variant?: TSliderVariant;
+  indicator?: TSliderIndicatorVariant;

-  value: number;
-  onChangeValue: (value: number) => void;
+  value?: number;
+  onChangeValue?: (value: number) => void;
   onChange?: () => void;
   defaultValue?: number;

@@ -39,6 +45,7 @@ export interface ISliderRef { };

 export const Slider = forwardRef<ISliderRef, ISlider>(({
   variant = "primary",
+  indicator = "circle",

   value,
   onChangeValue,
@@ -56,37 +63,29 @@ export const Slider = forwardRef<ISliderRef, ISlider>(({
   trackColor = undefined,

   width = 150,
-  height = 10,
+  height = 12,

   disabled
 }, ref) => {
   const { gColors } = useGlobalStyles();

   const sliderRef = useRef<HTMLDivElement>(null);
-  const lastEmittedValueRef = useRef<number>(value);

   const [dragging, setDragging] = useState(false);
-  const [internalValue, setInternalValue] = useState(value);

   const resolvedMin = min ?? 0;
   const resolvedMax = max ?? 100;
   const resolvedStep = step ?? 1;

-  // Styles
-
-  const variantConfig: Record<TSliderVariant, IVariantConfig> = {
-    primary: {
-      wrapper: fStyles.sliderWrapper,
-      track: fStyles.sliderTrack,
-      thumb: fStyles.sliderThumb,
-      dot: fStyles.sliderThumbDot,
-    },
-  } as const;
+  const lastEmittedValueRef = useRef<number>(
+    value ?? defaultValue ?? resolvedMin
+  );

-  const getVariant = (variant: TSliderVariant) => {
-    return variantConfig[variant];
-  };
-  const resolvedVariant = getVariant(variant);
+  const [internalValue, setInternalValue] = useState<number>(
+    value ?? defaultValue ?? resolvedMin
+  );
+
+  // Other's

   const resolvedTrackColor = trackColor ?? gColors.bgSecondary;

@@ -143,7 +142,7 @@ export const Slider = forwardRef<ISliderRef, ISlider>(({

     lastEmittedValueRef.current = normalized;

-    onChangeValue(normalized);
+    onChangeValue?.(normalized);
     onChange?.();
   };

@@ -154,11 +153,12 @@ export const Slider = forwardRef<ISliderRef, ISlider>(({
     event.currentTarget.setPointerCapture(event.pointerId);
   };

-  const handleTrackClick = (event: React.MouseEvent<HTMLDivElement>) => {
+  const handleTrackClick = (event: React.PointerEvent<HTMLDivElement>) => {
     if (!allowTrackClick) return;

     const nextValue = getValueFromClientX(event.clientX);

+    handlePointerDown(event);
     setInternalValue(nextValue);
     emitValue(nextValue);
   };
@@ -167,7 +167,7 @@ export const Slider = forwardRef<ISliderRef, ISlider>(({
   useEffect(() => {
     if (defaultValue === undefined || defaultValue === null) return;
     if (value !== defaultValue) {
-      onChangeValue(defaultValue);
+      onChangeValue?.(defaultValue);
       onChange?.();
     }
   }, []);
@@ -214,25 +214,82 @@ export const Slider = forwardRef<ISliderRef, ISlider>(({
     };
   }, [dragging]);

+  // Value's
+
+  const fallbackValue = defaultValue ?? resolvedMin;
+
+  const isControlled = value !== undefined;
+
+  const currentValue =
+    dragging
+      ? internalValue
+      : isControlled
+        ? value
+        : internalValue ?? fallbackValue;
+
+  const percent =
+    ((currentValue - resolvedMin) /
+      (resolvedMax - resolvedMin)) *
+    100;
+
   // Controlled

   useEffect(() => {
-    if (!dragging) {
+    if (value !== undefined && !dragging) {
       setInternalValue(value);
     }
   }, [value, dragging]);

   useEffect(() => {
-    lastEmittedValueRef.current = value;
+    lastEmittedValueRef.current = value ?? fallbackValue;
   }, [value]);

-  // Value's
+  // =============== Styles ===============
+
+  // Slider Variant's
+  const variantConfig: Record<TSliderVariant, IVariantConfig> = {
+    primary: {
+      "wrapper": fStyles.sliderWrapper,
+      "track": fStyles.sliderTrack,
+      "thumb": fStyles.sliderThumb
+    },
+  } as const;

-  const currentValue = dragging ? internalValue : value;
-  const percent =
-    ((currentValue - resolvedMin) /
-      (resolvedMax - resolvedMin)) *
-    100;
+  const getVariant = (variant: TSliderVariant) => {
+    return variantConfig[variant];
+  };
+  const resolvedVariant = getVariant(variant);
+
+  // Slider Indicator
+  const indicatorConfig: Record<TSliderIndicatorVariant, IVariantIndicatorConfig> = {
+    "circle": {
+      style: {
+        left: `${percent}%`,
+        height: typeof height === "number" ? `${height * 1.5}px` : "24px",
+        backgroundColor: getThumbColor(percent),
+      },
+      className: `
+        ${fStyles.sliderIndicatorDot}
+        ${fStyles.sliderThumbHover}
+      `,
+    },
+    "line": {
+      style: {
+        left: `${percent}%`,
+        width: 4,
+        height: typeof height === "number" ? `${height + 12}px` : "24px",
+        backgroundColor: gColors.light
+      },
+      className: `
+        ${fStyles.sliderIndicatorLine}
+      `,
+    }
+  } as const;
+
+  const getIndicator = (indicator: TSliderIndicatorVariant) => {
+    return indicatorConfig[indicator];
+  };
+  const resolvedIndicator = getIndicator(indicator);

   return (
     <div
@@ -249,7 +306,7 @@ export const Slider = forwardRef<ISliderRef, ISlider>(({
         onPointerDown={handleTrackClick}
         className={`${resolvedVariant.track}`}
         style={{
-          height: `100%`,
+          height: typeof height === "number" ? `${height}px` : "24px",
           backgroundColor: resolvedTrackColor,
         }}
       />
@@ -262,24 +319,15 @@ export const Slider = forwardRef<ISliderRef, ISlider>(({
         `}
         style={{
           width: `${percent}%`,
-          height: `100%`,
+          height: typeof height === "number" ? `${height}px` : "24px",
           backgroundColor: getThumbColor(percent),
         }}
       />

       <div
         onPointerDown={handlePointerDown}
-        className={`
-          ${resolvedVariant.dot}
-          ${allowTrackClick ? fStyles.sliderThumbHover : null}
-        `}
-        style={{
-          left: `${percent}%`,
-          height: typeof height === "number"
-            ? `${height * 1.5}px`
-            : "16px",
-          backgroundColor: getThumbColor(percent),
-        }}
+        className={`${fStyles.sliderIndicator} ${resolvedIndicator.className}`}
+        style={resolvedIndicator.style}
       />

     </div>
diff --git a/src/components/ui/own/Slider/style.module.scss b/src/components/ui/own/Slider/style.module.scss
index 31de0b2..cff1ed7 100644
--- a/src/components/ui/own/Slider/style.module.scss
+++ b/src/components/ui/own/Slider/style.module.scss
@@ -1,3 +1,5 @@
+@use "@mixins" as mix;
+
 .sliderWrapper {
   position: relative;
   user-select: none;
@@ -22,19 +24,27 @@
   overflow: hidden;
 }

-.sliderThumbDot {
+.sliderThumbHover {
+  &:hover {
+    filter: contrast(115%);
+  }
+}
+
+// Indicator
+
+.sliderIndicator {
   position: absolute;
   top: 50%;
   right: 0;
   transform: translateY(-50%) translateX(-50%);
-  aspect-ratio: 1;
-  border-radius: 50%;
   cursor: pointer;
+}

+.sliderIndicatorDot {
+  aspect-ratio: 1;
+  border-radius: 50%;
 }

-.sliderThumbHover {
-  &:hover {
-    filter: contrast(115%);
-  }
-}
\ No newline at end of file
+.sliderIndicatorLine {
+  border-radius: 8px;
+}
(END)