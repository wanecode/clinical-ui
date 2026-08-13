import type { CSSProperties, HTMLAttributes, ReactNode } from "react";

export const CLINICAL_UI_MODES = ["light", "dark"] as const;
export type ClinicalUiMode = (typeof CLINICAL_UI_MODES)[number];

export const CLINICAL_UI_PALETTES = ["clinical", "ocean", "sage"] as const;
export type ClinicalUiPalette = (typeof CLINICAL_UI_PALETTES)[number];

/** Version of the public host-theme contract, independent from any consumer. */
export const CLINICAL_UI_THEME_CONTRACT_VERSION = "2026-08-13";

export const SHADCN_COLOR_TOKENS = [
  "background",
  "foreground",
  "card",
  "card-foreground",
  "popover",
  "popover-foreground",
  "primary",
  "primary-foreground",
  "secondary",
  "secondary-foreground",
  "muted",
  "muted-foreground",
  "accent",
  "accent-foreground",
  "destructive",
  "destructive-foreground",
  "border",
  "input",
  "ring",
  "chart-1",
  "chart-2",
  "chart-3",
  "chart-4",
  "chart-5",
] as const;

export const CLINICAL_FOUNDATION_TOKENS = ["radius", "font-sans", "font-mono"] as const;

export const CLINICAL_SEMANTIC_FAMILIES = [
  "status-success",
  "status-pending",
  "status-critical",
  "status-active",
  "status-unknown",
  "status-offline",
  "clinical-critical",
  "clinical-warning",
  "clinical-information",
] as const;

export const CLINICAL_VIEWER_TOKENS = [
  "viewer-surface",
  "viewer-panel",
  "viewer-foreground",
  "viewer-muted-foreground",
  "viewer-border",
  "viewer-accent",
] as const;

export const CLINICAL_SURFACE_TOKENS = [
  "clinical-surface-inset",
  "clinical-surface-raised",
  "clinical-divider-strong",
] as const;

export const CLINICAL_DATA_TOKENS = [
  "clinical-data-observed",
  "clinical-data-projected",
  "clinical-data-reference",
] as const;

export const CLINICAL_INTERACTION_TOKENS = [
  "clinical-selection",
  "clinical-selection-foreground",
] as const;

export const CLINICAL_SEMANTIC_TOKENS = CLINICAL_SEMANTIC_FAMILIES.flatMap((family) => [
  family,
  `${family}-foreground`,
  `${family}-border`,
]);

/**
 * CSS custom properties that a host application must provide when it does not
 * import `@clinical-ui/theme/styles.css`. Names intentionally omit the `--`
 * prefix so consumers can use them in TypeScript and CSS tooling.
 */
export const CLINICAL_UI_REQUIRED_TOKENS = [
  ...SHADCN_COLOR_TOKENS,
  ...CLINICAL_FOUNDATION_TOKENS,
  ...CLINICAL_SEMANTIC_TOKENS,
  ...CLINICAL_SURFACE_TOKENS,
  ...CLINICAL_DATA_TOKENS,
  ...CLINICAL_INTERACTION_TOKENS,
  ...CLINICAL_VIEWER_TOKENS,
] as const;

export interface ClinicalThemeScopeProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  mode?: ClinicalUiMode;
  palette?: ClinicalUiPalette;
  fillViewport?: boolean;
}

export function ClinicalThemeScope({
  children,
  mode = "light",
  palette = "clinical",
  fillViewport = false,
  className,
  style,
  ...props
}: ClinicalThemeScopeProps) {
  const classes = [
    "clinical-ui-theme",
    fillViewport ? "clinical-ui-theme--viewport" : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      {...props}
      className={classes}
      data-clinical-mode={mode}
      data-palette={palette}
      style={style as CSSProperties}
    >
      {children}
    </div>
  );
}
