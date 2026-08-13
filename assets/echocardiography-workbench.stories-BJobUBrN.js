import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{a as t,t as n}from"./fixtures-ZNOUvIHx.js";import{a as r,r as i}from"./diagnostics-Dt7gQq2O.js";var a,o,s,c,l,u,d,f;function p(){return(p=e((()=>{r(),n(),{expect:a,within:o}=__STORYBOOK_MODULE_TEST__,s={title:`Cardiology/EchocardiographyWorkbench`,component:i,tags:[`autodocs`,`test`],args:{measures:t,reportStatus:`amended`}},c={play:async({canvasElement:e})=>{let t=o(e);await a(t.getAllByText(`Corrigé`)).toHaveLength(2),await a(t.getByRole(`table`)).toBeVisible()}},l={args:{reportStatus:`validated`,conclusion:`Mesures synthétiques relues et validées par le cardiologue lecteur.`}},u={args:{reportStatus:`preliminary`,conclusion:`Conclusion préliminaire synthétique, à confirmer.`}},d={args:{state:`empty`}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getAllByText("Corrigé")).toHaveLength(2);
    await expect(canvas.getByRole("table")).toBeVisible();
  }
}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    reportStatus: "validated",
    conclusion: "Mesures synthétiques relues et validées par le cardiologue lecteur."
  }
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    reportStatus: "preliminary",
    conclusion: "Conclusion préliminaire synthétique, à confirmer."
  }
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    state: "empty"
  }
}`,...d.parameters?.docs?.source}}},f=[`Amended`,`ValidatedNominal`,`Preliminary`,`Empty`]})))()}p();export{c as Amended,d as Empty,u as Preliminary,l as ValidatedNominal,f as __namedExportsOrder,s as default};