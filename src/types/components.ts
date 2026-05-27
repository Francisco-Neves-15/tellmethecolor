// For All

export type ValueByBoolean = {
  false: unknown;
  true: unknown;
};

// For Colors

export type ColorByBoolean = {
  false: string;
  true: string;
};

export type ColorByLevel = {
  high?: string;
  normal?: string;
  low?: string;
};
