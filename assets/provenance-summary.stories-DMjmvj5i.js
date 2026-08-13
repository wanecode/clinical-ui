import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t,t as n}from"./provenance-summary-BqYYcjpC.js";var r,i,a,o,s;function c(){return(c=e((()=>{t(),r={title:`Core/ProvenanceSummary`,component:n,tags:[`autodocs`,`test`],args:{provenance:{resourceReference:`DiagnosticReport/report-synthetic-oph-001`,status:`validated`,recordedAt:`2026-08-12T10:19:42Z`,author:`Dr A. Fall`,method:`Validation médicale`,device:`OCT synthétique / SN-SYN-042`,source:`FHIR R5`,version:`7`,digest:`sha256:8ca12d…f04e`}},parameters:{docs:{description:{component:`Rend la provenance consultable sans exposer la structure brute de la ressource FHIR.`}}}},i={},a={args:{provenance:{resourceReference:`Observation/observation-synthetic-001`,status:`preliminary`,recordedAt:`2026-08-12T10:15:00Z`}}},o={args:{provenance:{resourceReference:`Observation/observation-synthetic-device-001`,status:`validated`,recordedAt:`2026-08-12T10:15:00Z`,device:`Tonomètre synthétique / SN-SYN-109`,source:`Import DICOM SR`,version:`2`}}},i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{}`,...i.parameters?.docs?.source}}},a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    provenance: {
      resourceReference: "Observation/observation-synthetic-001",
      status: "preliminary",
      recordedAt: "2026-08-12T10:15:00Z"
    }
  }
}`,...a.parameters?.docs?.source}}},o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    provenance: {
      resourceReference: "Observation/observation-synthetic-device-001",
      status: "validated",
      recordedAt: "2026-08-12T10:15:00Z",
      device: "Tonomètre synthétique / SN-SYN-109",
      source: "Import DICOM SR",
      version: "2"
    }
  }
}`,...o.parameters?.docs?.source}}},s=[`Complete`,`Incomplete`,`DeviceSourced`]})))()}c();export{i as Complete,o as DeviceSourced,a as Incomplete,s as __namedExportsOrder,r as default};