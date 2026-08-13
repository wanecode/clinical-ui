import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{f as t,t as n}from"./fixtures-ZNOUvIHx.js";import{o as r,t as i}from"./care-UENto56y.js";var a,o,s,c,l,u,d,f;function p(){return(p=e((()=>{r(),n(),{expect:a,userEvent:o,within:s}=__STORYBOOK_MODULE_TEST__,c={title:`Cardiology/CardiacTrajectory`,component:i,tags:[`autodocs`,`test`],args:{events:t}},l={play:async({canvasElement:e})=>{let t=s(e);await a(t.getByRole(`img`,{name:/Trajectoire cardiologique multiligne/})).toBeVisible(),await o.click(t.getByRole(`button`,{name:`Tableau`})),await a(t.getByRole(`table`,{name:`Chronologie cardiologique synthétique`})).toBeVisible()}},u={args:{state:`empty`}},d={args:{state:`forbidden`}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("img", {
      name: /Trajectoire cardiologique multiligne/
    })).toBeVisible();
    await userEvent.click(canvas.getByRole("button", {
      name: "Tableau"
    }));
    await expect(canvas.getByRole("table", {
      name: "Chronologie cardiologique synthétique"
    })).toBeVisible();
  }
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    state: "empty"
  }
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    state: "forbidden"
  }
}`,...d.parameters?.docs?.source}}},f=[`Longitudinal`,`Empty`,`Forbidden`]})))()}p();export{u as Empty,d as Forbidden,l as Longitudinal,f as __namedExportsOrder,c as default};