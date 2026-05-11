// "use client";

// import { CSSProperties, useImperativeHandle, forwardRef, useEffect, useState } from "react";

// import { useGlobalStyles } from "@/hooks/useGlobalStyles";
// import fStyles from "./style.module.scss";

// type TSliderVariant = "primary";
// interface IVariantConfig {
//   wrapper: string;
//   thumb: string;
//   track: string;
// }

// interface ISlider {
//   variant?: TSliderVariant;
//   value: boolean;
//   onChangeValue: (value: boolean) => void;
//   onChange?: () => void;
//   defaultValue?: boolean;
//   thumbColor?: string;
//   trackColor?: string | { true: string, false: string };
//   disabled?: boolean;
//   className?: string;
//   style?: CSSProperties;
// }

// export interface ISliderRef {
//   setValue: (value: boolean) => void;
// }

// type TState = {
//   open: boolean;
// };

// export const Slider = forwardRef<ISliderRef, ISlider>(({
//   variant = "primary",
//   value,
//   onChangeValue,
//   onChange,
//   defaultValue,
//   thumbColor,
//   trackColor,
//   disabled,
//   className,
//   style
// }, ref) => {
//   const { gColors } = useGlobalStyles();

//   // Actions

//   const [state, setState] = useState<TState>({
//     open: false,
//   });

//   useImperativeHandle(ref, () => ({
//     change: (value: boolean) => setValue(value),
//   }));

//   // Styles
  
//   const variantConfig: Record<TSliderVariant, IVariantConfig> = {
//     primary: {
//       wrapper: fStyles.sliderWrapper,
//       track: fStyles.sliderTrack,
//       thumb: fStyles.sliderThumb,
//     },
//   } as const;

//   const getVariant = (variant: TSliderVariant) => {
//     return variantConfig[variant];
//   };
//   const resolvedVariant = getVariant(variant);

//   const resolvedTrackerColor = trackColor ?? gColors.primary;
//   const resolvedThumbColor = thumbColor ?? gColors.bgSecondary;

//   // Auto Select if "defaultValue"
//   useEffect(() => {

//     if (disabled) return;
//     if (defaultValue === null || defaultValue === undefined) return;

//     if (!value) return;

//     if (defaultValue) {
//       onChangeValue(defaultValue);
//       onChange?.();
//     }

//   }, [defaultValue, value]);

//   // SetValue
//   const setValue = (value: boolean) => {
//     if (disabled) return;
//     setState({ open: value });
//   };

//   return (
//     <div className={`$${resolvedVariant.wrapper}`}>

//       <div 
//         style={{ backgroundColor: value ? : }} 
//         className={`${resolvedVariant.thumb}`} 
//       />

//       <div 
//         style={{ backgroundColor: resolvedThumbColor }} 
//         className={`${resolvedVariant.track}`} 
//       />

//     </div>
//   );
// });
