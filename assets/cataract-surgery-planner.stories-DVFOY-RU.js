import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{t}from"./jsx-runtime-DeHZSEgm.js";import{h as n}from"./iframe-CUdBhyno.js";import{n as r,t as i}from"./clinical-status-badge-B_H-0XQt.js";import{a,i as o,n as s,o as c,r as l,t as u}from"./primitives-BGZVpAdQ.js";import{a as d,t as f}from"./fixtures-BtNEQcAc.js";function p({plan:e,state:t=`ready`}){let[n,r]=(0,m.useState)(e.selectedIol),[c,d]=(0,m.useState)(e.plannedPower);return(0,h.jsx)(l,{state:t,label:`Planification de chirurgie de cataracte`,children:(0,h.jsxs)(`article`,{className:`oph-workbench oph-cataract`,children:[(0,h.jsxs)(`header`,{className:`oph-workbench-heading`,children:[(0,h.jsxs)(`div`,{children:[(0,h.jsx)(`p`,{className:`oph-kicker`,children:`Cataracte & chirurgie`}),(0,h.jsx)(`h2`,{children:`Planifier, opérer, auditer`}),(0,h.jsx)(`p`,{children:`Une continuité documentaire de la biométrie au résultat réfractif.`})]}),(0,h.jsxs)(`div`,{className:`oph-heading-actions`,children:[(0,h.jsx)(u,{eye:e.eye,long:!0}),(0,h.jsx)(a,{})]})]}),(0,h.jsx)(`nav`,{className:`oph-cataract__flow`,"aria-label":`Cycle chirurgical`,children:[`Biométrie`,`Choix implant`,`Validation`,`Procédure`,`Audit`].map((e,t)=>(0,h.jsxs)(`div`,{"data-current":t===1||void 0,children:[(0,h.jsx)(`span`,{children:t+1}),(0,h.jsx)(`strong`,{children:e})]},e))}),(0,h.jsxs)(`div`,{className:`oph-cataract__grid`,children:[(0,h.jsxs)(o,{title:`Biométrie`,eyebrow:`Mesures importées`,children:[(0,h.jsxs)(`dl`,{className:`oph-metric-grid`,children:[(0,h.jsx)(s,{label:`Longueur axiale`,value:e.axialLength.toFixed(2),unit:`mm`}),(0,h.jsx)(s,{label:`Profondeur chambre`,value:e.anteriorChamberDepth.toFixed(2),unit:`mm`}),(0,h.jsx)(s,{label:`K moyenne`,value:e.keratometry.toFixed(2),unit:`D`}),(0,h.jsx)(s,{label:`Cible`,value:e.targetRefraction.toFixed(2),unit:`D`})]}),(0,h.jsxs)(`p`,{className:`oph-source-line`,children:[(0,h.jsx)(`span`,{children:`Nature`}),(0,h.jsx)(`code`,{children:`Importé · biomètre synthétique`})]})]}),(0,h.jsxs)(o,{title:`Implant & puissance`,eyebrow:`Décision préliminaire`,action:(0,h.jsx)(i,{status:e.procedureStatus,compact:!0}),children:[(0,h.jsxs)(`fieldset`,{className:`oph-iol-options`,children:[(0,h.jsx)(`legend`,{children:`Type d’implant intraoculaire`}),g.map(t=>(0,h.jsxs)(`label`,{children:[(0,h.jsx)(`input`,{type:`radio`,name:`iol`,checked:n===t,onChange:()=>r(t)}),(0,h.jsxs)(`span`,{children:[(0,h.jsx)(`strong`,{children:t}),(0,h.jsx)(`small`,{children:t===e.selectedIol?`Proposition calculée`:`Alternative`})]})]},t))]}),(0,h.jsxs)(`label`,{className:`oph-power-control`,children:[(0,h.jsx)(`span`,{children:`Puissance planifiée`}),(0,h.jsx)(`input`,{type:`number`,step:`0.5`,value:c,onChange:e=>d(Number(e.target.value))}),(0,h.jsx)(`b`,{children:`D`})]})]}),(0,h.jsx)(o,{title:`Cycle documentaire`,eyebrow:`Complétude`,children:(0,h.jsx)(`ul`,{className:`oph-document-list`,children:e.documents.map(e=>(0,h.jsxs)(`li`,{"data-status":e.status,children:[(0,h.jsx)(`span`,{"aria-hidden":`true`,children:e.status===`signed`?`✓`:e.status===`complete`?`●`:`!`}),(0,h.jsx)(`strong`,{children:e.label}),(0,h.jsx)(`small`,{children:e.status===`signed`?`Signé`:e.status===`complete`?`Complet`:`Manquant`})]},e.label))})})]}),(0,h.jsx)(o,{title:`Audit réfractif`,eyebrow:`Cible versus résultat`,children:(0,h.jsx)(`div`,{className:`oph-table-wrap`,children:(0,h.jsxs)(`table`,{className:`oph-table`,children:[(0,h.jsx)(`caption`,{children:`Résultats postopératoires synthétiques`}),(0,h.jsx)(`thead`,{children:(0,h.jsxs)(`tr`,{children:[(0,h.jsx)(`th`,{children:`Indicateur`}),(0,h.jsx)(`th`,{children:`Cible`}),(0,h.jsx)(`th`,{children:`Observé`}),(0,h.jsx)(`th`,{children:`Écart`})]})}),(0,h.jsx)(`tbody`,{children:e.audit.map(e=>(0,h.jsxs)(`tr`,{children:[(0,h.jsx)(`th`,{scope:`row`,children:e.label}),(0,h.jsx)(`td`,{children:e.target}),(0,h.jsx)(`td`,{children:e.observed??`Non encore mesuré`}),(0,h.jsx)(`td`,{children:e.observed&&e.observed!==`En attente`?`À calculer`:`—`})]},e.label))})]})})})]})})}var m,h,g;function _(){return(_=e((()=>{r(),m=n(),c(),h=t(),g=[`Monofocale asphérique — modèle synthétique A`,`Monofocale torique — modèle synthétique B`,`Profondeur de champ — modèle synthétique C`],p.__docgenInfo={description:``,methods:[],displayName:`CataractSurgeryPlanner`,props:{plan:{required:!0,tsType:{name:`CataractPlan`},description:``},state:{required:!1,tsType:{name:`union`,raw:`"ready" | "loading" | "empty" | "error" | "forbidden" | "partial"`,elements:[{name:`literal`,value:`"ready"`},{name:`literal`,value:`"loading"`},{name:`literal`,value:`"empty"`},{name:`literal`,value:`"error"`},{name:`literal`,value:`"forbidden"`},{name:`literal`,value:`"partial"`}]},description:``,defaultValue:{value:`"ready"`,computed:!1}}}}})))()}var v,y,b,x,S,C,w,T,E;function D(){return(D=e((()=>{_(),f(),{expect:v,userEvent:y,within:b}=__STORYBOOK_MODULE_TEST__,x={title:`Ophthalmology/CataractSurgeryPlanner`,component:p,tags:[`autodocs`,`test`],args:{plan:d},parameters:{docs:{description:{component:`Biométrie, planification d’implant, procédure, cycle documentaire et audit réfractif.`}}}},S={},C={play:async({canvasElement:e})=>{let t=b(e);await y.click(t.getByRole(`radio`,{name:/Monofocale torique/})),await v(t.getByRole(`radio`,{name:/Monofocale torique/})).toBeChecked();let n=t.getByRole(`spinbutton`,{name:/Puissance planifiée/});await y.clear(n),await y.type(n,`22`),await v(n).toHaveValue(22),await y.click(t.getByRole(`radio`,{name:/Monofocale asphérique/})),await y.clear(n),await y.type(n,`21.5`)}},w={args:{plan:{...d,procedureStatus:`validated`,documents:d.documents.map(e=>({...e,status:e.label===`Consentement`?`signed`:`complete`})),audit:[{label:`Réfraction cible`,target:`−0,25 D`,observed:`−0,50 D`},{label:`AV sans correction`,target:`≥ 8/10`,observed:`9/10`}]}}},T={args:{state:`partial`}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{}`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("radio", {
      name: /Monofocale torique/
    }));
    await expect(canvas.getByRole("radio", {
      name: /Monofocale torique/
    })).toBeChecked();
    const power = canvas.getByRole("spinbutton", {
      name: /Puissance planifiée/
    });
    await userEvent.clear(power);
    await userEvent.type(power, "22");
    await expect(power).toHaveValue(22);
    await userEvent.click(canvas.getByRole("radio", {
      name: /Monofocale asphérique/
    }));
    await userEvent.clear(power);
    await userEvent.type(power, "21.5");
  }
}`,...C.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  args: {
    plan: {
      ...syntheticCataractPlan,
      procedureStatus: "validated",
      documents: syntheticCataractPlan.documents.map(document => ({
        ...document,
        status: document.label === "Consentement" ? "signed" as const : "complete" as const
      })),
      audit: [{
        label: "Réfraction cible",
        target: "−0,25 D",
        observed: "−0,50 D"
      }, {
        label: "AV sans correction",
        target: "≥ 8/10",
        observed: "9/10"
      }]
    }
  }
}`,...w.parameters?.docs?.source}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  args: {
    state: "partial"
  }
}`,...T.parameters?.docs?.source}}},E=[`Planification`,`InteractionPlanification`,`CycleFinal`,`DocumentManquant`]})))()}D();export{w as CycleFinal,T as DocumentManquant,C as InteractionPlanification,S as Planification,E as __namedExportsOrder,x as default};