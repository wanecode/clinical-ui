import type { Coding, FhirMeta, FhirResource, Reference } from "@clinical-ui/fhir";
import type {
  DentalDocumentVersion,
  DentalImagingItem,
  DentalPrescription,
  EndodonticCanal,
  FhirBundle,
  PeriodontalSite,
  SafetyItem,
  TimelineEvent,
  ToothRecord,
  TreatmentPhase,
} from "./types";

export const ODONTOLOGY_SYNTHETIC_NOW = "2026-08-12T10:15:00Z";
export const ODONTOLOGY_SYNTHETIC_TAG_SYSTEM =
  "https://clinical-ui.dev/fhir/CodeSystem/fixture-kind";
export const FDI_TOOTH_SYSTEM = "http://fdiworlddental.org/fhir/CodeSystem/iso-3950";
export const DENTAL_SURFACE_EXTENSION =
  "http://hl7.org/fhir/StructureDefinition/bodySite-reference";

const syntheticMeta: FhirMeta = {
  lastUpdated: ODONTOLOGY_SYNTHETIC_NOW,
  tag: [
    {
      system: ODONTOLOGY_SYNTHETIC_TAG_SYSTEM,
      code: "synthetic",
      display: "Donnée odontologique synthétique",
    },
  ],
};

interface FhirExtension {
  url: string;
  valueCode?: string;
  valueString?: string;
  valueBoolean?: boolean;
}

interface FhirCondition extends FhirResource {
  resourceType: "Condition";
  clinicalStatus: { coding: Coding[] };
  verificationStatus: { coding: Coding[] };
  category: { coding: Coding[] }[];
  code: { coding: Coding[]; text: string };
  subject: Reference;
  bodySite: { coding: Coding[]; text: string }[];
  recordedDate: string;
  extension?: FhirExtension[];
}

interface FhirObservation extends FhirResource {
  resourceType: "Observation";
  status: "preliminary" | "final";
  category: { coding: Coding[] }[];
  code: { coding: Coding[]; text: string };
  subject: Reference;
  effectiveDateTime: string;
  bodySite?: { coding: Coding[]; text: string };
  component?: Array<{
    code: { coding?: Coding[]; text: string };
    valueQuantity?: { value: number; unit: string; system: string; code: string };
    valueBoolean?: boolean;
  }>;
}

interface FhirCarePlan extends FhirResource {
  resourceType: "CarePlan";
  status: "active";
  intent: "plan";
  title: string;
  subject: Reference;
  period: { start: string };
  activity: Array<{
    plannedActivityReference: Reference;
  }>;
}

interface FhirTask extends FhirResource {
  resourceType: "Task";
  status: "requested" | "in-progress" | "completed" | "cancelled";
  intent: "order";
  code: { text: string };
  for: Reference;
  focus?: Reference;
  executionPeriod?: { start?: string; end?: string };
  basedOn?: Reference[];
  note?: Array<{ text: string }>;
}

interface FhirImagingStudy extends FhirResource {
  resourceType: "ImagingStudy";
  status: "available";
  subject: Reference;
  started: string;
  numberOfSeries: number;
  numberOfInstances: number;
  description: string;
  series: Array<{
    uid: string;
    number: number;
    modality: Coding;
    description: string;
    numberOfInstances: number;
  }>;
}

interface FhirConsent extends FhirResource {
  resourceType: "Consent";
  status: "active" | "draft";
  category: { coding: Coding[] }[];
  subject: Reference;
  date: string;
  decision: "permit" | "deny";
}

interface FhirDocumentReference extends FhirResource {
  resourceType: "DocumentReference";
  status: "current" | "superseded" | "entered-in-error";
  version?: string;
  subject: Reference;
  date: string;
  author: Reference[];
  description: string;
  content: Array<{
    attachment: { contentType: string; title: string; creation: string };
  }>;
  relatesTo?: Array<{ code: "replaces"; target: Reference }>;
}

interface FhirMedicationRequest extends FhirResource {
  resourceType: "MedicationRequest";
  status: "active" | "draft";
  intent: "order";
  medication: {
    concept: { coding: Coding[]; text: string };
  };
  subject: Reference;
  authoredOn: string;
  requester: Reference;
  reason: Array<{ concept: { text: string } }>;
  dosageInstruction: Array<{
    text: string;
    timing: { repeat: { frequency: number; period: number; periodUnit: "d" } };
    route: { coding: Coding[]; text: string };
    doseAndRate: Array<{
      doseQuantity: { value: number; unit: string; system: string; code: string };
    }>;
    maxDosePerPeriod: {
      numerator: { value: number; unit: string; system: string; code: string };
      denominator: { value: number; unit: string; system: string; code: string };
    };
  }>;
}

const patientReference = {
  reference: "Patient/patient-synthetic-odontology-001",
  display: "Awa Sarr — patiente synthétique",
};

const conditionResources: FhirCondition[] = [
  {
    resourceType: "Condition",
    id: "condition-synthetic-caries-16",
    meta: syntheticMeta,
    clinicalStatus: {
      coding: [
        { system: "http://terminology.hl7.org/CodeSystem/condition-clinical", code: "active" },
      ],
    },
    verificationStatus: {
      coding: [
        { system: "http://terminology.hl7.org/CodeSystem/condition-ver-status", code: "confirmed" },
      ],
    },
    category: [{ coding: [{ system: "http://snomed.info/sct", code: "439401001" }] }],
    code: {
      coding: [{ system: "http://snomed.info/sct", code: "80967001", display: "Dental caries" }],
      text: "Lésion carieuse occlusale",
    },
    subject: patientReference,
    bodySite: [{ coding: [{ system: FDI_TOOTH_SYSTEM, code: "16" }], text: "Dent 16" }],
    recordedDate: "2026-08-12",
    extension: [{ url: DENTAL_SURFACE_EXTENSION, valueCode: "occlusal" }],
  },
  {
    resourceType: "Condition",
    id: "condition-synthetic-filled-26",
    meta: syntheticMeta,
    clinicalStatus: {
      coding: [
        { system: "http://terminology.hl7.org/CodeSystem/condition-clinical", code: "inactive" },
      ],
    },
    verificationStatus: {
      coding: [
        { system: "http://terminology.hl7.org/CodeSystem/condition-ver-status", code: "confirmed" },
      ],
    },
    category: [{ coding: [{ system: "http://snomed.info/sct", code: "439401001" }] }],
    code: {
      coding: [{ system: "http://snomed.info/sct", code: "27855007", display: "Dental filling" }],
      text: "Obturation composite",
    },
    subject: patientReference,
    bodySite: [{ coding: [{ system: FDI_TOOTH_SYSTEM, code: "26" }], text: "Dent 26" }],
    recordedDate: "2024-11-14",
    extension: [{ url: DENTAL_SURFACE_EXTENSION, valueCode: "occlusal" }],
  },
];

const periodontalObservation: FhirObservation = {
  resourceType: "Observation",
  id: "observation-synthetic-periodontal-16-mb",
  meta: syntheticMeta,
  status: "final",
  category: [
    {
      coding: [
        { system: "http://terminology.hl7.org/CodeSystem/observation-category", code: "exam" },
      ],
    },
  ],
  code: {
    coding: [{ system: "http://loinc.org", code: "81228-8", display: "Periodontal assessment" }],
    text: "Sondage parodontal à six sites",
  },
  subject: patientReference,
  effectiveDateTime: ODONTOLOGY_SYNTHETIC_NOW,
  bodySite: { coding: [{ system: FDI_TOOTH_SYSTEM, code: "16" }], text: "Dent 16 · MB" },
  component: [
    {
      code: { text: "Profondeur de poche MB" },
      valueQuantity: {
        value: 5,
        unit: "mm",
        system: "http://unitsofmeasure.org",
        code: "mm",
      },
    },
    { code: { text: "Saignement au sondage MB" }, valueBoolean: true },
    { code: { text: "Plaque visible MB" }, valueBoolean: true },
  ],
};

const carePlanResource: FhirCarePlan = {
  resourceType: "CarePlan",
  id: "careplan-synthetic-odontology-001",
  meta: syntheticMeta,
  status: "active",
  intent: "plan",
  title: "Plan de traitement bucco-dentaire synthétique",
  subject: patientReference,
  period: { start: "2026-08-12" },
  activity: [
    { plannedActivityReference: { reference: "Task/task-synthetic-assainissement-001" } },
    { plannedActivityReference: { reference: "Task/task-synthetic-restauration-16" } },
    { plannedActivityReference: { reference: "Task/task-synthetic-implant-36" } },
  ],
};

const taskResources: FhirTask[] = [
  {
    resourceType: "Task",
    id: "task-synthetic-assainissement-001",
    meta: syntheticMeta,
    status: "completed",
    intent: "order",
    code: { text: "Détartrage et enseignement d'hygiène" },
    for: patientReference,
    focus: { reference: "CarePlan/careplan-synthetic-odontology-001" },
    executionPeriod: { start: "2026-08-12", end: "2026-08-12" },
  },
  {
    resourceType: "Task",
    id: "task-synthetic-restauration-16",
    meta: syntheticMeta,
    status: "requested",
    intent: "order",
    code: { text: "Restauration composite de la dent 16" },
    for: patientReference,
    focus: { reference: "Condition/condition-synthetic-caries-16" },
    basedOn: [{ reference: "Task/task-synthetic-assainissement-001" }],
    executionPeriod: { start: "2026-08-26" },
  },
  {
    resourceType: "Task",
    id: "task-synthetic-implant-36",
    meta: syntheticMeta,
    status: "cancelled",
    intent: "order",
    code: { text: "Pose implantaire 36" },
    for: patientReference,
    basedOn: [{ reference: "Task/task-synthetic-restauration-16" }],
    executionPeriod: { start: "2026-10-15" },
    note: [{ text: "Annulé : consentement à renouveler" }],
  },
];

const imagingResource: FhirImagingStudy = {
  resourceType: "ImagingStudy",
  id: "imagingstudy-synthetic-panoramic-001",
  meta: syntheticMeta,
  status: "available",
  subject: patientReference,
  started: "2026-08-10T09:40:00Z",
  numberOfSeries: 1,
  numberOfInstances: 1,
  description: "Panoramique dentaire entièrement synthétique",
  series: [
    {
      uid: "1.2.826.0.1.3680043.10.543.synthetic.1",
      number: 1,
      modality: { system: "http://dicom.nema.org/resources/ontology/DCM", code: "PX" },
      description: "Arcades maxillaire et mandibulaire — synthétique",
      numberOfInstances: 1,
    },
  ],
};

const consentResource: FhirConsent = {
  resourceType: "Consent",
  id: "consent-synthetic-extraction-36",
  meta: syntheticMeta,
  status: "draft",
  category: [
    {
      coding: [
        {
          system: "http://terminology.hl7.org/CodeSystem/consentcategorycodes",
          code: "treatment",
        },
      ],
    },
  ],
  subject: patientReference,
  date: "2026-08-12",
  decision: "deny",
};

const documentResources: FhirDocumentReference[] = [
  {
    resourceType: "DocumentReference",
    id: "documentreference-synthetic-treatment-v1",
    meta: { ...syntheticMeta, versionId: "1" },
    status: "superseded",
    version: "1",
    subject: patientReference,
    date: "2026-08-12T10:02:00Z",
    author: [
      { reference: "Practitioner/practitioner-synthetic-odontology-001", display: "Dr L. Ndiaye" },
    ],
    description: "Plan initial — document synthétique",
    content: [
      {
        attachment: {
          contentType: "application/pdf",
          title: "Plan de traitement synthétique v1",
          creation: "2026-08-12T10:02:00Z",
        },
      },
    ],
  },
  {
    resourceType: "DocumentReference",
    id: "documentreference-synthetic-treatment-v2",
    meta: { ...syntheticMeta, versionId: "2" },
    status: "current",
    version: "2",
    subject: patientReference,
    date: "2026-08-12T10:14:00Z",
    author: [
      { reference: "Practitioner/practitioner-synthetic-odontology-001", display: "Dr L. Ndiaye" },
    ],
    description: "Plan validé et signé — document synthétique",
    content: [
      {
        attachment: {
          contentType: "application/pdf",
          title: "Plan de traitement synthétique v2",
          creation: "2026-08-12T10:14:00Z",
        },
      },
    ],
    relatesTo: [
      {
        code: "replaces",
        target: { reference: "DocumentReference/documentreference-synthetic-treatment-v1" },
      },
    ],
  },
];

const medicationRequestResource: FhirMedicationRequest = {
  resourceType: "MedicationRequest",
  id: "medicationrequest-synthetic-amoxicillin-001",
  meta: syntheticMeta,
  status: "draft",
  intent: "order",
  medication: {
    concept: {
      coding: [
        {
          system: "http://www.whocc.no/atc",
          code: "J01CA04",
          display: "Amoxicillin",
        },
      ],
      text: "Amoxicilline 500 mg — prescription synthétique",
    },
  },
  subject: patientReference,
  authoredOn: "2026-08-12",
  requester: {
    reference: "Practitioner/practitioner-synthetic-odontology-001",
    display: "Dr L. Ndiaye",
  },
  reason: [{ concept: { text: "Infection odontogène synthétique" } }],
  dosageInstruction: [
    {
      text: "500 mg par voie orale, trois fois par jour pendant cinq jours",
      timing: { repeat: { frequency: 3, period: 1, periodUnit: "d" } },
      route: {
        coding: [{ system: "http://snomed.info/sct", code: "26643006", display: "Oral route" }],
        text: "Voie orale",
      },
      doseAndRate: [
        {
          doseQuantity: {
            value: 500,
            unit: "mg",
            system: "http://unitsofmeasure.org",
            code: "mg",
          },
        },
      ],
      maxDosePerPeriod: {
        numerator: {
          value: 1500,
          unit: "mg",
          system: "http://unitsofmeasure.org",
          code: "mg",
        },
        denominator: {
          value: 1,
          unit: "jour",
          system: "http://unitsofmeasure.org",
          code: "d",
        },
      },
    },
  ],
};

export const syntheticOdontologyFhirBundle: FhirBundle = {
  resourceType: "Bundle",
  id: "bundle-synthetic-odontology-001",
  meta: syntheticMeta,
  type: "collection",
  timestamp: ODONTOLOGY_SYNTHETIC_NOW,
  entry: [
    ...conditionResources,
    periodontalObservation,
    carePlanResource,
    ...taskResources,
    imagingResource,
    consentResource,
    ...documentResources,
    medicationRequestResource,
  ].map((resource) => ({
    fullUrl: `https://example.invalid/fhir/${resource.resourceType}/${resource.id}`,
    resource,
  })),
};

const permanentFdi = [
  "18",
  "17",
  "16",
  "15",
  "14",
  "13",
  "12",
  "11",
  "21",
  "22",
  "23",
  "24",
  "25",
  "26",
  "27",
  "28",
  "48",
  "47",
  "46",
  "45",
  "44",
  "43",
  "42",
  "41",
  "31",
  "32",
  "33",
  "34",
  "35",
  "36",
  "37",
  "38",
];

export const syntheticTeeth: ToothRecord[] = permanentFdi.map((fdi) => {
  const status =
    fdi === "16" ? "caries" : fdi === "26" ? "filled" : fdi === "36" ? "implant" : "sound";
  return {
    fdi,
    label: `Dent permanente ${fdi}`,
    dentition: "permanent",
    arch: Number(fdi[0]) <= 2 ? "maxillary" : "mandibular",
    status,
    ...(fdi === "16" ? { surfaces: { occlusal: "caries" as const } } : {}),
    history:
      fdi === "16"
        ? [
            {
              id: "history-synthetic-16-001",
              date: "2026-08-12",
              label: "Lésion carieuse occlusale",
              detail: "Observation validée",
              evidence: "validated",
              resourceRef: "Condition/condition-synthetic-caries-16",
            },
            {
              id: "history-synthetic-16-002",
              date: "2026-08-10",
              label: "Bitewing importée",
              evidence: "imported",
              resourceRef: "ImagingStudy/imagingstudy-synthetic-panoramic-001",
            },
          ]
        : [],
    evidence: fdi === "26" ? "imported" : "observed",
    resourceRef:
      fdi === "16"
        ? "Condition/condition-synthetic-caries-16"
        : fdi === "26"
          ? "Condition/condition-synthetic-filled-26"
          : `Observation/observation-synthetic-tooth-${fdi}`,
  };
});

export const syntheticPrimaryTeeth: ToothRecord[] = [
  "55",
  "54",
  "53",
  "52",
  "51",
  "61",
  "62",
  "63",
  "64",
  "65",
  "85",
  "84",
  "83",
  "82",
  "81",
  "71",
  "72",
  "73",
  "74",
  "75",
].map((fdi) => ({
  fdi,
  label: `Dent temporaire ${fdi}`,
  dentition: "primary",
  arch: Number(fdi[0]) <= 6 ? "maxillary" : "mandibular",
  status: fdi === "64" ? "filled" : "sound",
  evidence: "observed",
  resourceRef: `Observation/observation-synthetic-primary-tooth-${fdi}`,
}));

const perioTeeth = ["17", "16", "11", "21", "26", "27"];
const perioSites: PeriodontalSite["site"][] = ["MB", "B", "DB", "ML", "L", "DL"];

export const syntheticPeriodontalSites: PeriodontalSite[] = perioTeeth.flatMap(
  (tooth, toothIndex) =>
    perioSites.map((site, siteIndex) => ({
      id: `periodontal-synthetic-${tooth}-${site.toLowerCase()}`,
      tooth,
      site,
      pocketDepth:
        tooth === "16" && siteIndex < 3 ? 5 - (siteIndex % 2) : 2 + ((toothIndex + siteIndex) % 2),
      recession: (toothIndex + siteIndex) % 4 === 0 ? 1 : 0,
      bleeding: (toothIndex + siteIndex) % 5 === 0,
      plaque: (toothIndex + siteIndex) % 4 === 0,
      evidence: siteIndex === 5 ? "preliminary" : "observed",
    })),
);

export const syntheticTreatmentPhases: TreatmentPhase[] = [
  {
    id: "phase-synthetic-1",
    number: 1,
    title: "Assainissement",
    objective: "Réduire l'inflammation et stabiliser le risque carieux.",
    sessions: [
      {
        id: "task-synthetic-assainissement-001",
        title: "Détartrage et hygiène",
        date: "2026-08-12",
        status: "completed",
        evidence: "validated",
        resourceRef: "Task/task-synthetic-assainissement-001",
      },
      {
        id: "task-synthetic-periodontal-review",
        title: "Réévaluation parodontale",
        date: "2026-08-20",
        status: "postponed",
        dependsOn: ["task-synthetic-assainissement-001"],
        evidence: "projected",
        resourceRef: "Task/task-synthetic-periodontal-review",
      },
    ],
  },
  {
    id: "phase-synthetic-2",
    number: 2,
    title: "Conservation",
    objective: "Restaurer la dent 16 après stabilisation parodontale.",
    sessions: [
      {
        id: "task-synthetic-restauration-16",
        title: "Restauration composite",
        tooth: "16",
        date: "2026-08-26",
        status: "planned",
        dependsOn: ["task-synthetic-periodontal-review"],
        evidence: "projected",
        resourceRef: "Task/task-synthetic-restauration-16",
      },
    ],
  },
  {
    id: "phase-synthetic-3",
    number: 3,
    title: "Réhabilitation",
    objective: "Réhabiliter le secteur mandibulaire postérieur.",
    sessions: [
      {
        id: "task-synthetic-implant-36",
        title: "Pose implantaire",
        tooth: "36",
        date: "2026-10-15",
        status: "cancelled",
        dependsOn: ["task-synthetic-restauration-16"],
        evidence: "preliminary",
        resourceRef: "Task/task-synthetic-implant-36",
      },
    ],
  },
];

export const syntheticEndodonticCanals: EndodonticCanal[] = [
  {
    id: "canal-synthetic-mb1",
    name: "MV1",
    observedLength: 19.2,
    projectedLength: 19.5,
    referencePoint: "Cuspide MV",
    status: "prepared",
  },
  {
    id: "canal-synthetic-mb2",
    name: "MV2",
    observedLength: 18.4,
    projectedLength: 18.8,
    referencePoint: "Cuspide MV",
    status: "measured",
  },
  {
    id: "canal-synthetic-d",
    name: "D",
    observedLength: 20.1,
    projectedLength: 20.1,
    referencePoint: "Cuspide D",
    status: "filled",
  },
  {
    id: "canal-synthetic-p",
    name: "P",
    projectedLength: 21.3,
    referencePoint: "Cuspide P",
    status: "unmeasured",
  },
];

export const syntheticProsthesisTimeline: TimelineEvent[] = [
  {
    id: "prosthesis-synthetic-1",
    date: "2025-03-04",
    title: "Extraction 36",
    detail: "Alvéole cicatrisée",
    status: "completed",
    evidence: "validated",
    resourceRef: "Procedure/procedure-synthetic-extraction-36",
  },
  {
    id: "prosthesis-synthetic-2",
    date: "2025-06-10",
    title: "Implant 36",
    detail: "Implant Ø4,1 × 10 mm",
    status: "completed",
    evidence: "validated",
    resourceRef: "Device/device-synthetic-implant-36",
  },
  {
    id: "prosthesis-synthetic-3",
    date: "2025-10-15",
    title: "Pilier provisoire",
    detail: "Séance reportée",
    status: "postponed",
    evidence: "preliminary",
    resourceRef: "Task/task-synthetic-pillar-36",
  },
  {
    id: "prosthesis-synthetic-4",
    date: "2026-09-12",
    title: "Couronne définitive",
    detail: "Céramique monolithique projetée",
    status: "planned",
    evidence: "projected",
    resourceRef: "Task/task-synthetic-crown-36",
  },
];

export const syntheticOrthodonticTimeline: TimelineEvent[] = [
  {
    id: "ortho-synthetic-1",
    date: "2026-02-12",
    title: "Empreinte initiale",
    detail: "Importée du laboratoire",
    status: "completed",
    evidence: "imported",
    resourceRef: "DiagnosticReport/report-synthetic-ortho-scan",
  },
  {
    id: "ortho-synthetic-2",
    date: "2026-04-18",
    title: "Alignement initial",
    detail: "Étape 4 sur 12",
    status: "completed",
    evidence: "validated",
    resourceRef: "Procedure/procedure-synthetic-aligner-04",
  },
  {
    id: "ortho-synthetic-3",
    date: "2026-08-12",
    title: "Contrôle d'étape",
    detail: "Décalage estimé : 0,4 mm",
    status: "current",
    evidence: "derived",
    resourceRef: "Observation/observation-synthetic-ortho-gap",
  },
  {
    id: "ortho-synthetic-4",
    date: "2026-11-20",
    title: "Contention",
    detail: "Fin de série projetée",
    status: "planned",
    evidence: "projected",
    resourceRef: "Task/task-synthetic-retention",
  },
];

export const syntheticDentalImages: DentalImagingItem[] = [
  {
    id: "image-synthetic-pan-001",
    title: "Panoramique",
    modality: "panoramic",
    date: "2026-08-10",
    region: "Arcades complètes",
    evidence: "imported",
    source: "DICOM externe · fichier synthétique",
    resourceRef: "ImagingStudy/imagingstudy-synthetic-panoramic-001",
    synthetic: true,
  },
  {
    id: "image-synthetic-bw-001",
    title: "Bitewing 16–14",
    modality: "bitewing",
    date: "2026-08-12",
    region: "Secteur 1",
    evidence: "observed",
    source: "Capteur intra-oral synthétique",
    resourceRef: "ImagingStudy/imagingstudy-synthetic-bitewing-001",
    synthetic: true,
  },
  {
    id: "image-synthetic-cbct-001",
    title: "Coupe CBCT 36",
    modality: "cbct",
    date: "2026-08-12",
    region: "Site implantaire 36",
    evidence: "derived",
    source: "Reformatage synthétique",
    resourceRef: "ImagingStudy/imagingstudy-synthetic-cbct-001",
    synthetic: true,
  },
];

export const syntheticExtractionSafetyItems: SafetyItem[] = [
  {
    id: "safety-synthetic-consent",
    label: "Consentement éclairé obtenu",
    checked: false,
    critical: true,
    resourceRef: "Consent/consent-synthetic-extraction-36",
  },
  {
    id: "safety-synthetic-allergies",
    label: "Allergies vérifiées",
    detail: "Aucune allergie connue",
    checked: true,
    critical: true,
    resourceRef: "AllergyIntolerance/allergyintolerance-synthetic-none",
  },
  {
    id: "safety-synthetic-anticoagulant",
    label: "Anticoagulants évalués",
    detail: "Aucun traitement déclaré",
    checked: true,
    critical: true,
    resourceRef: "MedicationStatement/medicationstatement-synthetic-none",
  },
  {
    id: "safety-synthetic-imaging",
    label: "Imagerie récente consultée",
    detail: "Panoramique du 10/08/2026",
    checked: true,
    resourceRef: "ImagingStudy/imagingstudy-synthetic-panoramic-001",
  },
  {
    id: "safety-synthetic-hemostasis",
    label: "Plan d'hémostase prêt",
    checked: false,
    resourceRef: "Task/task-synthetic-hemostasis",
  },
];

export const syntheticDentalPrescription: DentalPrescription = {
  id: "prescription-synthetic-amoxicillin-001",
  medication: "Amoxicilline 500 mg",
  dose: "500 mg",
  route: "Voie orale",
  frequency: "3 prises par jour",
  duration: "5 jours",
  maximumDailyDose: "1 500 mg / jour",
  indication: "Infection odontogène synthétique",
  status: "draft",
  pediatric: false,
  allergiesChecked: true,
  interactionsChecked: true,
  author: "Dr L. Ndiaye",
  authoredOn: "2026-08-12",
  resourceRef: "MedicationRequest/medicationrequest-synthetic-amoxicillin-001",
};

export const syntheticDocumentVersions: DentalDocumentVersion[] = [
  {
    id: "document-synthetic-1",
    version: 1,
    title: "Plan de traitement initial",
    date: "2026-08-12T09:10:00Z",
    author: "Dr L. Ndiaye",
    status: "superseded",
    resourceRef: "DocumentReference/documentreference-synthetic-treatment-v1",
  },
  {
    id: "document-synthetic-2",
    version: 2,
    title: "Plan de traitement révisé",
    date: "2026-08-12T10:14:00Z",
    author: "Dr L. Ndiaye",
    status: "signed",
    replaces: "document-synthetic-1",
    resourceRef: "DocumentReference/documentreference-synthetic-treatment-v2",
  },
];

export function isSyntheticOdontologyResource(resource: FhirResource) {
  return (
    resource.id?.includes("synthetic") === true &&
    resource.meta?.tag?.some(
      (coding) => coding.system === ODONTOLOGY_SYNTHETIC_TAG_SYSTEM && coding.code === "synthetic",
    ) === true
  );
}

export const syntheticOdontologyResources = syntheticOdontologyFhirBundle.entry.map(
  ({ resource }) => resource,
);
