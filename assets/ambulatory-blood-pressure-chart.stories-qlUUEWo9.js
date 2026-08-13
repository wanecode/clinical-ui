import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t,t as n}from"./fixtures-ZNOUvIHx.js";import{a as r,t as i}from"./diagnostics-Dt7gQq2O.js";var a,o,s,c,l,u,d,f;function p(){return(p=e((()=>{r(),n(),{expect:a,userEvent:o,within:s}=__STORYBOOK_MODULE_TEST__,c={title:`Cardiology/AmbulatoryBloodPressureChart`,component:i,tags:[`autodocs`,`test`],args:{readings:t,origin:`imported`}},l={play:async({canvasElement:e})=>{let t=s(e);await a(t.getByRole(`img`,{name:/Pressions ambulatoires/})).toBeVisible(),await o.click(t.getByRole(`button`,{name:`Tableau`})),await a(t.getByRole(`table`,{name:`Mesures de pression ambulatoire`})).toBeVisible()}},u={args:{deviceAvailable:!1}},d={args:{readings:[]}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("img", {
      name: /Pressions ambulatoires/
    })).toBeVisible();
    await userEvent.click(canvas.getByRole("button", {
      name: "Tableau"
    }));
    await expect(canvas.getByRole("table", {
      name: "Mesures de pression ambulatoire"
    })).toBeVisible();
  }
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    deviceAvailable: false
  }
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    readings: []
  }
}`,...d.parameters?.docs?.source}}},f=[`ImportedNominal`,`DeviceUnavailable`,`SignalAbsent`]})))()}p();export{u as DeviceUnavailable,l as ImportedNominal,d as SignalAbsent,f as __namedExportsOrder,c as default};