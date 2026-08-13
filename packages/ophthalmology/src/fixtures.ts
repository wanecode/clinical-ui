import type {
  AcuityReading,
  BilateralAlert,
  CataractPlan,
  CorneaData,
  GlaucomaProgressionData,
  OcularEmergencyData,
  OphthalmologyBundleR5,
  OphthalmologyImagingStudyR5,
  OphthalmologyObservationR5,
  OphthalmologyResourceMeta,
  OphthalmologyServiceRequestR5,
  OrthopticsData,
  RefractionReading,
  RetinaCareEvent,
  RetinaImage,
} from "./types";

export const OPHTHALMOLOGY_SYNTHETIC_TAG_SYSTEM =
  "https://clinical-ui.dev/fhir/CodeSystem/fixture-kind";
export const OPHTHALMOLOGY_SYNTHETIC_NOW = "2026-08-12T10:15:00Z";

const syntheticMeta: OphthalmologyResourceMeta = {
  versionId: "3",
  lastUpdated: OPHTHALMOLOGY_SYNTHETIC_NOW,
  tag: [
    {
      system: OPHTHALMOLOGY_SYNTHETIC_TAG_SYSTEM,
      code: "synthetic",
      display: "Donnée ophtalmologique synthétique",
    },
  ],
};

const subject = {
  reference: "Patient/patient-synthetic-oph-001",
  display: "Awa Ndiaye — identité synthétique",
};

const eyeBodySite = (
  eye: "OD" | "OG",
): {
  coding: [{ system: string; code: string; display: string }];
  text: string;
} => ({
  coding: [
    {
      system: "http://snomed.info/sct",
      code: eye === "OD" ? "18944008" : "8966001",
      display: eye === "OD" ? "Structure of right eye" : "Structure of left eye",
    },
  ],
  text: eye === "OD" ? "Œil droit (OD)" : "Œil gauche (OG)",
});

export const syntheticIopObservations = [
  ["2025-02-12", "OD", 19],
  ["2025-02-12", "OG", 17],
  ["2025-08-12", "OD", 18],
  ["2025-08-12", "OG", 16],
  ["2026-02-12", "OD", 17],
  ["2026-02-12", "OG", 15],
  ["2026-08-12", "OD", 16],
  ["2026-08-12", "OG", 14],
].map(
  ([date, eye, value], index) =>
    ({
      resourceType: "Observation",
      id: `iop-synthetic-${index + 1}`,
      meta: syntheticMeta,
      status: "final",
      category: [
        {
          coding: [
            {
              system: "http://terminology.hl7.org/CodeSystem/observation-category",
              code: "exam",
              display: "Exam",
            },
          ],
        },
      ],
      code: {
        coding: [
          {
            system: "http://loinc.org",
            code: "79892-4",
            display: "Intraocular pressure by tonometry",
          },
        ],
        text: "Pression intraoculaire",
      },
      subject,
      effectiveDateTime: `${date}T10:15:00Z`,
      bodySite: eyeBodySite(eye as "OD" | "OG"),
      valueQuantity: {
        value: value as number,
        unit: "mm[Hg]",
        system: "http://unitsofmeasure.org",
        code: "mm[Hg]",
      },
      note: [{ text: "Mesure entièrement synthétique — tonométrie d'aplanation simulée." }],
    }) satisfies OphthalmologyObservationR5,
);

export const syntheticVisualAcuityObservation = {
  resourceType: "Observation",
  id: "visual-acuity-synthetic-od",
  meta: syntheticMeta,
  status: "amended",
  code: {
    coding: [
      {
        system: "http://loinc.org",
        code: "79893-2",
        display: "Visual acuity distance corrected right eye",
      },
    ],
    text: "Acuité visuelle de loin avec correction — OD",
  },
  subject,
  effectiveDateTime: OPHTHALMOLOGY_SYNTHETIC_NOW,
  bodySite: eyeBodySite("OD"),
  valueQuantity: {
    value: 0.8,
    unit: "decimal visual acuity",
    system: "http://unitsofmeasure.org",
    code: "1",
  },
  note: [{ text: "Valeur corrigée de 0,7 à 0,8 — fixture synthétique." }],
} satisfies OphthalmologyObservationR5;

export const syntheticOctImagingStudy = {
  resourceType: "ImagingStudy",
  id: "oct-synthetic-2026-08-12",
  meta: syntheticMeta,
  status: "available",
  modality: [
    {
      system: "http://dicom.nema.org/resources/ontology/DCM",
      code: "OPT",
      display: "Ophthalmic Tomography",
    },
  ],
  subject,
  started: OPHTHALMOLOGY_SYNTHETIC_NOW,
  numberOfSeries: 2,
  numberOfInstances: 2,
  description: "OCT maculaire bilatéral entièrement synthétique",
  series: ["OD", "OG"].map((eye, index) => ({
    uid: `2.25.202608120000${index + 1}`,
    number: index + 1,
    modality: {
      system: "http://dicom.nema.org/resources/ontology/DCM",
      code: "OPT",
      display: "Ophthalmic Tomography",
    },
    description: `Macula ${eye} — synthétique`,
    bodySite: eyeBodySite(eye as "OD" | "OG").coding[0],
    numberOfInstances: 1,
    instance: [
      {
        uid: `2.25.202608120100${index + 1}`,
        sopClass: { system: "urn:ietf:rfc:3986", code: "urn:oid:1.2.840.10008.5.1.4.1.1.7" },
        number: 1,
        title: `B-scan maculaire ${eye} synthétique`,
      },
    ],
  })),
} satisfies OphthalmologyImagingStudyR5;

export const syntheticEmergencyRequest = {
  resourceType: "ServiceRequest",
  id: "urgent-ophthalmology-review-synthetic",
  meta: syntheticMeta,
  status: "active",
  intent: "order",
  priority: "stat",
  code: {
    concept: {
      text: "Avis ophtalmologique urgent",
      coding: [
        {
          system: "http://snomed.info/sct",
          code: "185349003",
          display: "Encounter for check up",
        },
      ],
    },
  },
  subject,
  authoredOn: OPHTHALMOLOGY_SYNTHETIC_NOW,
  reason: [{ concept: { text: "Baisse visuelle brutale et douleur — scénario synthétique" } }],
  note: [
    { text: "Fixture de démonstration. Ne constitue pas une recommandation clinique réelle." },
  ],
} satisfies OphthalmologyServiceRequestR5;

export const syntheticOphthalmologyBundle = {
  resourceType: "Bundle",
  id: "ophthalmology-synthetic-r5",
  meta: syntheticMeta,
  type: "collection",
  timestamp: OPHTHALMOLOGY_SYNTHETIC_NOW,
  entry: [
    ...syntheticIopObservations.map((resource) => ({
      fullUrl: `https://example.invalid/fhir/Observation/${resource.id}`,
      resource,
    })),
    {
      fullUrl: `https://example.invalid/fhir/Observation/${syntheticVisualAcuityObservation.id}`,
      resource: syntheticVisualAcuityObservation,
    },
    {
      fullUrl: `https://example.invalid/fhir/ImagingStudy/${syntheticOctImagingStudy.id}`,
      resource: syntheticOctImagingStudy,
    },
    {
      fullUrl: `https://example.invalid/fhir/ServiceRequest/${syntheticEmergencyRequest.id}`,
      resource: syntheticEmergencyRequest,
    },
  ],
} satisfies OphthalmologyBundleR5;

export const syntheticBilateralEyes = {
  OD: {
    eye: "OD",
    visualAcuity: "8/10",
    iop: 16,
    pachymetry: 542,
    pupil: "3,0 → 2,0 mm · vive",
    anteriorSegment: "Cornée claire · chambre profonde",
    gonioscopy: "Shaffer 3–4 · 360°",
    fundus: "Papille C/D 0,6 · macula plane",
    source: "Observation/iop-synthetic-7",
    sourceContext: "Tonométrie synthétique · 2026-08-12 · dispositif SYN-042",
    status: "validated",
  },
  OG: {
    eye: "OG",
    visualAcuity: "10/10",
    iop: 14,
    pachymetry: 576,
    pupil: "3,5 → 2,5 mm · vive",
    anteriorSegment: "Cornée claire · chambre profonde",
    gonioscopy: "Shaffer 3–4 · 360°",
    fundus: "Papille C/D 0,4 · macula plane",
    source: "Observation/iop-synthetic-8",
    sourceContext: "Tonométrie synthétique · 2026-08-12 · dispositif SYN-042",
    status: "validated",
  },
} as const;

export const syntheticBilateralAlerts: BilateralAlert[] = [
  {
    id: "cct-asymmetry",
    severity: "warning",
    label: "Asymétrie pachymétrique",
    detail: "Écart OD/OG de 34 µm ; interpréter la PIO avec la cornée centrale.",
  },
];

export const syntheticAcuityReadings = [
  {
    eye: "OD",
    distanceUncorrected: 0.1,
    distanceCorrected: 0.8,
    pinhole: 0.7,
    near: "Parinaud 3",
    scale: "decimal",
    status: "amended",
    note: "Valeur corrigée après relecture.",
  },
  {
    eye: "OG",
    distanceUncorrected: 0.16,
    distanceCorrected: 1,
    pinhole: 1,
    near: "Parinaud 2",
    scale: "decimal",
    status: "validated",
  },
] satisfies [AcuityReading, AcuityReading];

export const syntheticRefractions = [
  {
    eye: "OD",
    sphere: -5.5,
    cylinder: -1.25,
    axis: 10,
    addition: 1,
    vertexDistance: 12,
    status: "validated",
  },
  {
    eye: "OG",
    sphere: -5,
    cylinder: -1,
    axis: 170,
    addition: 1,
    vertexDistance: 12,
    status: "validated",
  },
] satisfies [RefractionReading, RefractionReading];

const trajectory = (
  prefix: string,
  eye: "OD" | "OG",
  values: number[],
  projected: number[],
  source: string,
) => [
  ...values.map((value, index) => ({
    id: `${prefix}-${eye}-observed-${index}`,
    date: `${2022 + index}-08-12`,
    value,
    eye,
    kind: (index === 1 ? "imported" : "observed") as "observed" | "imported",
    source,
    status: "validated" as const,
  })),
  ...projected.map((value, index) => ({
    id: `${prefix}-${eye}-projected-${index}`,
    date: `${2026 + index}-08-12`,
    value,
    eye,
    kind: "projected" as const,
    source: "Régression linéaire locale — non observée",
    status: "preliminary" as const,
  })),
];

export const syntheticGlaucomaData: GlaucomaProgressionData = {
  iop: [
    ...trajectory("iop", "OD", [21, 19, 18, 16], [15, 15], "Tonométrie Goldmann synthétique"),
    ...trajectory("iop", "OG", [18, 17, 16, 14], [14, 13], "Tonométrie Goldmann synthétique"),
  ],
  rnfl: [
    ...trajectory("rnfl", "OD", [79, 76, 72, 68], [64, 61], "OCT RNFL synthétique"),
    ...trajectory("rnfl", "OG", [84, 82, 79, 77], [75, 72], "OCT RNFL synthétique"),
  ],
  targetIop: 16,
  visualField: [
    { date: "2024-08-12", eye: "OD", md: -3.2, psd: 3.48, vfi: 95 },
    { date: "2025-08-12", eye: "OD", md: -3.8, psd: 4.12, vfi: 93 },
    { date: "2026-08-12", eye: "OD", md: -4.32, psd: 4.67, vfi: 92 },
    { date: "2026-08-12", eye: "OG", md: -1.8, psd: 2.1, vfi: 97 },
  ],
};

export const syntheticRetinaImages: RetinaImage[] = [
  {
    id: "oct-2026-od",
    date: "2026-08-12",
    eye: "OD",
    modality: "OCT",
    quality: "good",
    qualityLabel: "Signal 8/10",
    source: "ImagingStudy/oct-synthetic-2026-08-12",
    cst: 278,
    note: "Coupe maculaire synthétique.",
  },
  {
    id: "oct-2026-og",
    date: "2026-08-12",
    eye: "OG",
    modality: "OCT",
    quality: "insufficient",
    qualityLabel: "Signal 4/10 · segmentation à vérifier",
    source: "ImagingStudy/oct-synthetic-2026-08-12",
    cst: 264,
    note: "Artéfact de mouvement synthétique.",
  },
  {
    id: "oct-2025-od",
    date: "2025-08-12",
    eye: "OD",
    modality: "OCT",
    quality: "good",
    qualityLabel: "Signal 7/10",
    source: "ImagingStudy/oct-synthetic-2025-08-12",
    cst: 286,
  },
  {
    id: "fundus-2025-og",
    date: "2025-08-12",
    eye: "OG",
    modality: "Fundus",
    quality: "unavailable",
    qualityLabel: "Image indisponible",
    source: "DocumentReference/fundus-synthetic-unavailable",
  },
];

export const syntheticRetinaCareEvents: RetinaCareEvent[] = [
  {
    id: "amsler-2025",
    date: "2025-08-12",
    kind: "amsler",
    label: "Amsler · métamorphopsies stables OD",
    status: "validated",
  },
  {
    id: "injection-1",
    date: "2025-11-04",
    kind: "injection",
    label: "Injection intravitréenne synthétique 1/3",
    status: "validated",
  },
  {
    id: "injection-2",
    date: "2025-12-02",
    kind: "injection",
    label: "Injection intravitréenne synthétique 2/3",
    status: "validated",
  },
  {
    id: "injection-3",
    date: "2026-01-06",
    kind: "injection",
    label: "Injection intravitréenne synthétique 3/3",
    status: "validated",
  },
  {
    id: "visit-2026",
    date: "2026-08-12",
    kind: "visit",
    label: "Revue retina · décision préliminaire",
    status: "preliminary",
  },
];

export const syntheticCorneaData: CorneaData = {
  eye: "OD",
  k1: 42.1,
  k2: 44.8,
  axis: 92,
  thinnest: 498,
  dryEyeScore: 28,
  lensStatus: "Lentille rigide · essai 3 · tolérance partielle",
  trajectory: trajectory("thinnest", "OD", [512, 507, 502, 498], [], "Topographie synthétique"),
  map: [
    { zone: "Supérieur", value: 43.1, interpretation: "Stable" },
    { zone: "Temporal", value: 44.2, interpretation: "À surveiller" },
    { zone: "Central", value: 44.8, interpretation: "Plus cambré" },
    { zone: "Nasal", value: 42.7, interpretation: "Stable" },
    { zone: "Inférieur", value: 45.4, interpretation: "Asymétrique" },
  ],
};

export const syntheticCataractPlan: CataractPlan = {
  eye: "OG",
  axialLength: 23.84,
  anteriorChamberDepth: 3.12,
  keratometry: 43.72,
  targetRefraction: -0.25,
  selectedIol: "Monofocale asphérique — modèle synthétique A",
  plannedPower: 21.5,
  procedureStatus: "preliminary",
  documents: [
    { label: "Consentement", status: "signed" },
    { label: "Biométrie", status: "complete" },
    { label: "Calcul d'implant", status: "complete" },
    { label: "Compte rendu opératoire", status: "missing" },
  ],
  audit: [
    { label: "Réfraction cible", target: "−0,25 D", observed: "En attente" },
    { label: "AV sans correction", target: "≥ 8/10" },
  ],
};

export const syntheticOrthopticsData: OrthopticsData = {
  cooperation: "variable",
  coverDistance: "XT 4Δ intermittent",
  coverNear: "X' 6Δ",
  stereopsis: "80 secondes d'arc",
  amblyopiaRisk: "OG · surveillance rapprochée",
  cells: Array.from({ length: 9 }, (_, index) => {
    const row = Math.floor(index / 3);
    const column = index % 3;
    const gazeRows = ["Haut", "Primaire", "Bas"];
    const gazeColumns = ["Gauche", "Centre", "Droite"];
    const limited = index === 2 || index === 5;
    return {
      id: `motility-${row}-${column}`,
      row,
      column,
      gaze: `${gazeRows[row]} · ${gazeColumns[column]}`,
      value: limited ? "−1 abduction" : "0 libre",
      finding: limited ? "limited" : "normal",
    };
  }),
};

export const syntheticEmergencyData: OcularEmergencyData = {
  onset: "Il y a 45 minutes",
  painScore: 8,
  affectedEye: "OD",
  mechanism: "Fragment métallique lors du meulage — scénario synthétique",
  findings: [
    { id: "vision-loss", label: "Baisse visuelle brutale", present: true, severity: "critical" },
    {
      id: "open-globe",
      label: "Plaie transfixiante suspectée",
      present: true,
      severity: "critical",
    },
    { id: "rapd", label: "Déficit pupillaire afférent", present: false, severity: "urgent" },
    { id: "chemical", label: "Exposition chimique", present: false, severity: "critical" },
    { id: "photophobia", label: "Photophobie", present: true, severity: "urgent" },
  ],
  disposition: "Protection sans compression · avis ophtalmologique immédiat",
  lowVisionReferral: "À réévaluer après prise en charge de la phase aiguë",
  fitnessStatement: "Aptitude à la conduite non évaluée en phase aiguë",
};

export function isSyntheticOphthalmologyResource(
  resource: OphthalmologyBundleR5["entry"][number]["resource"] | OphthalmologyBundleR5,
) {
  return (
    resource.meta.tag?.some(
      (tag) => tag.system === OPHTHALMOLOGY_SYNTHETIC_TAG_SYSTEM && tag.code === "synthetic",
    ) ?? false
  );
}
