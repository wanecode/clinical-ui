import { Tooltip } from "@base-ui/react/tooltip";
import { Info } from "lucide-react";
import type { ReactNode } from "react";

export interface ClinicalTooltipProviderProps {
  children: ReactNode;
  delay?: number;
}

export function ClinicalTooltipProvider({ children, delay = 250 }: ClinicalTooltipProviderProps) {
  return <Tooltip.Provider delay={delay}>{children}</Tooltip.Provider>;
}

export interface ClinicalInfoTooltipProps {
  label: string;
  children: ReactNode;
  side?: "top" | "right" | "bottom" | "left";
}

export function ClinicalInfoTooltip({ label, children, side = "top" }: ClinicalInfoTooltipProps) {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger className="cui-info-trigger" aria-label={label}>
        <Info aria-hidden="true" size={15} />
      </Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Positioner className="cui-tooltip-positioner" side={side} sideOffset={9}>
          <Tooltip.Popup className="cui-tooltip-popup" role="tooltip">
            <Tooltip.Arrow className="cui-tooltip-arrow" />
            {children}
          </Tooltip.Popup>
        </Tooltip.Positioner>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}
