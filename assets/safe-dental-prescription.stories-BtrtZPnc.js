import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{b as n,h as r,m as i,p as a,r as o,t as s,v as c}from"./fixtures-BmZn2avs.js";function l({prescription:e,state:t,stateMessage:n}){let o=e.pediatric&&e.patientWeightKg===void 0,s=[{id:`allergies`,label:`Allergies vérifiées`,passed:e.allergiesChecked},{id:`interactions`,label:`Interactions vérifiées`,passed:e.interactionsChecked},{id:`weight`,label:e.pediatric?`Poids pédiatrique documenté`:`Poids non requis pour ce schéma`,passed:!o},{id:`maximum`,label:`Dose maximale explicite`,passed:!!e.maximumDailyDose}],l=e.status===`blocked`||s.some(e=>!e.passed);return(0,u.jsx)(a,{eyebrow:`Prescription sûre`,title:e.medication,description:e.indication,actions:(0,u.jsx)(c,{}),className:`od-panel--prescription`,children:(0,u.jsxs)(i,{state:t,stateMessage:n,children:[(0,u.jsxs)(`div`,{className:`od-prescription`,children:[(0,u.jsxs)(`div`,{className:`od-prescription__order`,children:[(0,u.jsxs)(`div`,{className:`od-prescription__status`,"data-blocked":l||void 0,role:`status`,children:[(0,u.jsx)(`span`,{"aria-hidden":`true`,children:l?`!`:`✓`}),(0,u.jsx)(`strong`,{children:l?`Prescription bloquée`:`Contrôles de sécurité satisfaits`})]}),(0,u.jsxs)(`dl`,{children:[(0,u.jsxs)(`div`,{children:[(0,u.jsx)(`dt`,{children:`Dose`}),(0,u.jsx)(`dd`,{children:e.dose})]}),(0,u.jsxs)(`div`,{children:[(0,u.jsx)(`dt`,{children:`Voie`}),(0,u.jsx)(`dd`,{children:e.route})]}),(0,u.jsxs)(`div`,{children:[(0,u.jsx)(`dt`,{children:`Fréquence`}),(0,u.jsx)(`dd`,{children:e.frequency})]}),(0,u.jsxs)(`div`,{children:[(0,u.jsx)(`dt`,{children:`Durée`}),(0,u.jsx)(`dd`,{children:e.duration})]}),(0,u.jsxs)(`div`,{children:[(0,u.jsx)(`dt`,{children:`Maximum`}),(0,u.jsx)(`dd`,{children:e.maximumDailyDose})]}),(0,u.jsxs)(`div`,{children:[(0,u.jsx)(`dt`,{children:`Population`}),(0,u.jsx)(`dd`,{children:e.pediatric?`Pédiatrique · ${e.patientWeightKg??`poids absent`}`:`Adulte`})]})]}),(0,u.jsxs)(`p`,{children:[(0,u.jsx)(`strong`,{children:e.author}),` ·`,` `,(0,u.jsx)(`time`,{dateTime:e.authoredOn,children:e.authoredOn})]}),(0,u.jsx)(`code`,{children:e.resourceRef})]}),(0,u.jsx)(`ul`,{className:`od-prescription__checks`,"aria-label":`Contrôles de prescription`,children:s.map(e=>(0,u.jsxs)(`li`,{"data-passed":e.passed||void 0,children:[(0,u.jsx)(`span`,{"aria-hidden":`true`,children:e.passed?`✓`:`×`}),(0,u.jsx)(`strong`,{children:e.label}),(0,u.jsx)(`span`,{children:e.passed?`Documenté`:`Action requise`})]},e.id))})]}),(0,u.jsxs)(`div`,{className:`od-prescription__provenance`,children:[(0,u.jsx)(r,{kind:`preliminary`}),(0,u.jsx)(`span`,{children:`MedicationRequest FHIR R5 · aucune ordonnance réelle`})]})]})})}var u;function d(){return(d=e((()=>{n(),u=t(),l.__docgenInfo={description:``,methods:[],displayName:`SafeDentalPrescription`,props:{state:{required:!1,tsType:{name:`union`,raw:`DentalUiState | undefined`,elements:[{name:`union`,raw:`"ready" | "loading" | "empty" | "error" | "forbidden"`,elements:[{name:`literal`,value:`"ready"`},{name:`literal`,value:`"loading"`},{name:`literal`,value:`"empty"`},{name:`literal`,value:`"error"`},{name:`literal`,value:`"forbidden"`}]},{name:`undefined`}]},description:``},stateMessage:{required:!1,tsType:{name:`union`,raw:`string | undefined`,elements:[{name:`string`},{name:`undefined`}]},description:``},prescription:{required:!0,tsType:{name:`DentalPrescription`},description:``}}}})))()}var f,p,m,h,g,_,v;function y(){return(y=e((()=>{s(),d(),{expect:f,within:p}=__STORYBOOK_MODULE_TEST__,m={title:`Odontology/SafeDentalPrescription`,component:l,tags:[`autodocs`,`test`],args:{prescription:o},parameters:{docs:{description:{component:`Lecture sûre d'une MedicationRequest R5 synthétique : dose maximale, allergies, interactions et garde pédiatrique restent visibles.`}}}},h={play:async({canvasElement:e})=>{let t=p(e);await f(t.getByText(`Contrôles de sécurité satisfaits`)).toBeVisible(),await f(t.getByText(`1 500 mg / jour`)).toBeVisible()}},g={args:{prescription:{...o,id:`prescription-synthetic-pediatric-001`,medication:`Amoxicilline · dose pondérale`,dose:`À calculer`,maximumDailyDose:`À confirmer`,pediatric:!0,status:`blocked`,resourceRef:`MedicationRequest/medicationrequest-synthetic-pediatric-001`}},play:async({canvasElement:e})=>{let t=p(e);await f(t.getByText(`Prescription bloquée`)).toBeVisible(),await f(t.getByText(`Poids pédiatrique documenté`)).toBeVisible(),await f(t.getByText(`Action requise`)).toBeVisible()}},_={args:{state:`forbidden`}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Contrôles de sécurité satisfaits")).toBeVisible();
    await expect(canvas.getByText("1 500 mg / jour")).toBeVisible();
  }
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    prescription: {
      ...syntheticDentalPrescription,
      id: "prescription-synthetic-pediatric-001",
      medication: "Amoxicilline · dose pondérale",
      dose: "À calculer",
      maximumDailyDose: "À confirmer",
      pediatric: true,
      status: "blocked",
      resourceRef: "MedicationRequest/medicationrequest-synthetic-pediatric-001"
    }
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Prescription bloquée")).toBeVisible();
    await expect(canvas.getByText("Poids pédiatrique documenté")).toBeVisible();
    await expect(canvas.getByText("Action requise")).toBeVisible();
  }
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    state: "forbidden"
  }
}`,..._.parameters?.docs?.source}}},v=[`AdultDraft`,`PediatricWeightMissing`,`Forbidden`]})))()}y();export{h as AdultDraft,_ as Forbidden,g as PediatricWeightMissing,v as __namedExportsOrder,m as default};