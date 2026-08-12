import type { CSSProperties, HTMLAttributes, ReactNode } from "react";

export const CLINICAL_UI_MODES = ["light", "dark"] as const;
export type ClinicalUiMode = (typeof CLINICAL_UI_MODES)[number];

export const CLINICAL_UI_PALETTES = ["clinical", "ocean", "sage"] as const;
export type ClinicalUiPalette = (typeof CLINICAL_UI_PALETTES)[number];

export const ECOMED_THEME_CONTRACT_SNAPSHOT = "2026-08-12";

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
  "border",
  "input",
  "ring",
  "chart-1",
  "chart-2",
  "chart-3",
  "chart-4",
  "chart-5",
] as const;

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
