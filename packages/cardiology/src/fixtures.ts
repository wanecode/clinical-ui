import type { Device, DiagnosticReport, FhirMeta, Patient, Provenance } from "@clinical-ui/fhir";
import type {
  BloodPressureReading,
  CardiologyDetectedIssue,
  CardiologyMedicationRequest,
  CardiologyObservation,
  CardiologyRiskAssessment,
  DeviceTimelineEvent,
  EcgStudy,
  EchocardiographyMeasure,
  HolterEvent,
  PrescriptionSafetyItem,
  ReportLifecycleItem,
  RiskScoreModel,
  SummaryDatum,
  TrajectoryEvent,
  VigilanceItem,
} from "./types";

export const CARDIOLOGY_SYNTHETIC_NOW = "2026-08-12T10:15:00Z";
export const CARDIOLOGY_SYNTHETIC_TAG_SYSTEM =
  "https://clinical-ui.dev/fhir/CodeSystem/fixture-kind";

const syntheticMeta: FhirMeta = {
  lastUpdated: CARDIOLOGY_SYNTHETIC_NOW,
  tag: [
    {
      system: CARDIOLOGY_SYNTHETIC_TAG_SYSTEM,
      code: "synthetic",
      display: "Donnée cardiologique synthétique",
    },
  ],
};

const subject = {
  reference: "Patient/patient-synthetic-cardio-001",
  display: "Awa Ndiaye — synthétique",
};

const loinc = (code: string, display: string) => ({
  coding: [{ system: "http://loinc.org", code, display }],
  text: display,
});

export const syntheticCardiologyPatient = {
  resourceType: "Patient",
  id: "patient-synthetic-cardio-001",
  meta: syntheticMeta,
  identifier: [
    {
      use: "official",
      system: "https://example.invalid/fhir/NamingSystem/cardio-mrn",
      value: "SYN-CARDIO-0042",
    },
  ],
  name: [{ use: "usual", text: "Awa Ndiaye", family: "Ndiaye", given: ["Awa"] }],
  gender: "female",
  birthDate: "1964-04-12",
} satisfies Patient;

export const syntheticCardiologyObservations = [
  {
    resourceType: "Observation",
    id: "observation-synthetic-cardio-sbp",
    meta: syntheticMeta,
    status: "final",
    code: loinc("8480-6", "Pression artérielle systolique"),
    subject,
    effectiveDateTime: "2026-08-10T08:30:00Z",
    valueQuantity: {
      value: 132,
      unit: "mmHg",
      system: "http://unitsofmeasure.org",
      code: "mm[Hg]",
    },
    performer: [
      { reference: "Practitioner/practitioner-synthetic-cardio-001", display: "Dr Synthèse" },
    ],
  },
  {
    resourceType: "Observation",
    id: "observation-synthetic-cardio-cholesterol",
    meta: syntheticMeta,
    status: "final",
    code: loinc("2093-3", "Cholestérol total"),
    subject,
    effectiveDateTime: "2026-08-09T07:45:00Z",
    valueQuantity: {
      value: 5.2,
      unit: "mmol/L",
      system: "http://unitsofmeasure.org",
      code: "mmol/L",
    },
  },
  {
    resourceType: "Observation",
    id: "observation-synthetic-cardio-hdl",
    meta: syntheticMeta,
    status: "final",
    code: loinc("2085-9", "Cholestérol HDL"),
    subject,
    effectiveDateTime: "2026-08-09T07:45:00Z",
    valueQuantity: {
      value: 1.3,
      unit: "mmol/L",
      system: "http://unitsofmeasure.org",
      code: "mmol/L",
    },
  },
  {
    resourceType: "Observation",
    id: "observation-synthetic-cardio-ecg",
    meta: syntheticMeta,
    status: "preliminary",
    category: [{ text: "ECG" }],
    code: loinc("11524-6", "ECG 12 dérivations"),
    subject,
    effectiveDateTime: "2026-08-12T09:42:00Z",
    issued: "2026-08-12T09:45:00Z",
    component: [
      { code: loinc("8867-4", "Fréquence cardiaque"), valueQuantity: { value: 68, unit: "bpm" } },
      { code: { text: "Intervalle PR" }, valueQuantity: { value: 164, unit: "ms" } },
      { code: { text: "Durée QRS" }, valueQuantity: { value: 96, unit: "ms" } },
      { code: { text: "QTc" }, valueQuantity: { value: 430, unit: "ms" } },
    ],
    device: {
      reference: "Device/device-synthetic-cardio-ecg",
      display: "ECG synthétique / SYN-ECG-42",
    },
    note: [{ text: "Interprétation automatisée à confirmer par le cardiologue." }],
  },
  {
    resourceType: "Observation",
    id: "observation-synthetic-cardio-lvef",
    meta: syntheticMeta,
    status: "amended",
    code: loinc("10230-1", "Fraction d'éjection du ventricule gauche"),
    subject,
    effectiveDateTime: "2026-08-11T14:20:00Z",
    valueQuantity: { value: 42, unit: "%", system: "http://unitsofmeasure.org", code: "%" },
    note: [{ text: "Mesure Simpson biplan, amendée après relecture." }],
  },
] satisfies CardiologyObservation[];

export const syntheticRiskAssessment = {
  resourceType: "RiskAssessment",
  id: "riskassessment-synthetic-cardio-score2",
  meta: { ...syntheticMeta, versionId: "3" },
  status: "final",
  subject,
  occurrenceDateTime: "2026-08-12T10:00:00Z",
  method: {
    coding: [
      {
        system: "https://clinical-ui.dev/fhir/CodeSystem/risk-model",
        version: "2026.2",
        code: "score2",
        display: "SCORE2",
      },
    ],
    text: "SCORE2 · version 2026.2",
  },
  basis: syntheticCardiologyObservations.slice(0, 3).map((resource) => ({
    reference: `Observation/${resource.id}`,
  })),
  prediction: [
    {
      outcome: { text: "Risque cardiovasculaire à 10 ans" },
      probabilityDecimal: 0.063,
      rationale: "Calcul synthétique destiné à la démonstration.",
    },
  ],
} satisfies CardiologyRiskAssessment;

export const syntheticMedicationRequests = [
  {
    resourceType: "MedicationRequest",
    id: "medicationrequest-synthetic-cardio-bisoprolol",
    meta: syntheticMeta,
    status: "active",
    intent: "order",
    medication: { concept: { text: "Bisoprolol 5 mg" } },
    subject,
    authoredOn: "2026-07-20",
    requester: {
      reference: "Practitioner/practitioner-synthetic-cardio-001",
      display: "Dr Synthèse",
    },
    dosageInstruction: [{ text: "5 mg une fois par jour" }],
  },
  {
    resourceType: "MedicationRequest",
    id: "medicationrequest-synthetic-cardio-apixaban",
    meta: syntheticMeta,
    status: "draft",
    intent: "proposal",
    medication: { concept: { text: "Apixaban 5 mg" } },
    subject,
    authoredOn: "2026-08-12",
    requester: {
      reference: "Practitioner/practitioner-synthetic-cardio-001",
      display: "Dr Synthèse",
    },
    dosageInstruction: [{ text: "5 mg deux fois par jour — à confirmer" }],
  },
] satisfies CardiologyMedicationRequest[];

export const syntheticDetectedIssues = [
  {
    resourceType: "DetectedIssue",
    id: "detectedissue-synthetic-cardio-interaction",
    meta: syntheticMeta,
    status: "preliminary",
    severity: "high",
    code: { text: "Interaction potentielle anticoagulant / antiarythmique" },
    subject,
    identifiedDateTime: "2026-08-12T10:05:00Z",
    implicated: [
      { reference: "MedicationRequest/medicationrequest-synthetic-cardio-apixaban" },
      { reference: "MedicationRequest/medicationrequest-synthetic-cardio-amiodarone" },
    ],
    detail: "Signal synthétique : prescription et fonction rénale à vérifier avant confirmation.",
    mitigation: [
      {
        action: { text: "Validation médicale explicite" },
        author: {
          reference: "Practitioner/practitioner-synthetic-cardio-001",
          display: "Dr Synthèse",
        },
      },
    ],
  },
] satisfies CardiologyDetectedIssue[];

export const syntheticCardiologyDevices = [
  {
    resourceType: "Device",
    id: "device-synthetic-cardio-ecg",
    meta: syntheticMeta,
    displayName: "Electrocardiographe synthétique",
    manufacturer: "Fabricant synthétique",
    serialNumber: "SYN-ECG-42",
  },
  {
    resourceType: "Device",
    id: "device-synthetic-cardio-implant",
    meta: syntheticMeta,
    displayName: "Dispositif cardiaque implantable synthétique",
    manufacturer: "Fabricant synthétique",
    serialNumber: "SYN-DAI-042",
  },
] satisfies Device[];

export const syntheticCardiologyReports = [
  {
    resourceType: "DiagnosticReport",
    id: "diagnosticreport-synthetic-cardio-echo-preliminary",
    meta: { ...syntheticMeta, versionId: "1" },
    status: "preliminary",
    code: { text: "Échocardiographie transthoracique synthétique" },
    subject,
    effectiveDateTime: "2026-08-11T14:20:00Z",
    issued: "2026-08-11T14:40:00Z",
    performer: [
      { reference: "Practitioner/practitioner-synthetic-cardio-002", display: "Dr Lecture" },
    ],
    result: [{ reference: "Observation/observation-synthetic-cardio-lvef" }],
    conclusion: "Conclusion préliminaire synthétique, à valider.",
  },
  {
    resourceType: "DiagnosticReport",
    id: "diagnosticreport-synthetic-cardio-echo-amended",
    meta: { ...syntheticMeta, versionId: "2" },
    status: "amended",
    code: { text: "Échocardiographie transthoracique synthétique" },
    subject,
    effectiveDateTime: "2026-08-11T14:20:00Z",
    issued: "2026-08-12T08:20:00Z",
    performer: [
      { reference: "Practitioner/practitioner-synthetic-cardio-002", display: "Dr Lecture" },
    ],
    result: [{ reference: "Observation/observation-synthetic-cardio-lvef" }],
    conclusion: "Compte rendu amendé après relecture des mesures synthétiques.",
  },
  {
    resourceType: "DiagnosticReport",
    id: "diagnosticreport-synthetic-cardio-echo-signed",
    meta: { ...syntheticMeta, versionId: "3" },
    status: "final",
    code: { text: "Échocardiographie transthoracique synthétique" },
    subject,
    effectiveDateTime: "2026-08-11T14:20:00Z",
    issued: "2026-08-12T09:10:00Z",
    performer: [
      { reference: "Practitioner/practitioner-synthetic-cardio-002", display: "Dr Lecture" },
    ],
    resultsInterpreter: [
      { reference: "Practitioner/practitioner-synthetic-cardio-001", display: "Dr Synthèse" },
    ],
    result: [{ reference: "Observation/observation-synthetic-cardio-lvef" }],
    conclusion: "Compte rendu final synthétique signé après validation humaine.",
  },
] satisfies DiagnosticReport[];

export const syntheticCardiologyProvenance = {
  resourceType: "Provenance",
  id: "provenance-synthetic-cardio-report-signed",
  meta: { ...syntheticMeta, versionId: "3" },
  target: [{ reference: "DiagnosticReport/diagnosticreport-synthetic-cardio-echo-signed" }],
  occurredDateTime: "2026-08-12T09:10:00Z",
  recorded: "2026-08-12T09:10:42Z",
  activity: { text: "Signature médicale" },
  agent: [
    {
      type: { text: "Auteur" },
      who: { reference: "Practitioner/practitioner-synthetic-cardio-001", display: "Dr Synthèse" },
    },
  ],
  entity: [
    {
      role: "revision",
      what: { reference: "DiagnosticReport/diagnosticreport-synthetic-cardio-echo-amended" },
    },
  ],
} satisfies Provenance;

export const syntheticSummaryData: SummaryDatum[] = [
  {
    id: "rhythm",
    label: "Rythme",
    value: "Sinusal · 68 bpm",
    detail: "ECG 12 dérivations",
    status: "preliminary",
    origin: "imported",
    sourceReference: "Observation/observation-synthetic-cardio-ecg",
  },
  {
    id: "lvef",
    label: "FEVG",
    value: "42 %",
    detail: "Simpson biplan · stade à confirmer",
    status: "amended",
    origin: "observed",
    sourceReference: "Observation/observation-synthetic-cardio-lvef",
  },
  {
    id: "bp",
    label: "Pression moyenne",
    value: "132 / 84 mmHg",
    detail: "3 mesures au cabinet",
    status: "validated",
    origin: "observed",
    sourceReference: "Observation/observation-synthetic-cardio-sbp",
  },
  {
    id: "risk",
    label: "Risque SCORE2",
    value: "6,3 % à 10 ans",
    detail: "Modèle 2026.2",
    status: "validated",
    origin: "derived",
    sourceReference: "RiskAssessment/riskassessment-synthetic-cardio-score2",
  },
];

export const syntheticRiskScore: RiskScoreModel = {
  name: "SCORE2",
  version: "2026.2",
  status: "calculated",
  value: 6.3,
  unit: "%",
  horizon: "10 ans",
  sourceReference: "RiskAssessment/riskassessment-synthetic-cardio-score2",
  missingInputs: [],
  inputs: [
    {
      id: "age",
      label: "Âge",
      value: "62 ans",
      origin: "observed",
      sourceReference: "Patient/patient-synthetic-cardio-001",
    },
    {
      id: "sex",
      label: "Sexe",
      value: "Femme",
      origin: "observed",
      sourceReference: "Patient/patient-synthetic-cardio-001",
    },
    {
      id: "smoking",
      label: "Tabagisme",
      value: "Non",
      origin: "observed",
      sourceReference: "Observation/observation-synthetic-cardio-smoking",
    },
    {
      id: "sbp",
      label: "PAS",
      value: "132 mmHg",
      origin: "observed",
      sourceReference: "Observation/observation-synthetic-cardio-sbp",
    },
    {
      id: "cholesterol",
      label: "Cholestérol total",
      value: "5,2 mmol/L",
      origin: "imported",
      sourceReference: "Observation/observation-synthetic-cardio-cholesterol",
    },
    {
      id: "hdl",
      label: "HDL",
      value: "1,3 mmol/L",
      origin: "imported",
      sourceReference: "Observation/observation-synthetic-cardio-hdl",
    },
  ],
};

const { value: _calculatedValue, ...syntheticRiskScoreWithoutValue } = syntheticRiskScore;

export const syntheticIncompleteRiskScore: RiskScoreModel = {
  ...syntheticRiskScoreWithoutValue,
  status: "not-calculated",
  missingInputs: ["Cholestérol HDL", "Statut tabagique actualisé"],
  inputs: syntheticRiskScore.inputs.map((input) => {
    if (input.id !== "hdl" && input.id !== "smoking") return input;
    const { value: _value, sourceReference: _sourceReference, ...missingInput } = input;
    return missingInput;
  }),
};

const leadPoints = [
  [0, 0],
  [40, 0.03],
  [70, 0.14],
  [90, 0.02],
  [115, 0],
  [135, -0.12],
  [145, 1.08],
  [154, -0.32],
  [175, 0],
  [220, 0.2],
  [265, 0.22],
  [310, 0],
  [360, 0],
  [400, 0.04],
  [430, 0.15],
  [450, 0],
  [478, -0.1],
  [488, 1.02],
  [498, -0.28],
  [520, 0],
  [575, 0.24],
  [625, 0.2],
  [680, 0],
  [735, 0],
  [780, 0.12],
  [800, 0],
  [828, -0.12],
  [838, 1.05],
  [848, -0.3],
  [875, 0],
  [930, 0.2],
  [980, 0.18],
  [1040, 0],
  [1120, 0],
] as const;

export const syntheticEcgStudy: EcgStudy = {
  id: "ecg-synthetic-cardio-001",
  recordedAt: "2026-08-12T09:42:00Z",
  speed: "25 mm/s",
  gain: "10 mm/mV",
  quality: "acceptable",
  origin: "imported",
  rawSourceLabel: "SCP-ECG synthétique · SHA-256 9e51…b42c",
  sourceReference: "Observation/observation-synthetic-cardio-ecg",
  deviceLabel: "Electrocardiographe synthétique / SYN-ECG-42",
  leads: [
    {
      name: "II",
      points: leadPoints.map(([millisecond, millivolt]) => ({ millisecond, millivolt })),
    },
  ],
  measurements: [
    { label: "Fréquence", value: "68 bpm", reference: "60–100 bpm" },
    { label: "PR", value: "164 ms", reference: "120–200 ms" },
    { label: "QRS", value: "96 ms", reference: "< 120 ms" },
    { label: "QT / QTc", value: "388 / 430 ms" },
  ],
  interpretation: ["Rythme sinusal", "Axe QRS +32°", "Artefact de mouvement court en fin de tracé"],
  reportStatus: "preliminary",
};

export const syntheticEchoMeasures: EchocardiographyMeasure[] = [
  {
    label: "FEVG Simpson",
    value: "42 %",
    previous: "38 %",
    reference: "≥ 52 %",
    trend: "up",
    sourceReference: "Observation/observation-synthetic-cardio-lvef",
  },
  {
    label: "VTD VG indexé",
    value: "78 mL/m²",
    previous: "84 mL/m²",
    reference: "35–75 mL/m²",
    trend: "down",
    sourceReference: "Observation/observation-synthetic-cardio-lvedv",
  },
  {
    label: "TAPSE",
    value: "19 mm",
    previous: "18 mm",
    reference: "> 17 mm",
    trend: "stable",
    sourceReference: "Observation/observation-synthetic-cardio-tapse",
  },
  {
    label: "Vmax IT",
    value: "2,7 m/s",
    previous: "2,6 m/s",
    reference: "≤ 2,8 m/s",
    trend: "stable",
    sourceReference: "Observation/observation-synthetic-cardio-trv",
  },
];

export const syntheticBloodPressureReadings: BloodPressureReading[] = [
  {
    at: "2026-08-10T06:00:00Z",
    period: "day",
    systolic: 128,
    diastolic: 82,
    pulse: 67,
    valid: true,
  },
  {
    at: "2026-08-10T08:00:00Z",
    period: "day",
    systolic: 136,
    diastolic: 86,
    pulse: 72,
    valid: true,
  },
  {
    at: "2026-08-10T10:00:00Z",
    period: "day",
    systolic: 130,
    diastolic: 79,
    pulse: 69,
    valid: true,
  },
  {
    at: "2026-08-10T12:00:00Z",
    period: "day",
    systolic: 144,
    diastolic: 90,
    pulse: 74,
    valid: true,
  },
  {
    at: "2026-08-10T14:00:00Z",
    period: "day",
    systolic: 126,
    diastolic: 78,
    pulse: 66,
    valid: true,
  },
  {
    at: "2026-08-10T16:00:00Z",
    period: "day",
    systolic: 134,
    diastolic: 84,
    pulse: 70,
    valid: true,
  },
  {
    at: "2026-08-10T18:00:00Z",
    period: "day",
    systolic: 122,
    diastolic: 76,
    pulse: 64,
    valid: true,
  },
  {
    at: "2026-08-10T20:00:00Z",
    period: "day",
    systolic: 119,
    diastolic: 73,
    pulse: 62,
    valid: true,
  },
  {
    at: "2026-08-10T22:00:00Z",
    period: "night",
    systolic: 110,
    diastolic: 66,
    pulse: 58,
    valid: true,
  },
  {
    at: "2026-08-11T00:00:00Z",
    period: "night",
    systolic: 106,
    diastolic: 62,
    pulse: 55,
    valid: true,
  },
  {
    at: "2026-08-11T02:00:00Z",
    period: "night",
    systolic: 102,
    diastolic: 60,
    pulse: 53,
    valid: false,
  },
  {
    at: "2026-08-11T04:00:00Z",
    period: "night",
    systolic: 108,
    diastolic: 64,
    pulse: 56,
    valid: true,
  },
];

export const syntheticHolterEvents: HolterEvent[] = [
  { at: "2026-08-10T08:12:00Z", kind: "pvc", label: "ESV isolée", severity: "unknown" },
  { at: "2026-08-10T11:07:00Z", kind: "couplet", label: "Couplet ESV", severity: "warning" },
  {
    at: "2026-08-10T15:22:00Z",
    kind: "run",
    label: "Salve de 4 ESV",
    severity: "warning",
    duration: "1,8 s",
  },
  {
    at: "2026-08-10T19:07:00Z",
    kind: "run",
    label: "TV non soutenue",
    severity: "critical",
    duration: "2,4 s",
  },
  {
    at: "2026-08-10T22:14:00Z",
    kind: "pause",
    label: "Pause",
    severity: "warning",
    duration: "2,8 s",
  },
];

export const syntheticTrajectoryEvents: TrajectoryEvent[] = [
  {
    id: "symptom",
    at: "2026-02-14",
    lane: "symptom",
    title: "Dyspnée NYHA II",
    detail: "Rapportée en consultation",
    origin: "observed",
    status: "validated",
    sourceReference: "Condition/condition-synthetic-cardio-dyspnea",
  },
  {
    id: "echo",
    at: "2026-03-05",
    lane: "imaging",
    title: "FEVG 38 %",
    detail: "Échocardiographie importée",
    origin: "imported",
    status: "validated",
    sourceReference: "DiagnosticReport/diagnosticreport-synthetic-cardio-echo-old",
  },
  {
    id: "treatment",
    at: "2026-04-02",
    lane: "treatment",
    title: "Bisoprolol 5 mg",
    detail: "Prescription confirmée",
    origin: "observed",
    status: "validated",
    sourceReference: "MedicationRequest/medicationrequest-synthetic-cardio-bisoprolol",
  },
  {
    id: "device",
    at: "2026-05-20",
    lane: "device",
    title: "Contrôle DAI",
    detail: "Fonctionnement attendu",
    origin: "imported",
    status: "validated",
    sourceReference: "Device/device-synthetic-cardio-implant",
  },
  {
    id: "current-echo",
    at: "2026-08-11",
    lane: "imaging",
    title: "FEVG 42 %",
    detail: "Compte rendu amendé",
    origin: "observed",
    status: "amended",
    sourceReference: "DiagnosticReport/diagnosticreport-synthetic-cardio-echo-amended",
  },
  {
    id: "followup",
    at: "2026-11-12",
    lane: "report",
    title: "Réévaluation",
    detail: "Projection indicative, à planifier",
    origin: "projected",
    status: "unknown",
    sourceReference: "ServiceRequest/servicerequest-synthetic-cardio-followup",
  },
];

export const syntheticPrescriptionItems: PrescriptionSafetyItem[] = [
  {
    id: "bisoprolol",
    medication: "Bisoprolol",
    dosage: "5 mg · 1 fois/j",
    status: "confirmed",
    sourceReference: "MedicationRequest/medicationrequest-synthetic-cardio-bisoprolol",
  },
  {
    id: "apixaban",
    medication: "Apixaban",
    dosage: "5 mg · 2 fois/j",
    status: "to-confirm",
    interaction: "Interaction potentielle avec amiodarone",
    renalNote: "DFG à recontrôler avant confirmation",
    sourceReference: "MedicationRequest/medicationrequest-synthetic-cardio-apixaban",
  },
  {
    id: "dapagliflozin",
    medication: "Dapagliflozine",
    dosage: "10 mg · 1 fois/j",
    status: "on-hold",
    renalNote: "Suspendu jusqu'au bilan biologique",
    sourceReference: "MedicationRequest/medicationrequest-synthetic-cardio-dapagliflozin",
  },
];

export const syntheticDeviceTimeline: DeviceTimelineEvent[] = [
  {
    id: "implant",
    at: "2025-12-01",
    title: "Implantation DAI bicaméral",
    detail: "Compte rendu opératoire signé",
    origin: "observed",
    status: "validated",
    sourceReference: "Procedure/procedure-synthetic-cardio-implant",
  },
  {
    id: "remote",
    at: "2026-01-15",
    title: "Contrôle à distance",
    detail: "Batterie 92 % · aucune thérapie",
    origin: "imported",
    status: "validated",
    sourceReference: "Observation/observation-synthetic-cardio-device-remote",
  },
  {
    id: "clinic",
    at: "2026-05-20",
    title: "Contrôle en cabinet",
    detail: "Seuils stables · test synthétique",
    origin: "observed",
    status: "validated",
    sourceReference: "Observation/observation-synthetic-cardio-device-clinic",
  },
  {
    id: "next",
    at: "2026-11-20",
    title: "Contrôle prévu",
    detail: "Projection de suivi",
    origin: "projected",
    status: "unknown",
    sourceReference: "ServiceRequest/servicerequest-synthetic-cardio-device-followup",
  },
];

export const syntheticReportLifecycle: ReportLifecycleItem[] = [
  {
    id: "preliminary",
    at: "2026-08-11T14:40:00Z",
    title: "Échocardiographie",
    status: "preliminary",
    author: "Dr Lecture",
    version: "1",
    sourceReference: "DiagnosticReport/diagnosticreport-synthetic-cardio-echo-preliminary",
  },
  {
    id: "amended",
    at: "2026-08-12T08:20:00Z",
    title: "Échocardiographie",
    status: "amended",
    author: "Dr Lecture",
    version: "2",
    changeSummary: "FEVG corrigée de 40 % à 42 % après relecture.",
    sourceReference: "DiagnosticReport/diagnosticreport-synthetic-cardio-echo-amended",
  },
  {
    id: "signed",
    at: "2026-08-12T09:10:00Z",
    title: "Échocardiographie",
    status: "signed",
    author: "Dr Synthèse",
    version: "3",
    sourceReference: "DiagnosticReport/diagnosticreport-synthetic-cardio-echo-signed",
  },
];

export const syntheticVigilanceItems: VigilanceItem[] = [
  {
    id: "interaction",
    at: "2026-08-12T10:05:00Z",
    title: "Interaction potentielle",
    detail: "Amiodarone / apixaban : risque hémorragique à évaluer.",
    severity: "critical",
    owner: "Dr Synthèse",
    dueAt: "2026-08-12T18:00:00Z",
    status: "open",
    sourceReference: "DetectedIssue/detectedissue-synthetic-cardio-interaction",
  },
  {
    id: "renal",
    at: "2026-08-12T08:30:00Z",
    title: "Fonction rénale à recontrôler",
    detail: "Dernière valeur importée antérieure à la prescription proposée.",
    severity: "warning",
    owner: "Équipe cardiologie",
    dueAt: "2026-08-13T12:00:00Z",
    status: "acknowledged",
    sourceReference: "Observation/observation-synthetic-cardio-egfr",
  },
];

export const syntheticCardiologyResources = [
  syntheticCardiologyPatient,
  ...syntheticCardiologyObservations,
  syntheticRiskAssessment,
  ...syntheticMedicationRequests,
  ...syntheticDetectedIssues,
  ...syntheticCardiologyDevices,
  ...syntheticCardiologyReports,
  syntheticCardiologyProvenance,
];

export function isSyntheticCardiologyResource(resource: { meta?: FhirMeta }) {
  return (
    resource.meta?.tag?.some(
      (coding) => coding.system === CARDIOLOGY_SYNTHETIC_TAG_SYSTEM && coding.code === "synthetic",
    ) ?? false
  );
}
