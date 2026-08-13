import type { Coding, FhirMeta, Reference } from "@clinical-ui/fhir";
import { DERMATOLOGY_EXTENSION, DERMATOLOGY_SYSTEM, SYNTHETIC_TAG_SYSTEM } from "./fhir-utils";
import type {
  BodyMapView,
  DermatologyBodyStructure,
  DermatologyConsent,
  DermatologyDetectedIssue,
  DermatologyDocumentReference,
  DermatologyMedicationRequest,
  DermatologyObservation,
  DermatologyObservationStatus,
  DermatologyProcedure,
  DermatologyResource,
} from "./types";

export const SYNTHETIC_DERMATOLOGY_NOW = "2026-08-12T10:15:00Z";

const syntheticMeta: FhirMeta = {
  lastUpdated: SYNTHETIC_DERMATOLOGY_NOW,
  tag: [
    {
      system: SYNTHETIC_TAG_SYSTEM,
      code: "synthetic",
      display: "Donnée synthétique",
    },
  ],
};

const patient: Reference = {
  reference: "Patient/patient-synthetic-dermatology-001",
  display: "Mariam Diop · cas synthétique",
};

const practitioner: Reference = {
  reference: "Practitioner/practitioner-synthetic-dermatology-001",
  display: "Dr A. Fall · démonstration",
};

function coding(code: string, display: string): Coding {
  return { system: DERMATOLOGY_SYSTEM, code, display };
}

function originExtension(origin: "observed" | "imported" | "derived" | "projected") {
  return [{ url: `${DERMATOLOGY_EXTENSION}/data-origin`, valueCode: origin }];
}

function lesionFixture({
  id,
  identifier,
  siteCode,
  site,
  landmark,
  view,
  x,
  y,
  active = true,
}: {
  id: string;
  identifier: string;
  siteCode: string;
  site: string;
  landmark: string;
  view: BodyMapView;
  x: number;
  y: number;
  active?: boolean;
}): DermatologyBodyStructure {
  return {
    resourceType: "BodyStructure",
    id,
    meta: syntheticMeta,
    identifier: [
      {
        use: "official",
        system: "https://clinical-ui.dev/fhir/NamingSystem/synthetic-lesion-id",
        value: identifier,
      },
    ],
    active,
    morphology: {
      coding: [coding("pigmented-lesion", "Lésion pigmentée")],
      text: "Lésion pigmentée synthétique",
    },
    includedStructure: [
      {
        structure: {
          coding: [coding(siteCode, site)],
          text: site,
        },
        bodyLandmarkOrientation: [
          {
            landmarkDescription: [
              {
                coding: [coding("relative-anatomical-landmark", landmark)],
                text: landmark,
              },
            ],
          },
        ],
      },
    ],
    patient,
    description: `${identifier} · ${site} · cas entièrement synthétique`,
    extension: [
      { url: `${DERMATOLOGY_EXTENSION}/body-map-view`, valueCode: view },
      { url: `${DERMATOLOGY_EXTENSION}/body-map-x`, valueDecimal: x },
      { url: `${DERMATOLOGY_EXTENSION}/body-map-y`, valueDecimal: y },
      { url: `${DERMATOLOGY_EXTENSION}/anatomical-landmark`, valueString: landmark },
    ],
  };
}

export const syntheticLesions: DermatologyBodyStructure[] = [
  lesionFixture({
    id: "body-structure-synthetic-dermatology-les-024",
    identifier: "LES-024",
    siteCode: "right-scapular-region",
    site: "Région scapulaire droite",
    landmark: "À 3 cm du bord médial de la scapula droite",
    view: "posterior",
    x: 0.62,
    y: 0.29,
  }),
  lesionFixture({
    id: "body-structure-synthetic-dermatology-les-031",
    identifier: "LES-031",
    siteCode: "left-forearm",
    site: "Avant-bras gauche, face latérale",
    landmark: "À 5 cm du pli du coude",
    view: "left-lateral",
    x: 0.33,
    y: 0.48,
  }),
  lesionFixture({
    id: "body-structure-synthetic-dermatology-les-044",
    identifier: "LES-044",
    siteCode: "anterior-trunk",
    site: "Tronc antérieur",
    landmark: "Sous le rebord costal droit",
    view: "anterior",
    x: 0.57,
    y: 0.42,
  }),
  lesionFixture({
    id: "body-structure-synthetic-dermatology-les-045",
    identifier: "LES-045",
    siteCode: "anterior-trunk",
    site: "Tronc antérieur",
    landmark: "À 1 cm de LES-044",
    view: "anterior",
    x: 0.58,
    y: 0.43,
  }),
];

function quantityObservation({
  id,
  code,
  display,
  value,
  unit,
  date,
  focus,
  origin = "observed",
  status = "final",
  note,
}: {
  id: string;
  code: string;
  display: string;
  value: number;
  unit: string;
  date: string;
  focus?: Reference;
  origin?: "observed" | "imported" | "derived" | "projected";
  status?: DermatologyObservationStatus;
  note?: string;
}): DermatologyObservation {
  return {
    resourceType: "Observation",
    id,
    meta: syntheticMeta,
    status,
    category: [{ coding: [coding("dermatology-measurement", "Mesure dermatologique")] }],
    code: { coding: [coding(code, display)], text: display },
    subject: patient,
    ...(focus ? { focus: [focus] } : {}),
    effectiveDateTime: date,
    performer: [practitioner],
    valueQuantity: {
      value,
      unit,
      system: "http://unitsofmeasure.org",
      code: unit,
    },
    ...(note ? { note: [{ text: note }] } : {}),
    extension: originExtension(origin),
  };
}

const lesion024: Reference = {
  reference: "BodyStructure/body-structure-synthetic-dermatology-les-024",
  display: "LES-024",
};

export const syntheticLesionMeasurements: DermatologyObservation[] = [
  quantityObservation({
    id: "observation-synthetic-dermatology-les-024-diameter-2025",
    code: "lesion-diameter",
    display: "Diamètre maximal",
    value: 5.1,
    unit: "mm",
    date: "2025-09-12T09:00:00Z",
    focus: lesion024,
    origin: "imported",
    status: "preliminary",
    note: "Import synthétique depuis une mesure dermoscopique.",
  }),
  quantityObservation({
    id: "observation-synthetic-dermatology-les-024-diameter-2026-03",
    code: "lesion-diameter",
    display: "Diamètre maximal",
    value: 5.5,
    unit: "mm",
    date: "2026-03-18T09:00:00Z",
    focus: lesion024,
    origin: "observed",
  }),
  quantityObservation({
    id: "observation-synthetic-dermatology-les-024-diameter-2026-08",
    code: "lesion-diameter",
    display: "Diamètre maximal",
    value: 6.2,
    unit: "mm",
    date: "2026-08-08T09:00:00Z",
    focus: lesion024,
    origin: "observed",
    status: "amended",
    note: "Valeur amendée après recalibrage de l’échelle synthétique.",
  }),
  quantityObservation({
    id: "observation-synthetic-dermatology-les-024-area-derived",
    code: "lesion-area",
    display: "Surface dérivée",
    value: 24.8,
    unit: "mm2",
    date: "2026-08-08T09:01:00Z",
    focus: lesion024,
    origin: "derived",
  }),
];

export const syntheticImageConsent: DermatologyConsent = {
  resourceType: "Consent",
  id: "consent-synthetic-dermatology-image-001",
  meta: { ...syntheticMeta, versionId: "3" },
  status: "active",
  category: [
    {
      coding: [coding("clinical-image-consent", "Consentement à l’imagerie clinique")],
      text: "Consentement image synthétique",
    },
  ],
  subject: patient,
  date: "2026-08-08T08:45:00Z",
  decision: "permit",
  controller: [
    {
      reference: "Organization/organization-synthetic-dermatology-001",
      display: "Centre de démonstration Clinical UI",
    },
  ],
  sourceAttachment: [
    {
      contentType: "application/pdf",
      url: "urn:synthetic:consent:dermatology:image:001",
      title: "Consentement synthétique signé",
      creation: "2026-08-08T08:45:00Z",
    },
  ],
  provision: [
    {
      period: { start: "2026-08-08" },
      purpose: [coding("treatment", "Suivi et traitement")],
    },
  ],
  extension: [
    { url: `${DERMATOLOGY_EXTENSION}/sensitive-site-authorized`, valueBoolean: false },
    { url: `${DERMATOLOGY_EXTENSION}/identifiable-image-authorized`, valueBoolean: false },
  ],
};

function imageDocument({
  id,
  date,
  status,
  description,
  texture,
}: {
  id: string;
  date: string;
  status: "preliminary" | "final" | "amended";
  description: string;
  texture: string;
}): DermatologyDocumentReference {
  return {
    resourceType: "DocumentReference",
    id,
    meta: syntheticMeta,
    status: "current",
    docStatus: status,
    type: {
      coding: [coding("synthetic-dermoscopy", "Dermoscopie synthétique")],
      text: "Image dermoscopique entièrement synthétique",
    },
    subject: patient,
    date,
    author: [practitioner],
    description,
    content: [
      {
        attachment: {
          contentType: "image/png",
          url: `urn:synthetic:dermoscopy:${id}`,
          title: `${description} · image synthétique`,
          creation: date,
          extension: [
            { url: `${DERMATOLOGY_EXTENSION}/synthetic-image`, valueBoolean: true },
            { url: `${DERMATOLOGY_EXTENSION}/texture-variant`, valueCode: texture },
          ],
        },
      },
    ],
    bodySite: [{ reference: lesion024 }],
    extension: [
      {
        url: `${DERMATOLOGY_EXTENSION}/image-consent`,
        valueReference: { reference: `Consent/${syntheticImageConsent.id}` },
      },
      { url: `${DERMATOLOGY_EXTENSION}/data-origin`, valueCode: "imported" },
    ],
  };
}

export const syntheticDermoscopyDocuments: DermatologyDocumentReference[] = [
  imageDocument({
    id: "document-reference-synthetic-dermatology-dermoscopy-2025",
    date: "2025-09-12T09:05:00Z",
    status: "preliminary",
    description: "Point de comparaison initial LES-024",
    texture: "copper",
  }),
  imageDocument({
    id: "document-reference-synthetic-dermatology-dermoscopy-2026",
    date: "2026-08-08T09:05:00Z",
    status: "amended",
    description: "Comparaison longitudinale LES-024",
    texture: "cyan",
  }),
];

function booleanObservation({
  id,
  code,
  display,
  value,
  interpretation,
}: {
  id: string;
  code: string;
  display: string;
  value: boolean;
  interpretation: "pass" | "warning" | "fail";
}): DermatologyObservation {
  return {
    resourceType: "Observation",
    id,
    meta: syntheticMeta,
    status: "final",
    category: [{ coding: [coding("image-quality", "Qualité d’image")] }],
    code: { coding: [coding(code, display)], text: display },
    subject: patient,
    focus: [lesion024],
    effectiveDateTime: "2026-08-08T09:05:00Z",
    performer: [practitioner],
    valueBoolean: value,
    interpretation: [
      {
        coding: [
          coding(
            interpretation,
            interpretation === "pass"
              ? "Conforme"
              : interpretation === "warning"
                ? "À vérifier"
                : "Échec",
          ),
        ],
      },
    ],
    extension: originExtension("observed"),
  };
}

export const syntheticPhotographyQuality: DermatologyObservation[] = [
  booleanObservation({
    id: "observation-synthetic-dermatology-quality-focus",
    code: "focus",
    display: "Mise au point",
    value: true,
    interpretation: "pass",
  }),
  booleanObservation({
    id: "observation-synthetic-dermatology-quality-lighting",
    code: "lighting",
    display: "Éclairage homogène",
    value: true,
    interpretation: "pass",
  }),
  booleanObservation({
    id: "observation-synthetic-dermatology-quality-scale",
    code: "scale",
    display: "Échelle visible",
    value: true,
    interpretation: "pass",
  }),
  booleanObservation({
    id: "observation-synthetic-dermatology-quality-field",
    code: "complete-field",
    display: "Champ lésionnel complet",
    value: false,
    interpretation: "fail",
  }),
  booleanObservation({
    id: "observation-synthetic-dermatology-quality-glare",
    code: "glare",
    display: "Absence de reflets",
    value: false,
    interpretation: "warning",
  }),
];

export const syntheticWoundTrajectory: DermatologyObservation[] = [
  quantityObservation({
    id: "observation-synthetic-dermatology-wound-area-j0",
    code: "wound-area",
    display: "Surface de plaie",
    value: 18,
    unit: "cm2",
    date: "2026-04-12T09:00:00Z",
  }),
  quantityObservation({
    id: "observation-synthetic-dermatology-wound-area-j14",
    code: "wound-area",
    display: "Surface de plaie",
    value: 12.5,
    unit: "cm2",
    date: "2026-04-26T09:00:00Z",
  }),
  quantityObservation({
    id: "observation-synthetic-dermatology-wound-area-j28",
    code: "wound-area",
    display: "Surface de plaie",
    value: 7.2,
    unit: "cm2",
    date: "2026-05-10T09:00:00Z",
  }),
  quantityObservation({
    id: "observation-synthetic-dermatology-wound-area-j42",
    code: "wound-area",
    display: "Surface de plaie",
    value: 4.6,
    unit: "cm2",
    date: "2026-05-24T09:00:00Z",
    origin: "derived",
    note: "Surface dérivée du tracé clinique synthétique.",
  }),
  quantityObservation({
    id: "observation-synthetic-dermatology-wound-area-projected",
    code: "wound-area",
    display: "Surface de plaie projetée",
    value: 2,
    unit: "cm2",
    date: "2026-06-21T09:00:00Z",
    origin: "projected",
    status: "preliminary",
  }),
];

export const syntheticInflammatoryScores: DermatologyObservation[] = [
  ...[
    ["pasi", "PASI", 18.4, "score", "2026-04-12T09:00:00Z"],
    ["pasi", "PASI", 7.6, "score", "2026-05-10T09:00:00Z"],
    ["pasi", "PASI", 4.5, "score", "2026-05-24T09:00:00Z"],
    ["scorad", "SCORAD", 52, "score", "2026-04-12T09:00:00Z"],
    ["scorad", "SCORAD", 18, "score", "2026-05-10T09:00:00Z"],
    ["scorad", "SCORAD", 9, "score", "2026-05-24T09:00:00Z"],
    ["dlqi", "DLQI", 19, "score", "2026-04-12T09:00:00Z"],
    ["dlqi", "DLQI", 7, "score", "2026-05-10T09:00:00Z"],
    ["dlqi", "DLQI", 4, "score", "2026-05-24T09:00:00Z"],
    ["body-surface-area", "Surface corporelle atteinte", 32, "%", "2026-04-12T09:00:00Z"],
    ["body-surface-area", "Surface corporelle atteinte", 11, "%", "2026-05-24T09:00:00Z"],
  ].map(([code, display, value, unit, date], index) =>
    quantityObservation({
      id: `observation-synthetic-dermatology-inflammatory-${String(code)}-${index}`,
      code: String(code),
      display: String(display),
      value: Number(value),
      unit: String(unit),
      date: String(date),
    }),
  ),
];

export const syntheticPhototype: DermatologyObservation = {
  resourceType: "Observation",
  id: "observation-synthetic-dermatology-phototype",
  meta: syntheticMeta,
  status: "final",
  code: {
    coding: [coding("fitzpatrick-phototype", "Phototype de Fitzpatrick")],
    text: "Phototype",
  },
  subject: patient,
  effectiveDateTime: "2026-04-12T09:00:00Z",
  performer: [practitioner],
  valueCodeableConcept: {
    coding: [coding("IV", "Phototype IV")],
    text: "IV",
  },
  extension: originExtension("observed"),
};

export const syntheticPigmentedAssessment: DermatologyObservation = {
  resourceType: "Observation",
  id: "observation-synthetic-dermatology-abcde-les-024",
  meta: syntheticMeta,
  status: "preliminary",
  category: [{ coding: [coding("pigmented-lesion-assessment", "Lésion pigmentée")] }],
  code: { coding: [coding("abcde", "Évaluation ABCDE")], text: "ABCDE" },
  subject: patient,
  focus: [lesion024],
  effectiveDateTime: "2026-08-08T09:10:00Z",
  performer: [practitioner],
  component: [
    { code: { coding: [coding("a-asymmetry", "Asymétrie")] }, valueInteger: 1 },
    { code: { coding: [coding("b-border", "Bords irréguliers")] }, valueInteger: 1 },
    { code: { coding: [coding("c-color", "Couleurs multiples")] }, valueInteger: 2 },
    {
      code: { coding: [coding("d-diameter", "Diamètre")] },
      valueQuantity: { value: 6.2, unit: "mm", system: "http://unitsofmeasure.org", code: "mm" },
    },
    {
      code: { coding: [coding("e-evolution", "Évolution")] },
      valueCodeableConcept: { coding: [coding("change-detected", "Changement détecté")] },
    },
  ],
  interpretation: [{ coding: [coding("needs-review", "Avis spécialisé prioritaire")] }],
  note: [
    {
      text: "Évaluation préliminaire synthétique : corrélation clinique requise.",
    },
  ],
  derivedFrom: syntheticDermoscopyDocuments.map((document) => ({
    reference: `DocumentReference/${document.id}`,
  })),
  extension: originExtension("derived"),
};

export const syntheticProcedures: DermatologyProcedure[] = [
  {
    resourceType: "Procedure",
    id: "procedure-synthetic-dermatology-debridement",
    meta: syntheticMeta,
    status: "completed",
    code: { coding: [coding("selective-debridement", "Débridement sélectif")] },
    subject: patient,
    occurrenceDateTime: "2026-04-12T10:20:00Z",
    performer: [{ actor: practitioner }],
    note: [{ text: "Procédure synthétique sans image clinique." }],
    extension: [{ url: `${DERMATOLOGY_EXTENSION}/report-status`, valueCode: "final" }],
  },
  {
    resourceType: "Procedure",
    id: "procedure-synthetic-dermatology-graft",
    meta: { ...syntheticMeta, versionId: "2" },
    status: "completed",
    code: { coding: [coding("split-thickness-graft", "Greffe de peau mince")] },
    subject: patient,
    occurrenceDateTime: "2026-05-10T10:20:00Z",
    performer: [{ actor: practitioner }],
    note: [{ text: "Version amendée : surface du greffon corrigée de 11 à 11,5 cm²." }],
    extension: [
      { url: `${DERMATOLOGY_EXTENSION}/report-status`, valueCode: "amended" },
      { url: `${DERMATOLOGY_EXTENSION}/amended-at`, valueDateTime: "2026-05-10T11:20:00Z" },
    ],
  },
  {
    resourceType: "Procedure",
    id: "procedure-synthetic-dermatology-dressing",
    meta: syntheticMeta,
    status: "preparation",
    code: { coding: [coding("advanced-dressing", "Pansement avancé")] },
    subject: patient,
    occurrenceDateTime: "2026-08-14T09:00:00Z",
    performer: [{ actor: practitioner }],
    extension: [{ url: `${DERMATOLOGY_EXTENSION}/report-status`, valueCode: "preliminary" }],
  },
];

export const syntheticTreatments: DermatologyMedicationRequest[] = [
  {
    resourceType: "MedicationRequest",
    id: "medication-request-synthetic-dermatology-methotrexate",
    meta: syntheticMeta,
    status: "active",
    intent: "order",
    medication: {
      concept: {
        coding: [coding("methotrexate", "Méthotrexate")],
        text: "Méthotrexate 15 mg",
      },
    },
    subject: patient,
    authoredOn: "2026-04-12T11:00:00Z",
    requester: practitioner,
    dosageInstruction: [{ text: "15 mg une fois par semaine · scénario synthétique" }],
    extension: [{ url: `${DERMATOLOGY_EXTENSION}/pregnancy-status-required`, valueBoolean: true }],
  },
  {
    resourceType: "MedicationRequest",
    id: "medication-request-synthetic-dermatology-antibiotic",
    meta: syntheticMeta,
    status: "active",
    intent: "order",
    medication: {
      concept: {
        coding: [coding("amoxicillin-clavulanate", "Amoxicilline/acide clavulanique")],
        text: "Amoxicilline/acide clavulanique",
      },
    },
    subject: patient,
    authoredOn: "2026-08-04T11:00:00Z",
    requester: practitioner,
    dosageInstruction: [{ text: "Traitement systémique, durée 8 jours · scénario synthétique" }],
  },
];

export const syntheticSafetyMonitoring: DermatologyObservation[] = [
  {
    ...quantityObservation({
      id: "observation-synthetic-dermatology-alt",
      code: "alt",
      display: "ALAT",
      value: 24,
      unit: "U/L",
      date: "2026-07-12T08:00:00Z",
      origin: "imported",
    }),
    focus: [
      { reference: "MedicationRequest/medication-request-synthetic-dermatology-methotrexate" },
    ],
    extension: [
      ...originExtension("imported"),
      { url: `${DERMATOLOGY_EXTENSION}/next-monitoring-date`, valueDate: "2026-08-16" },
    ],
  },
  {
    ...quantityObservation({
      id: "observation-synthetic-dermatology-neutrophils",
      code: "neutrophils",
      display: "Polynucléaires neutrophiles",
      value: 2.1,
      unit: "10*9/L",
      date: "2026-07-12T08:00:00Z",
      origin: "imported",
    }),
    focus: [
      { reference: "MedicationRequest/medication-request-synthetic-dermatology-methotrexate" },
    ],
    extension: [
      ...originExtension("imported"),
      { url: `${DERMATOLOGY_EXTENSION}/next-monitoring-date`, valueDate: "2026-08-09" },
    ],
  },
];

function issueFixture({
  id,
  code,
  label,
  severity,
  detail,
  action,
  category = "safety",
}: {
  id: string;
  code: string;
  label: string;
  severity: "high" | "moderate" | "low";
  detail: string;
  action: string;
  category?: string;
}): DermatologyDetectedIssue {
  return {
    resourceType: "DetectedIssue",
    id,
    meta: syntheticMeta,
    status: "final",
    category: [{ coding: [coding(category, category)] }],
    code: { coding: [coding(code, label)], text: label },
    severity,
    subject: patient,
    identifiedDateTime: SYNTHETIC_DERMATOLOGY_NOW,
    detail,
    mitigation: [
      {
        action: { coding: [coding(`${code}-action`, action)], text: action },
        date: SYNTHETIC_DERMATOLOGY_NOW,
        author: practitioner,
      },
    ],
  };
}

export const syntheticVigilanceIssues: DermatologyDetectedIssue[] = [
  issueFixture({
    id: "detected-issue-synthetic-dermatology-antimicrobial",
    code: "antimicrobial-review",
    label: "Antibiothérapie à réévaluer",
    severity: "high",
    detail: "Traitement systémique au-delà de 7 jours sans résultat microbiologique documenté.",
    action: "Réévaluer l’indication et documenter la stratégie de désescalade.",
    category: "infectious-disease",
  }),
  issueFixture({
    id: "detected-issue-synthetic-dermatology-pregnancy",
    code: "pregnancy-status-missing",
    label: "Statut de grossesse non renseigné",
    severity: "moderate",
    detail: "Information requise avant la poursuite du méthotrexate.",
    action: "Documenter le statut avant la prochaine administration.",
    category: "special-population",
  }),
  issueFixture({
    id: "detected-issue-synthetic-dermatology-phototype",
    code: "phototype-missing",
    label: "Phototype non renseigné",
    severity: "moderate",
    detail: "Le conseil de photoprotection ne peut pas être contextualisé.",
    action: "Renseigner le phototype de Fitzpatrick.",
  }),
  issueFixture({
    id: "detected-issue-synthetic-dermatology-tropical",
    code: "tropical-disease-exposure",
    label: "Exposition tropicale à documenter",
    severity: "low",
    detail: "Séjour récent en zone d’endémie signalé dans l’anamnèse synthétique.",
    action: "Compléter le trajet, les dates et les expositions eau/sol/vecteurs.",
    category: "neglected-tropical-disease",
  }),
];

export const syntheticDermatologyResources: DermatologyResource[] = [
  ...syntheticLesions,
  ...syntheticLesionMeasurements,
  syntheticImageConsent,
  ...syntheticDermoscopyDocuments,
  ...syntheticPhotographyQuality,
  ...syntheticWoundTrajectory,
  ...syntheticInflammatoryScores,
  syntheticPhototype,
  syntheticPigmentedAssessment,
  ...syntheticProcedures,
  ...syntheticTreatments,
  ...syntheticSafetyMonitoring,
  ...syntheticVigilanceIssues,
];
