import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{s as t,t as n,u as r}from"./fixtures-ZNOUvIHx.js";import{n as i,r as a}from"./overview-rH38DwAs.js";var o,s,c,l,u,d,f;function p(){return(p=e((()=>{n(),a(),{expect:o,within:s}=__STORYBOOK_MODULE_TEST__,c={title:`Cardiology/RiskScoreWorkbench`,component:i,tags:[`autodocs`,`test`],args:{score:r}},l={play:async({canvasElement:e})=>{let t=s(e);await o(t.getByText(`SCORE2 · modèle 2026.2 · horizon 10 ans`)).toBeVisible(),await o(t.getByRole(`table`)).toBeVisible()}},u={args:{score:t}},d={args:{state:`forbidden`}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("SCORE2 · modèle 2026.2 · horizon 10 ans")).toBeVisible();
    await expect(canvas.getByRole("table")).toBeVisible();
  }
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    score: syntheticIncompleteRiskScore
  }
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    state: "forbidden"
  }
}`,...d.parameters?.docs?.source}}},f=[`Calculated`,`IncompleteNotCalculated`,`Forbidden`]})))()}p();export{l as Calculated,d as Forbidden,u as IncompleteNotCalculated,f as __namedExportsOrder,c as default};