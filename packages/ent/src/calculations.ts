import type { AudiogramPoint, EarSide } from "./types";

export const GOVERNED_PTA_FREQUENCIES = [500, 1000, 2000, 4000] as const;

export interface GovernedPta {
  side: EarSide;
  valueDbHl?: number;
  state: "calculated" | "not-calculable";
  frequenciesHz: readonly number[];
  explanation: string;
}

export function calculateGovernedPta(points: AudiogramPoint[], side: EarSide): GovernedPta {
  const usable = GOVERNED_PTA_FREQUENCIES.map((frequencyHz) =>
    points.find(
      (point) =>
        point.side === side &&
        point.conduction === "air" &&
        point.frequencyHz === frequencyHz &&
        !point.noResponse,
    ),
  );

  if (usable.some((point) => point === undefined)) {
    return {
      side,
      state: "not-calculable",
      frequenciesHz: GOVERNED_PTA_FREQUENCIES,
      explanation: "Une ou plusieurs fréquences gouvernées sont absentes ou sans réponse.",
    };
  }

  const total = usable.reduce((sum, point) => sum + (point?.thresholdDbHl ?? 0), 0);
  return {
    side,
    state: "calculated",
    valueDbHl: Math.round(total / GOVERNED_PTA_FREQUENCIES.length),
    frequenciesHz: GOVERNED_PTA_FREQUENCIES,
    explanation:
      "Moyenne arithmétique gouvernée à 500, 1 000, 2 000 et 4 000 Hz. Aide à la lecture, sans valeur diagnostique automatique.",
  };
}

export function calculateAirBoneGap(points: AudiogramPoint[], side: EarSide, frequencyHz: number) {
  const air = points.find(
    (point) =>
      point.side === side && point.frequencyHz === frequencyHz && point.conduction === "air",
  );
  const bone = points.find(
    (point) =>
      point.side === side && point.frequencyHz === frequencyHz && point.conduction === "bone",
  );
  if (!air || !bone || air.noResponse || bone.noResponse) return undefined;
  return air.thresholdDbHl - bone.thresholdDbHl;
}
