import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t,t as n}from"./clinical-context-header-DfRDyOqw.js";var r,i,a,o,s,c,l,u,d,f;function p(){return(p=e((()=>{t(),{expect:r,userEvent:i,within:a}=__STORYBOOK_MODULE_TEST__,o={title:`Core/ClinicalContextHeader`,component:n,tags:[`autodocs`,`test`],args:{patient:{id:`patient-synthetic-001`,label:`Mariam Diop`,mrn:`SYN-2608-0042`,birthDate:`1984-02-17`,ageLabel:`42 ans`,sexLabel:`Femme`},encounter:{id:`encounter-synthetic-001`,effectiveAt:`12 août 2026 · 10:15`,service:`Consultation`,practitioner:`Dr A. Fall`},sourceLabel:`Données synthétiques`,status:`validated`},parameters:{docs:{description:{component:`Conserve l’identité, le statut et l’épisode de soins visibles au-dessus de tout module spécialisé.`}}}},s={},c={args:{status:`preliminary`},play:async({canvasElement:e})=>{let t=a(e).getByRole(`button`,{name:`Comprendre le statut clinique`});await i.hover(t),await r(await a(document.body).findByRole(`tooltip`)).toBeVisible()}},l={args:{status:`critical`}},u={args:{patient:{id:`patient-synthetic-long`,label:`Nom clinique synthétique volontairement très long pour vérifier la robustesse`,mrn:`SYN-LONG-000000000042`,birthDate:`1958-11-03`,ageLabel:`67 ans`,sexLabel:`Non renseigné`}}},d={parameters:{viewport:{defaultViewport:`mobile1`}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{}`,...s.parameters?.docs?.source}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    status: "preliminary"
  },
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", {
      name: "Comprendre le statut clinique"
    });
    await userEvent.hover(trigger);
    await expect(await within(document.body).findByRole("tooltip")).toBeVisible();
  }
}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    status: "critical"
  }
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    patient: {
      id: "patient-synthetic-long",
      label: "Nom clinique synthétique volontairement très long pour vérifier la robustesse",
      mrn: "SYN-LONG-000000000042",
      birthDate: "1958-11-03",
      ageLabel: "67 ans",
      sexLabel: "Non renseigné"
    }
  }
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  parameters: {
    viewport: {
      defaultViewport: "mobile1"
    }
  }
}`,...d.parameters?.docs?.source}}},f=[`Validated`,`Preliminary`,`Critical`,`LongIdentity`,`Constrained`]})))()}p();export{d as Constrained,l as Critical,u as LongIdentity,c as Preliminary,s as Validated,f as __namedExportsOrder,o as default};