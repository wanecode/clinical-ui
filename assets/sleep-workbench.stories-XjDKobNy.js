import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{l as t,t as n}from"./fixtures-D5uNXNAw.js";import{a as r,n as i}from"./specialty-workbenches-BTw9B1zO.js";var a,o,s,c,l,u,d;function f(){return(f=e((()=>{n(),r(),{expect:a,userEvent:o,within:s}=__STORYBOOK_MODULE_TEST__,c={title:`ORL/06 Sommeil/SleepWorkbench`,component:i,tags:[`autodocs`,`test`],args:{data:t}},l={play:async({canvasElement:e})=>{let t=s(e),n=t.getByRole(`button`,{name:`Voir les signaux`});await o.click(n),await a(t.getByRole(`heading`,{name:`Complétude des signaux`})).toBeVisible(),await a(t.getByText(`Position corporelle`)).toBeVisible()}},u={args:{state:`partial`}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const details = canvas.getByRole("button", {
      name: "Voir les signaux"
    });
    await userEvent.click(details);
    await expect(canvas.getByRole("heading", {
      name: "Complétude des signaux"
    })).toBeVisible();
    await expect(canvas.getByText("Position corporelle")).toBeVisible();
  }
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    state: "partial"
  }
}`,...u.parameters?.docs?.source}}},d=[`ImportedPartialStudy`,`Partial`]})))()}f();export{l as ImportedPartialStudy,u as Partial,d as __namedExportsOrder,c as default};