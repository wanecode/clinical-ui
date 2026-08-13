import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{o as t,t as n}from"./fixtures-ZNOUvIHx.js";import{a as r,i}from"./diagnostics-Dt7gQq2O.js";var a,o,s,c,l,u,d,f,p;function m(){return(m=e((()=>{r(),n(),{expect:a,userEvent:o,within:s}=__STORYBOOK_MODULE_TEST__,c={title:`Cardiology/HolterSummary`,component:i,tags:[`autodocs`,`test`],args:{events:t}},l={play:async({canvasElement:e})=>{let t=s(e);await a(t.getByText(`Critique`)).toBeVisible(),await o.click(t.getByRole(`button`,{name:`Tableau`})),await a(t.getByRole(`table`,{name:`Événements Holter détectés`})).toBeVisible()}},u={args:{events:t.filter(e=>e.severity!==`critical`)}},d={args:{signalAvailable:!1}},f={args:{state:`loading`}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Critique")).toBeVisible();
    await userEvent.click(canvas.getByRole("button", {
      name: "Tableau"
    }));
    await expect(canvas.getByRole("table", {
      name: "Événements Holter détectés"
    })).toBeVisible();
  }
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    events: syntheticHolterEvents.filter(event => event.severity !== "critical")
  }
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    signalAvailable: false
  }
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    state: "loading"
  }
}`,...f.parameters?.docs?.source}}},p=[`CriticalEvent`,`Nominal`,`SignalAbsent`,`Loading`]})))()}m();export{l as CriticalEvent,f as Loading,u as Nominal,d as SignalAbsent,p as __namedExportsOrder,c as default};