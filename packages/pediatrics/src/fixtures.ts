import type {
  DevelopmentWindow,
  DoseCalculation,
  GrowthSeries,
  PediatricActorContext,
  PediatricAgeContext,
  PediatricDisposition,
  PediatricNormDatum,
  PediatricServiceItem,
  PediatricTrajectoryEvent,
  PediatricTriageDatum,
  PediatricVigilanceItem,
  PediatricWeightEvidence,
  PreventionItem,
  TransitionReadinessItem,
} from "./types";

const observed = {
  origin: "observed",
  clinicalStatus: "validated",
} as const;

export const syntheticAgeContext: PediatricAgeContext = {
  ...observed,
  chronologicalAge: "7 mois",
  correctedAge: "5 mois et 10 jours",
  bornAt: "2025-01-15",
  gestationalAgeAtBirth: "30 SA + 2 j",
  referenceBasis: "corrected",
  recordedAt: "2025-08-15",
  sourceReference: "Patient/pediatric-synthetic-1",
};

export const syntheticDoseWeight: PediatricWeightEvidence = {
  ...observed,
  value: 6.1,
  unit: "kg",
  measuredAt: "2025-08-13",
  use: "dose",
  freshnessStatus: "fresh",
  sourceReference: "Observation/weight-dose-synthetic",
};

export const syntheticWeights: PediatricWeightEvidence[] = [
  {
    ...observed,
    value: 6.1,
    unit: "kg",
    measuredAt: "2025-08-13",
    use: "growth",
    freshnessStatus: "fresh",
    sourceReference: "Observation/weight-growth-synthetic",
  },
  syntheticDoseWeight,
];

export const syntheticNorms: PediatricNormDatum[] = [
  {
    ...observed,
    id: "heart-rate",
    label: "Fréquence cardiaque",
    value: "152/min",
    reference: "100–160/min · 6–12 mois",
    interpretation: "borderline",
    sourceReference: "Observation/hr-synthetic",
  },
  {
    ...observed,
    id: "respiratory-rate",
    label: "Fréquence respiratoire",
    value: "46/min",
    reference: "25–60/min · 6–12 mois",
    interpretation: "within",
    sourceReference: "Observation/rr-synthetic",
  },
  {
    ...observed,
    id: "spo2",
    label: "Saturation",
    value: "96 %",
    reference: "Référence locale documentée",
    interpretation: "within",
    sourceReference: "Observation/spo2-synthetic",
  },
];

export const syntheticVigilanceItems: PediatricVigilanceItem[] = [
  {
    id: "growth",
    label: "Décrochage pondéral",
    detail: "Passage documenté du p50 au p10.",
    severity: "warning",
    dueAt: "2025-08-22",
    owner: "Équipe pédiatrique synthétique",
    origin: "derived",
    clinicalStatus: "warning",
    sourceReference: "DetectedIssue/growth-synthetic",
  },
  {
    id: "screening",
    label: "Dépistage auditif non conclu",
    detail: "Résultat indisponible, contrôle à organiser.",
    severity: "information",
    origin: "projected",
    clinicalStatus: "preliminary",
    sourceReference: "Task/hearing-synthetic",
  },
];

export const syntheticGrowthSeries: GrowthSeries[] = [
  {
    id: "weight",
    label: "Poids pour l’âge",
    unit: "kg",
    curveLabel: "Courbe synthétique de démonstration",
    curveVersion: "2026.1-demo",
    ageBasis: "corrected",
    points: [
      {
        ...observed,
        at: "2025-03-13",
        ageMonths: 0,
        value: 3.4,
        percentile: 50,
        sourceReference: "Observation/growth-1-synthetic",
      },
      {
        ...observed,
        at: "2025-04-13",
        ageMonths: 1,
        value: 4.6,
        percentile: 50,
        sourceReference: "Observation/growth-2-synthetic",
      },
      {
        ...observed,
        at: "2025-05-13",
        ageMonths: 2,
        value: 5.3,
        percentile: 42,
        sourceReference: "Observation/growth-3-synthetic",
      },
      {
        ...observed,
        at: "2025-06-13",
        ageMonths: 3,
        value: 5.7,
        percentile: 30,
        sourceReference: "Observation/growth-4-synthetic",
      },
      {
        ...observed,
        at: "2025-07-13",
        ageMonths: 4,
        value: 5.9,
        percentile: 18,
        sourceReference: "Observation/growth-5-synthetic",
      },
      {
        ...observed,
        at: "2025-08-13",
        ageMonths: 5,
        value: 6.1,
        percentile: 10,
        sourceReference: "Observation/growth-6-synthetic",
      },
    ],
  },
];

export const syntheticDevelopmentWindows: DevelopmentWindow[] = [
  {
    ...observed,
    id: "sit",
    label: "Tient assis avec appui",
    opensAt: "4 mois",
    closesAt: "8 mois",
    status: "acquired",
    sourceReference: "Observation/milestone-sit-synthetic",
  },
  {
    ...observed,
    id: "transfer",
    label: "Transfère des objets",
    opensAt: "6 mois",
    closesAt: "12 mois",
    status: "current",
    sourceReference: "Observation/milestone-transfer-synthetic",
  },
  {
    ...observed,
    id: "babble",
    label: "Babillage diversifié",
    opensAt: "6 mois",
    closesAt: "10 mois",
    status: "follow-up",
    sourceReference: "Observation/milestone-babble-synthetic",
  },
];

export const syntheticDoseCalculation: DoseCalculation = {
  medication: "Médicament synthétique",
  weight: syntheticDoseWeight,
  dosePerKg: "15 mg/kg",
  computedDose: "91,5 mg",
  maximumDose: "366 mg / 24 h",
  administrableVolume: "2,9 mL par prise",
  status: "to-review",
  missingInputs: [],
  origin: "derived",
  clinicalStatus: "warning",
  recordedAt: "2025-08-15",
  sourceReference: "MedicationRequest/dose-synthetic",
};

export const syntheticPreventionItems: PreventionItem[] = [
  {
    ...observed,
    id: "immunization-1",
    kind: "immunization",
    label: "Vaccination A",
    window: "6–9 mois",
    status: "complete",
    detail: "Administration documentée",
    sourceReference: "Immunization/a-synthetic",
  },
  {
    ...observed,
    id: "immunization-2",
    kind: "immunization",
    label: "Vaccination B",
    window: "9–12 mois",
    status: "due",
    detail: "Fenêtre actuelle",
    sourceReference: "ImmunizationRecommendation/b-synthetic",
  },
  {
    ...observed,
    id: "screening-vision",
    kind: "screening",
    label: "Dépistage visuel",
    window: "9–12 mois",
    status: "follow-up",
    detail: "Résultat à confirmer",
    sourceReference: "DiagnosticReport/vision-synthetic",
  },
  {
    ...observed,
    id: "screening-hearing",
    kind: "screening",
    label: "Dépistage auditif",
    window: "Naissance",
    status: "unavailable",
    detail: "Compte rendu absent",
    sourceReference: "DiagnosticReport/hearing-synthetic",
  },
];

export const syntheticTriageObservations: PediatricTriageDatum[] = [
  {
    ...observed,
    id: "temperature",
    label: "Température",
    value: "38,9 °C",
    ageReference: "Référence 6–12 mois",
    severity: "warning",
    sourceReference: "Observation/temp-synthetic",
  },
  {
    ...observed,
    id: "respiratory-rate",
    label: "Fréquence respiratoire",
    value: "58/min",
    ageReference: "25–60/min",
    severity: "warning",
    sourceReference: "Observation/triage-rr-synthetic",
  },
  {
    ...observed,
    id: "oxygen",
    label: "Saturation",
    value: "93 %",
    ageReference: "Référence locale documentée",
    severity: "critical",
    sourceReference: "Observation/triage-spo2-synthetic",
  },
];

export const syntheticRedFlags: PediatricTriageDatum[] = [
  {
    ...observed,
    id: "distress",
    label: "Signes respiratoires",
    value: "Tirage documenté",
    severity: "critical",
    sourceReference: "Observation/distress-synthetic",
  },
  {
    ...observed,
    id: "hydration",
    label: "Hydratation",
    value: "Muqueuses sèches",
    severity: "warning",
    sourceReference: "Observation/hydration-synthetic",
  },
];

export const syntheticDisposition: PediatricDisposition = {
  label: "Évaluation médicale requise",
  detail: "Disposition saisie dans la démonstration synthétique.",
  status: "documented",
  owner: "Clinicien synthétique",
  origin: "observed",
  clinicalStatus: "validated",
  sourceReference: "Task/disposition-synthetic",
};

export const syntheticTrajectoryEvents: PediatricTrajectoryEvent[] = [
  {
    ...observed,
    id: "episode-1",
    at: "2024-02-20",
    lane: "episode",
    label: "Épisode aigu",
    detail: "Événement synthétique documenté.",
    sourceReference: "Encounter/episode-1-synthetic",
  },
  {
    ...observed,
    id: "assessment-1",
    at: "2024-05-14",
    lane: "assessment",
    label: "Contrôle partiel",
    detail: "Mesure observée, maturité validée.",
    sourceReference: "Observation/control-synthetic",
  },
  {
    origin: "imported",
    clinicalStatus: "preliminary",
    id: "school-1",
    at: "2024-09-12",
    lane: "school",
    label: "Données scolaires partielles",
    detail: "Source externe non encore confirmée.",
    sourceReference: "DocumentReference/school-synthetic",
  },
  {
    origin: "patient-reported",
    clinicalStatus: "preliminary",
    id: "plan-1",
    at: "2025-02-28",
    lane: "plan",
    label: "Plan d’action en révision",
    detail: "Version préliminaire signalée.",
    sourceReference: "CarePlan/action-plan-synthetic",
  },
];

export const syntheticActorContexts: PediatricActorContext[] = [
  {
    ...observed,
    id: "child",
    role: "child",
    label: "Enfant synthétique",
    sharingStatus: "allowed",
    detail: "Préférences de communication documentées.",
    sourceReference: "Patient/pediatric-synthetic-1",
  },
  {
    origin: "caregiver-reported",
    clinicalStatus: "validated",
    id: "caregiver",
    role: "caregiver",
    label: "Responsable synthétique",
    relationship: "Parent",
    sharingStatus: "allowed",
    detail: "Consentement de partage actif.",
    sourceReference: "RelatedPerson/caregiver-synthetic",
  },
  {
    origin: "patient-reported",
    clinicalStatus: "validated",
    id: "confidential",
    role: "confidential",
    label: "Entretien confidentiel",
    sharingStatus: "restricted",
    detail: "Le contenu sensible n’est pas exposé.",
    sourceReference: "Consent/confidential-synthetic",
  },
];

export const syntheticTransitionItems: TransitionReadinessItem[] = [
  {
    ...observed,
    id: "understanding",
    label: "Comprend son parcours",
    status: "ready",
    sourceReference: "Goal/transition-understanding-synthetic",
  },
  {
    ...observed,
    id: "medication",
    label: "Gère ses médicaments",
    status: "in-progress",
    detail: "Évaluation en cours.",
    sourceReference: "Goal/transition-medication-synthetic",
  },
  {
    ...observed,
    id: "appointments",
    label: "Prend ses rendez-vous",
    status: "missing",
    detail: "Aucune preuve documentée.",
    sourceReference: "Goal/transition-appointments-synthetic",
  },
];

export const syntheticServiceItems: PediatricServiceItem[] = [
  {
    id: "PE-010",
    label: "Consultation de croissance",
    duration: "30 min",
    level: "essential",
    sourceReference: "HealthcareService/pediatrics-synthetic",
  },
  {
    id: "PE-020",
    label: "Revue de prescription pédiatrique",
    duration: "20 min",
    level: "essential",
    sourceReference: "HealthcareService/pediatrics-synthetic",
  },
  {
    id: "PE-052",
    label: "Évaluation neurodéveloppementale",
    duration: "45 min",
    level: "reference",
    sourceReference: "HealthcareService/pediatrics-synthetic",
  },
];
