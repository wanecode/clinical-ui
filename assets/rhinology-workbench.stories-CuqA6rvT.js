import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{s as t,t as n}from"./fixtures-D5uNXNAw.js";import{a as r,t as i}from"./specialty-workbenches-BTw9B1zO.js";var a,o,s,c,l,u,d;function f(){return(f=e((()=>{n(),r(),{expect:a,userEvent:o,within:s}=__STORYBOOK_MODULE_TEST__,c={title:`ORL/05 Rhinologie/RhinologyWorkbench`,component:i,tags:[`autodocs`,`test`],args:{data:t}},l={play:async({canvasElement:e})=>{let t=s(e),n=t.getByRole(`button`,{name:`Acquitter la lecture`});await o.click(n),await a(t.getByText(`Vigilance acquittée`)).toBeVisible(),await a(t.getByRole(`button`,{name:`Annuler l’acquittement`})).toHaveAttribute(`aria-pressed`,`true`)}},u={args:{state:`error`}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const acknowledge = canvas.getByRole("button", {
      name: "Acquitter la lecture"
    });
    await userEvent.click(acknowledge);
    await expect(canvas.getByText("Vigilance acquittée")).toBeVisible();
    await expect(canvas.getByRole("button", {
      name: "Annuler l’acquittement"
    })).toHaveAttribute("aria-pressed", "true");
  }
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    state: "error"
  }
}`,...u.parameters?.docs?.source}}},d=[`RedFlagReview`,`ErrorState`]})))()}f();export{u as ErrorState,l as RedFlagReview,d as __namedExportsOrder,c as default};