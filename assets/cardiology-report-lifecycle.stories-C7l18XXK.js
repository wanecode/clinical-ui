import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{l as t,t as n}from"./fixtures-ZNOUvIHx.js";import{n as r,o as i}from"./care-UENto56y.js";var a,o,s,c,l,u,d;function f(){return(f=e((()=>{i(),n(),{expect:a,within:o}=__STORYBOOK_MODULE_TEST__,s={title:`Cardiology/CardiologyReportLifecycle`,component:r,tags:[`autodocs`,`test`],args:{items:t}},c={play:async({canvasElement:e})=>{let t=o(e);await a(t.getByText(`Préliminaire`)).toBeVisible(),await a(t.getByText(`Amendé`)).toBeVisible(),await a(t.getByText(`Signé`)).toBeVisible()}},l={args:{items:t.slice(0,1)}},u={args:{state:`error`}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Préliminaire")).toBeVisible();
    await expect(canvas.getByText("Amendé")).toBeVisible();
    await expect(canvas.getByText("Signé")).toBeVisible();
  }
}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    items: syntheticReportLifecycle.slice(0, 1)
  }
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    state: "error"
  }
}`,...u.parameters?.docs?.source}}},d=[`PreliminaryAmendedSigned`,`PreliminaryOnly`,`FailureState`]})))()}f();export{u as FailureState,c as PreliminaryAmendedSigned,l as PreliminaryOnly,d as __namedExportsOrder,s as default};