import type { Device, DiagnosticReport, Patient, Provenance } from "@clinical-ui/fhir";
import type {
  AudiogramDataset,
  AudiogramPoint,
  EndoscopeTraceabilityRecord,
  EndoscopyMedia,
  EntBundle,
  EntDocumentReference,
  EntObservation,
  EntProcedure,
  EntQuestionnaireResponse,
  EntSpecimen,
  EntSyntheticMeta,
  MiddleEarDataset,
  OncologyTimelineEvent,
  RhinologyDataset,
  SafetyChecklistItem,
  SleepDataset,
  VestibularFinding,
  VoiceSwallowingFinding,
} from "./types";

export const ENT_SYNTHETIC_TAG_SYSTEM = "https://clinical-ui.dev/fhir/CodeSystem/fixture-kind";
export const ENT_SYNTHETIC_NOW = "2026-08-12T10:15:00Z";

export const entSyntheticMeta: EntSyntheticMeta = {
  lastUpdated: ENT_SYNTHETIC_NOW,
  tag: [
    {
      system: ENT_SYNTHETIC_TAG_SYSTEM,
      code: "synthetic",
      display: "Donnée synthétique",
    },
  ],
};

const source = (
  reference: string,
  maturity:
    | "observed"
    | "imported"
    | "derived"
    | "projected"
    | "preliminary"
    | "validated" = "observed",
) => ({
  reference,
  maturity,
  recordedAt: ENT_SYNTHETIC_NOW,
  author: "Dr A. Fall — identité synthétique",
});

export const syntheticEntPatient = {
  resourceType: "Patient",
  id: "patient-synthetic-ent-001",
  meta: entSyntheticMeta,
  identifier: [
    {
      use: "official",
      system: "https://example.invalid/fhir/NamingSystem/mrn",
      value: "SYN-ORL-0042",
    },
  ],
  name: [{ use: "usual", text: "Mariam Diop — synthétique" }],
  gender: "female",
  birthDate: "1984-02-17",
} satisfies Patient;

export const syntheticAudiometer = {
  resourceType: "Device",
  id: "device-synthetic-audiometer-001",
  meta: entSyntheticMeta,
  displayName: "Audiomètre synthétique A-61",
  manufacturer: "Clinical UI Fixtures",
  serialNumber: "AUD-SYN-2608",
} satisfies Device;

export const syntheticEndoscope = {
  resourceType: "Device",
  id: "device-synthetic-endoscope-001",
  meta: entSyntheticMeta,
  displayName: "Nasofibroscope synthétique EN-02",
  manufacturer: "Clinical UI Fixtures",
  serialNumber: "ENDO-SYN-0157",
} satisfies Device;

export const syntheticAudiogramObservation = {
  resourceType: "Observation",
  id: "observation-synthetic-audiogram-001",
  meta: entSyntheticMeta,
  status: "preliminary",
  category: [{ text: "Audiologie" }],
  code: { text: "Seuils audiométriques tonaux" },
  subject: { reference: "Patient/patient-synthetic-ent-001" },
  effectiveDateTime: ENT_SYNTHETIC_NOW,
  performer: [{ reference: "Practitioner/practitioner-synthetic-ent-001" }],
  device: { reference: "Device/device-synthetic-audiometer-001" },
  component: [
    {
      code: { text: "Droite · voie aérienne · 1 000 Hz" },
      valueQuantity: { value: 35, unit: "dB HL", system: "http://unitsofmeasure.org", code: "dB" },
    },
    {
      code: { text: "Gauche · voie aérienne · 1 000 Hz" },
      valueQuantity: { value: 20, unit: "dB HL", system: "http://unitsofmeasure.org", code: "dB" },
    },
  ],
  note: [{ text: "Fixture synthétique. Ne constitue pas un résultat patient." }],
} satisfies EntObservation;

export const syntheticTympanometryObservation = {
  resourceType: "Observation",
  id: "observation-synthetic-tympanometry-001",
  meta: entSyntheticMeta,
  status: "final",
  category: [{ text: "Audiologie" }],
  code: { text: "Tympanométrie 226 Hz" },
  subject: { reference: "Patient/patient-synthetic-ent-001" },
  effectiveDateTime: ENT_SYNTHETIC_NOW,
  component: [
    {
      code: { text: "Droite · pression du pic" },
      valueQuantity: {
        value: -10,
        unit: "daPa",
        system: "http://unitsofmeasure.org",
        code: "daPa",
      },
    },
    {
      code: { text: "Droite · compliance" },
      valueQuantity: { value: 0.8, unit: "mL", system: "http://unitsofmeasure.org", code: "mL" },
    },
  ],
} satisfies EntObservation;

export const syntheticQuestionnaireResponse = {
  resourceType: "QuestionnaireResponse",
  id: "questionnaire-response-synthetic-ent-001",
  meta: entSyntheticMeta,
  questionnaire: "Questionnaire/questionnaire-synthetic-snot22-001",
  status: "completed",
  subject: { reference: "Patient/patient-synthetic-ent-001" },
  authored: ENT_SYNTHETIC_NOW,
  author: { reference: "Patient/patient-synthetic-ent-001" },
  item: [{ linkId: "total", text: "SNOT-22 total", answer: [{ valueInteger: 18 }] }],
} satisfies EntQuestionnaireResponse;

export const syntheticEndoscopyDocument = {
  resourceType: "DocumentReference",
  id: "document-reference-synthetic-endoscopy-001",
  meta: entSyntheticMeta,
  status: "current",
  docStatus: "preliminary",
  type: { text: "Acquisition endoscopique ORL synthétique" },
  subject: { reference: "Patient/patient-synthetic-ent-001" },
  date: ENT_SYNTHETIC_NOW,
  author: [{ reference: "Practitioner/practitioner-synthetic-ent-001" }],
  content: [
    {
      attachment: {
        contentType: "image/png",
        url: "https://example.invalid/synthetic/endoscopy-frame-001.png",
        title: "Média synthétique — mire technique",
        creation: ENT_SYNTHETIC_NOW,
      },
    },
  ],
} satisfies EntDocumentReference;

export const syntheticSpecimen = {
  resourceType: "Specimen",
  id: "specimen-synthetic-ent-001",
  meta: entSyntheticMeta,
  identifier: [
    { system: "https://example.invalid/fhir/NamingSystem/specimen", value: "SYN-CAV-01" },
  ],
  status: "available",
  type: { text: "Prélèvement ORL synthétique" },
  subject: { reference: "Patient/patient-synthetic-ent-001" },
  receivedTime: "2026-07-11T14:10:00Z",
  collection: {
    collectedDateTime: "2026-07-11T10:20:00Z",
    bodySite: { text: "Cavum gauche — synthétique" },
    collector: { reference: "Practitioner/practitioner-synthetic-ent-001" },
  },
} satisfies EntSpecimen;

export const syntheticEntProcedure = {
  resourceType: "Procedure",
  id: "procedure-synthetic-ent-001",
  meta: entSyntheticMeta,
  status: "completed",
  code: { text: "Endoscopie ORL synthétique" },
  subject: { reference: "Patient/patient-synthetic-ent-001" },
  occurrenceDateTime: ENT_SYNTHETIC_NOW,
  performer: [{ actor: { reference: "Practitioner/practitioner-synthetic-ent-001" } }],
  used: [{ reference: "Device/device-synthetic-endoscope-001" }],
  report: [{ reference: "DocumentReference/document-reference-synthetic-endoscopy-001" }],
  note: [{ text: "Consentement recueilli dans cette fixture synthétique." }],
} satisfies EntProcedure;

export const syntheticEntReport = {
  resourceType: "DiagnosticReport",
  id: "diagnostic-report-synthetic-ent-001",
  meta: { ...entSyntheticMeta, versionId: "3" },
  status: "final",
  code: { text: "Compte rendu ORL synthétique" },
  subject: { reference: "Patient/patient-synthetic-ent-001" },
  effectiveDateTime: ENT_SYNTHETIC_NOW,
  issued: "2026-08-12T10:32:00Z",
  performer: [{ reference: "Practitioner/practitioner-synthetic-ent-001" }],
  result: [
    { reference: "Observation/observation-synthetic-audiogram-001" },
    { reference: "Observation/observation-synthetic-tympanometry-001" },
  ],
  conclusion: "Données synthétiques de démonstration. Aucune conclusion diagnostique automatique.",
} satisfies DiagnosticReport;

export const syntheticEntProvenance = {
  resourceType: "Provenance",
  id: "provenance-synthetic-ent-001",
  meta: { ...entSyntheticMeta, versionId: "3" },
  target: [{ reference: "DiagnosticReport/diagnostic-report-synthetic-ent-001" }],
  recorded: "2026-08-12T10:34:00Z",
  activity: { text: "Signature médicale" },
  agent: [
    {
      type: { text: "Auteur" },
      who: {
        reference: "Practitioner/practitioner-synthetic-ent-001",
        display: "Dr A. Fall — identité synthétique",
      },
    },
  ],
  entity: [
    {
      role: "source",
      what: { reference: "Device/device-synthetic-audiometer-001" },
    },
  ],
} satisfies Provenance;

export const syntheticEntFhirResources = [
  syntheticEntPatient,
  syntheticAudiometer,
  syntheticEndoscope,
  syntheticAudiogramObservation,
  syntheticTympanometryObservation,
  syntheticQuestionnaireResponse,
  syntheticEndoscopyDocument,
  syntheticSpecimen,
  syntheticEntProcedure,
  syntheticEntReport,
  syntheticEntProvenance,
];

export const syntheticEntBundle = {
  resourceType: "Bundle",
  id: "bundle-synthetic-ent-001",
  meta: entSyntheticMeta,
  type: "collection",
  timestamp: ENT_SYNTHETIC_NOW,
  entry: syntheticEntFhirResources.map((resource) => ({
    fullUrl: `https://example.invalid/fhir/${resource.resourceType}/${resource.id}`,
    resource,
  })),
} satisfies EntBundle;

const airPoint = (
  side: "right" | "left",
  frequencyHz: number,
  thresholdDbHl: number,
  noResponse = false,
): AudiogramPoint => ({
  side,
  frequencyHz,
  thresholdDbHl,
  conduction: "air",
  ...(noResponse ? { noResponse: true } : {}),
  source: source("Observation/observation-synthetic-audiogram-001", "preliminary"),
});

const bonePoint = (
  side: "right" | "left",
  frequencyHz: number,
  thresholdDbHl: number,
): AudiogramPoint => ({
  side,
  frequencyHz,
  thresholdDbHl,
  conduction: "bone",
  masked: true,
  source: source("Observation/observation-synthetic-audiogram-001", "preliminary"),
});

export const syntheticAudiogram: AudiogramDataset = {
  id: "audiogram-synthetic-001",
  status: "preliminary",
  device: "Audiomètre synthétique A-61 · AUD-SYN-2608",
  calibrationDate: "2026-05-05",
  quality: "acceptable",
  transducer: "Insert ER-3A synthétique",
  points: [
    ...[250, 500, 1000, 2000, 4000, 8000].map((frequency, index) =>
      airPoint("right", frequency, [20, 25, 35, 50, 70, 90][index] ?? 0, frequency === 8000),
    ),
    ...[250, 500, 1000, 2000, 4000, 8000].map((frequency, index) =>
      airPoint("left", frequency, [10, 15, 20, 30, 50, 60][index] ?? 0),
    ),
    ...[500, 1000, 2000, 4000].map((frequency, index) =>
      bonePoint("right", frequency, [15, 20, 30, 45][index] ?? 0),
    ),
    ...[500, 1000, 2000, 4000].map((frequency, index) =>
      bonePoint("left", frequency, [10, 15, 20, 35][index] ?? 0),
    ),
  ],
  speech: [
    {
      side: "right",
      srtDbHl: 25,
      wordRecognitionPercent: 92,
      presentationLevelDbHl: 65,
      source: source("Observation/observation-synthetic-speech-001", "observed"),
    },
    {
      side: "left",
      srtDbHl: 15,
      wordRecognitionPercent: 96,
      presentationLevelDbHl: 65,
      source: source("Observation/observation-synthetic-speech-001", "observed"),
    },
  ],
  previousAirPoints: [
    airPoint("right", 1000, 30),
    airPoint("right", 2000, 40),
    airPoint("right", 4000, 60),
    airPoint("left", 1000, 20),
    airPoint("left", 2000, 25),
    airPoint("left", 4000, 45),
  ],
};

export const syntheticMiddleEar: MiddleEarDataset = {
  device: "Impédancemètre synthétique MI-24 · IMP-SYN-19",
  probeToneHz: 226,
  quality: "limited",
  tympanograms: [
    {
      side: "right",
      peakPressureDapa: -10,
      complianceMl: 0.8,
      canalVolumeMl: 1.1,
      gradientDapa: 80,
      curveType: "A",
      source: source("Observation/observation-synthetic-tympanometry-001", "validated"),
    },
    {
      side: "left",
      peakPressureDapa: -95,
      complianceMl: 0.35,
      canalVolumeMl: 1.2,
      source: source("Observation/observation-synthetic-tympanometry-001", "validated"),
    },
  ],
  reflexes: [
    {
      side: "right",
      stimulus: "ipsilateral",
      frequencyHz: 500,
      thresholdDbHl: 85,
      outcome: "present",
    },
    {
      side: "right",
      stimulus: "ipsilateral",
      frequencyHz: 1000,
      thresholdDbHl: 90,
      outcome: "present",
    },
    { side: "right", stimulus: "ipsilateral", frequencyHz: 2000, outcome: "not-tested" },
    {
      side: "left",
      stimulus: "ipsilateral",
      frequencyHz: 500,
      thresholdDbHl: 90,
      outcome: "present",
    },
    { side: "left", stimulus: "ipsilateral", frequencyHz: 1000, outcome: "absent" },
    { side: "left", stimulus: "ipsilateral", frequencyHz: 2000, outcome: "not-tested" },
  ],
};

export const syntheticPediatricMiddleEar: MiddleEarDataset = {
  ...syntheticMiddleEar,
  device: "Impédancemètre synthétique MI-24 · mode pédiatrique",
  probeToneHz: 1000,
  quality: "limited",
  reflexes: syntheticMiddleEar.reflexes.map((reflex) => ({
    side: reflex.side,
    stimulus: reflex.stimulus,
    ...(reflex.frequencyHz === undefined ? {} : { frequencyHz: reflex.frequencyHz }),
    outcome: "not-tested",
  })),
};

export const syntheticEndoscopyMedia: EndoscopyMedia[] = [
  {
    id: "media-synthetic-endoscopy-001",
    title: "Mire technique 01",
    availability: "available",
    laterality: "right",
    bodySite: "Fosse nasale — métadonnée synthétique",
    capturedAt: ENT_SYNTHETIC_NOW,
    consent: "recorded",
    synthetic: true,
    source: source("DocumentReference/document-reference-synthetic-endoscopy-001", "preliminary"),
  },
  {
    id: "media-synthetic-endoscopy-002",
    title: "Capture attendue 02",
    availability: "unavailable",
    laterality: "left",
    bodySite: "Fosse nasale — métadonnée synthétique",
    consent: "recorded",
    synthetic: true,
    source: source("DocumentReference/document-reference-synthetic-endoscopy-002", "observed"),
  },
];

export const syntheticVestibularFindings: VestibularFinding[] = [
  {
    test: "Head impulse clinique",
    result: "Sans anomalie consignée",
    side: "bilateral",
    maturity: "observed",
  },
  { test: "Dix–Hallpike", result: "Série droite complète", side: "right", maturity: "observed" },
  { test: "VNG", result: "Compte rendu externe disponible", side: "left", maturity: "imported" },
];

export const syntheticVoiceSwallowingFindings: VoiceSwallowingFinding[] = [
  { domain: "voice", measure: "Temps phonatoire maximal", value: "14 s", maturity: "observed" },
  { domain: "voice", measure: "GRBAS", value: "1–1–0–0–0", maturity: "preliminary" },
  { domain: "swallowing", measure: "EAT-10", value: "7 / 40", maturity: "observed" },
  {
    domain: "swallowing",
    measure: "Évaluation instrumentale",
    value: "Non disponible",
    maturity: "observed",
  },
];

export const syntheticRhinology: RhinologyDataset = {
  duration: "8 semaines",
  laterality: "left",
  riskFactors: ["Exposition professionnelle aux poussières — synthétique"],
  redFlags: ["Épistaxis récidivante déclarée — à confronter cliniquement"],
  questionnaire: {
    code: "SNOT-22",
    label: "SNOT-22",
    score: 18,
    maximum: 110,
    source: source("QuestionnaireResponse/questionnaire-response-synthetic-ent-001", "observed"),
  },
  rightNasalScore: 2,
  leftNasalScore: 6,
};

export const syntheticSleep: SleepDataset = {
  questionnaires: [
    {
      code: "ESS",
      label: "Échelle d'Epworth",
      score: 6,
      maximum: 24,
      source: source("QuestionnaireResponse/questionnaire-response-synthetic-ess-001"),
    },
    {
      code: "STOP-BANG",
      label: "STOP-BANG",
      score: 3,
      maximum: 8,
      source: source("QuestionnaireResponse/questionnaire-response-synthetic-stopbang-001"),
    },
  ],
  importedAhi: 5.8,
  importedAt: "2026-07-30T08:10:00Z",
  signalsAvailable: ["Débit", "SpO₂", "Effort thoracique"],
  signalsMissing: ["Position corporelle"],
};

export const syntheticOncologyTimeline: OncologyTimelineEvent[] = [
  {
    id: "event-synthetic-lesion",
    at: "2026-07-04T09:15:00Z",
    title: "Lésion décrite",
    detail: "Cavum gauche · latéralité consignée",
    kind: "lesion",
    maturity: "observed",
    sourceReference: "Observation/observation-synthetic-lesion-001",
  },
  {
    id: "event-synthetic-specimen",
    at: "2026-07-11T10:20:00Z",
    title: "Prélèvement enregistré",
    detail: "Spécimen SYN-CAV-01 · résultat en attente",
    kind: "specimen",
    maturity: "observed",
    sourceReference: "Specimen/specimen-synthetic-ent-001",
  },
  {
    id: "event-synthetic-stage",
    at: "2026-07-18T08:30:00Z",
    title: "Stade codé importé",
    detail: "cT1 N0 M0 · référentiel déclaré",
    kind: "staging",
    maturity: "imported",
    sourceReference: "Observation/observation-synthetic-stage-001",
  },
  {
    id: "event-synthetic-mdt",
    at: "2026-07-25T16:00:00Z",
    title: "Réunion de coordination",
    detail: "Options consignées · conclusion préliminaire",
    kind: "coordination",
    maturity: "preliminary",
    sourceReference: "CarePlan/care-plan-synthetic-ent-001",
  },
  {
    id: "event-synthetic-plan",
    at: "2026-09-02T10:20:00Z",
    title: "Fenêtre opératoire",
    detail: "Planification uniquement · aucune indication automatique",
    kind: "procedure",
    maturity: "projected",
    sourceReference: "ServiceRequest/service-request-synthetic-ent-001",
  },
  {
    id: "event-synthetic-report",
    at: "2026-08-12T10:32:00Z",
    title: "Compte rendu signé",
    detail: "Version 3 · synthèse validée",
    kind: "report",
    maturity: "validated",
    signedBy: "Dr A. Fall — identité synthétique",
    sourceReference: "DiagnosticReport/diagnostic-report-synthetic-ent-001",
  },
];

export const syntheticSafetyChecklist: SafetyChecklistItem[] = [
  {
    id: "safety-synthetic-identity",
    label: "Identité et procédure concordantes",
    group: "pre-procedure",
    status: "checked",
    checkedBy: "IDE M. Sarr — synthétique",
    checkedAt: ENT_SYNTHETIC_NOW,
  },
  {
    id: "safety-synthetic-site",
    label: "Site et latéralité confirmés à voix haute",
    group: "pre-procedure",
    status: "checked",
    checkedAt: ENT_SYNTHETIC_NOW,
  },
  {
    id: "safety-synthetic-implant",
    label: "Référence d'implant documentée avant ouverture",
    group: "implant",
    status: "not-applicable",
  },
  {
    id: "safety-synthetic-postop",
    label: "Consignes postopératoires remises",
    group: "postoperative",
    status: "pending",
  },
  {
    id: "safety-synthetic-airway",
    label: "Chariot d'urgence et voie aérienne vérifiés",
    group: "emergency",
    status: "checked",
    checkedAt: ENT_SYNTHETIC_NOW,
  },
];

export const syntheticTraceability: EndoscopeTraceabilityRecord = {
  scopeIdentifier: "ENDO-SYN-0157",
  procedureReference: "Procedure/procedure-synthetic-ent-001",
  cycleIdentifier: "CYC-SYN-260812-0234",
  leakTest: "passed",
  cleaning: "complete",
  disinfection: "released",
  operator: "IDE M. Sarr — identité synthétique",
  releasedAt: "2026-08-12T09:42:00Z",
  vigilanceAcknowledged: true,
};

export function isSyntheticEntResource(resource: {
  id?: string;
  meta?: { tag?: Array<{ system?: string; code?: string }> };
}) {
  return Boolean(
    resource.id?.includes("synthetic") &&
      resource.meta?.tag?.some(
        (tag) => tag.system === ENT_SYNTHETIC_TAG_SYSTEM && tag.code === "synthetic",
      ),
  );
}
