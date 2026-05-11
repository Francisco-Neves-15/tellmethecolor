git diff
warning: in the working copy of 'src/hooks/useGlobalStyles.ts', LF will be replaced by CRLF the next time Git touches it
diff --git a/src/app/layout_test/page.tsx b/src/app/layout_test/page.tsx
index 8ef0ab9..661250c 100644
--- a/src/app/layout_test/page.tsx
+++ b/src/app/layout_test/page.tsx
@@ -3,7 +3,7 @@
 import Link from "next/link";

 // Style
-import useGlobalStyles from "@/hooks/useGlobalStyles";
+import { useGlobalStyles } from "@/hooks/useGlobalStyles";

 // Icons
 import { LuHouse } from "react-icons/lu";
diff --git a/src/app/page.tsx b/src/app/page.tsx
index daebb22..18d8758 100644
--- a/src/app/page.tsx
+++ b/src/app/page.tsx
@@ -3,7 +3,7 @@ import { useEffect, useRef, useState } from "react";
 import Link from "next/link";

 // Style
-import useGlobalStyles from "@/hooks/useGlobalStyles";
+import { useGlobalStyles } from "@/hooks/useGlobalStyles";
 import fStyles from "./style.module.scss"

 // Hooks
@@ -18,6 +18,7 @@ import { Text } from "@/components/ui/own/Text";
 import { Button } from "@/components/ui/own/Button";
 import { Select, TSelectItems, ISelectRef, selectValueIsPrimitive } from "@/components/ui/own/Select";
 import { LuHouse } from "react-icons/lu";
+import { Slider } from "@/components/ui/own/Slider";



@@ -59,11 +60,20 @@ export default function Home() {
     }
   }, [test2])

+  const [slider, setSlider] = useState<number>(0);
+
   return (
     <Container padding header={true}>

       <input type="range" name="" id="" />

+      <Slider
+        value={slider}
+        onChangeValue={(v) => { setSlider(v); console.log(v) }}
+        updateOnDrag
+        thumbColor={{ high: "#00ff00", low: "#ff0000" }}
+      />
+
       <br />

       <select name="" id="">
diff --git a/src/app/settings/page.tsx b/src/app/settings/page.tsx
index f6bcc24..152f54c 100644
--- a/src/app/settings/page.tsx
+++ b/src/app/settings/page.tsx
@@ -3,7 +3,7 @@
 import Link from "next/link";

 // Style
-import useGlobalStyles from "@/hooks/useGlobalStyles";
+import { useGlobalStyles } from "@/hooks/useGlobalStyles";

 // Components

diff --git a/src/components/ui/own/Button/index.tsx b/src/components/ui/own/Button/index.tsx
index 5f847c8..6694bd7 100644
--- a/src/components/ui/own/Button/index.tsx
+++ b/src/components/ui/own/Button/index.tsx
@@ -2,7 +2,7 @@
 import { ButtonHTMLAttributes, forwardRef } from "react";

 // Styles
-import useGlobalStyles from "@/hooks/useGlobalStyles";
+import { useGlobalStyles } from "@/hooks/useGlobalStyles";
 import fStyles from "./style.module.scss";

 // Types
diff --git a/src/components/ui/own/DivisorLine/index.tsx b/src/components/ui/own/DivisorLine/index.tsx
index a3d0bb9..65b4628 100644
--- a/src/components/ui/own/DivisorLine/index.tsx
+++ b/src/components/ui/own/DivisorLine/index.tsx
@@ -1,6 +1,6 @@
 "use client";

-import useGlobalStyles from "@/hooks/useGlobalStyles";
+import { useGlobalStyles } from "@/hooks/useGlobalStyles";
 import { CSSProperties, forwardRef } from "react";

 type TLineDirection =
@@ -8,13 +8,13 @@ type TLineDirection =
   | "vertical";


-interface DivisorProps extends React.HTMLAttributes<HTMLDivElement> {
+interface DivisorProps {
   show?: boolean;
   direction?: TLineDirection;
   thickness?: number;
   color?: string;
-  className?: string;
   style?: CSSProperties;
+  className?: string;
 };


diff --git a/src/components/ui/own/Progress/index.tsx b/src/components/ui/own/Progress/index.tsx
index bca3800..6bdadce 100644
--- a/src/components/ui/own/Progress/index.tsx
+++ b/src/components/ui/own/Progress/index.tsx
@@ -1,9 +1,9 @@
 "use client";

-import { forwardRef, useEffect, useRef, useState } from "react";
-import useGlobalStyles from "@/hooks/useGlobalStyles";
+import { CSSProperties, forwardRef, useEffect, useRef, useState } from "react";
+import { useGlobalStyles } from "@/hooks/useGlobalStyles";

-interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
+interface ProgressProps {
   barColor?: string | null;
   wrapperColor?: string | null;
   value?: number;
@@ -13,6 +13,8 @@ interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
   duration?: number;
   width?: number | "full";
   height?: number | "full";
+  style?: CSSProperties;
+  className?: string;
 }

 export const Progress = forwardRef<HTMLDivElement, ProgressProps>(({
@@ -27,7 +29,6 @@ export const Progress = forwardRef<HTMLDivElement, ProgressProps>(({
   height = 16,
   className,
   style,
-  ...props
 }, ref ) => {

   const { gColors } = useGlobalStyles();
@@ -82,7 +83,6 @@ export const Progress = forwardRef<HTMLDivElement, ProgressProps>(({
       ref={ref}
       className={`relative overflow-hidden ${className ?? ""}`}
       style={computedStyle}
-      {...props}
     >
       <div className="w-full h-full" style={{ backgroundColor: finalWrapperColor }}>
         <div
diff --git a/src/components/ui/own/Select/index.tsx b/src/components/ui/own/Select/index.tsx
index 1b115ea..a99f2da 100644
--- a/src/components/ui/own/Select/index.tsx
+++ b/src/components/ui/own/Select/index.tsx
@@ -14,7 +14,7 @@ import { createPortal } from "react-dom";
 import { LuX, LuChevronDown } from "react-icons/lu";

 // Styles
-import useGlobalStyles from "@/hooks/useGlobalStyles";
+import { useGlobalStyles } from "@/hooks/useGlobalStyles";
 import fStyles from "./style.module.scss"

 // Components
@@ -80,6 +80,7 @@ interface ISelect {
   items: TSelectItems[];
   value: TSelectItems | null;
   onChangeValue: (item: TSelectItems) => void;
+  onChange?: () => void;
   search?: boolean;
   defaultValueIdOrIndex?: string | number | null;
   placeholder?: string;
@@ -128,6 +129,7 @@ export const Select = forwardRef<ISelectRef, ISelect>(({
   items = [],
   value,
   onChangeValue,
+  onChange,
   search = false,
   defaultValueIdOrIndex = null,
   placeholder,
@@ -281,6 +283,7 @@ export const Select = forwardRef<ISelectRef, ISelect>(({

     if (selectedItem !== undefined) {
       onChangeValue(selectedItem);
+      onChange?.();
     }

   }, [defaultValueIdOrIndex, items]);
@@ -418,6 +421,7 @@ export const Select = forwardRef<ISelectRef, ISelect>(({
   const onSelectValue = (value: TSelectItems) => {
     if (disabled) return;
     onChangeValue(value);
+    onChange?.();
     close();
     // DEBUG
     // selectValueIsPrimitive(value) ?
diff --git a/src/hooks/useGlobalStyles.ts b/src/hooks/useGlobalStyles.ts
index 48af421..4008875 100644
--- a/src/hooks/useGlobalStyles.ts
+++ b/src/hooks/useGlobalStyles.ts
@@ -2,7 +2,7 @@

 import { IPaletteColors } from "@/types/theme";

-function useGlobalStyles() {
+export function useGlobalStyles() {
   return {
     // AUTO-GENERATED--PALETTE-COLORS START
     gColors: {
@@ -35,6 +35,4 @@ function useGlobalStyles() {
     } as IPaletteColors,
 // AUTO-GENERATED--PALETTE-COLORS END
   };
-}
-
-export default useGlobalStyles;
+};
(END)