import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{r as t,t as n}from"./fixtures-ZNOUvIHx.js";import{i as r,o as i}from"./care-UENto56y.js";var a,o,s,c,l,u,d;function f(){return(f=e((()=>{i(),n(),{expect:a,within:o}=__STORYBOOK_MODULE_TEST__,s={title:`Cardiology/ImplantedDeviceTimeline`,component:r,tags:[`autodocs`,`test`],args:{events:t}},c={play:async({canvasElement:e})=>{let t=o(e);await a(t.getByText(`Implantation DAI bicaméral`)).toBeVisible(),await a(t.getByText(`Projeté`)).toBeVisible()}},l={args:{deviceAvailable:!1}},u={args:{state:`error`}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Implantation DAI bicaméral")).toBeVisible();
    await expect(canvas.getByText("Projeté")).toBeVisible();
  }
}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    deviceAvailable: false
  }
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    state: "error"
  }
}`,...u.parameters?.docs?.source}}},d=[`FollowUp`,`DeviceUnavailable`,`FailureState`]})))()}f();export{l as DeviceUnavailable,u as FailureState,c as FollowUp,d as __namedExportsOrder,s as default};