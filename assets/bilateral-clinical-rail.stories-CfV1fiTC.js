import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t,t as n}from"./bilateral-clinical-rail-BfHu6F87.js";import{i as r,r as i,t as a}from"./fixtures-BtNEQcAc.js";var o,s,c,l,u,d,f,p,m,h;function g(){return(g=e((()=>{t(),a(),{expect:o,within:s}=__STORYBOOK_MODULE_TEST__,c={title:`Ophthalmology/BilateralClinicalRail`,component:n,tags:[`autodocs`,`test`],args:{right:r.OD,left:r.OG,alerts:i},parameters:{docs:{description:{component:`Rail de latéralité explicite : OD, OG et synthèse binoculaire sans dépendre de la couleur.`}}}},l={play:async({canvasElement:e})=>{let t=s(e);await o(t.getByRole(`region`,{name:`Œil droit`})).toBeVisible(),await o(t.getByRole(`complementary`,{name:`Synthèse binoculaire`})).toHaveTextContent(`Comparaison active`)}},u={args:{left:void 0,alerts:[]}},d={args:{alerts:[{id:`iop`,severity:`critical`,label:`Asymétrie pressionnelle`,detail:`Écart OD/OG de 9 mmHg confirmé deux fois.`}],right:{...r.OD,iop:24,status:`critical`}}},f={args:{right:{...r.OD,source:`Observation/import-tonometer-a`,sourceContext:`Import DICOM SR · 2026-08-12 · dispositif A`},left:{...r.OG,source:`Observation/manual-entry-b`,sourceContext:`Saisie manuelle · 2026-08-11 · auteur B`,status:`preliminary`}}},p={args:{compact:!0},parameters:{viewport:{defaultViewport:`mobile1`}}},m={args:{state:`partial`,left:void 0}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("region", {
      name: "Œil droit"
    })).toBeVisible();
    await expect(canvas.getByRole("complementary", {
      name: "Synthèse binoculaire"
    })).toHaveTextContent("Comparaison active");
  }
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    left: undefined,
    alerts: []
  }
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    alerts: [{
      id: "iop",
      severity: "critical",
      label: "Asymétrie pressionnelle",
      detail: "Écart OD/OG de 9 mmHg confirmé deux fois."
    }],
    right: {
      ...syntheticBilateralEyes.OD,
      iop: 24,
      status: "critical"
    }
  }
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    right: {
      ...syntheticBilateralEyes.OD,
      source: "Observation/import-tonometer-a",
      sourceContext: "Import DICOM SR · 2026-08-12 · dispositif A"
    },
    left: {
      ...syntheticBilateralEyes.OG,
      source: "Observation/manual-entry-b",
      sourceContext: "Saisie manuelle · 2026-08-11 · auteur B",
      status: "preliminary"
    }
  }
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    compact: true
  },
  parameters: {
    viewport: {
      defaultViewport: "mobile1"
    }
  }
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    state: "partial",
    left: undefined
  }
}`,...m.parameters?.docs?.source}}},h=[`Nominal`,`Monoculaire`,`Asymetrie`,`DonneesDiscordantes`,`CompactMobile`,`Partiel`]})))()}g();export{d as Asymetrie,p as CompactMobile,f as DonneesDiscordantes,u as Monoculaire,l as Nominal,m as Partiel,h as __namedExportsOrder,c as default};