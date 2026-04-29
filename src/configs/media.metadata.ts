export const HTML_KEY_LAYOUT_TYPE = "data-layout-type";
export const HTML_KEY_SCREEN_TYPE = "data-screen-type";

export const BREAKPOINTS = {
  small: 500,
  large: 1200,
} as const;

export const LAYOUT_TYPE = {
  compact: "compact",
  expanded: "expanded",
} as const;

export const SCREEN_TYPE = {
  small: "small",
  medium: "medium",
  large: "large",
} as const;

export type LayoutTypeOptions = keyof typeof LAYOUT_TYPE;
export type ScreenTypeOptions = keyof typeof SCREEN_TYPE;

// Resolves

// type LayoutTypeMeta = {
//   id: string;
//   resolve: () => LayoutTypeOptions;
// };

// type ScreenSizeMeta = {
//   id: string;
//   resolve: () => ScreenTypeOptions;
// };

// export const LAYOUT_TYPE_META: Record<LayoutTypeOptions, LayoutTypeMeta> = {
//   compact: {
//     id: "media-layout-compact",
//     resolve: () => "compact",
//   },
//   expanded: {
//     id: "media-layout-expanded",
//     resolve: () => "expanded",
//   },
// };

// export const SCREEN_SIZE_META: Record<ScreenTypeOptions, ScreenSizeMeta> = {
//   small: {
//     id: "media-size-small",
//     resolve: () => "small",
//   },
//   medium: {
//     id: "media-size-medium",
//     resolve: () => "medium",
//   },
//   large: {
//     id: "media-size-large",
//     resolve: () => "large",
//   },
// };
