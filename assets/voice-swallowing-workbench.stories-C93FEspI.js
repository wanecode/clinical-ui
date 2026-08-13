import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{f as t,t as n}from"./fixtures-D5uNXNAw.js";import{a as r,i}from"./specialty-workbenches-BTw9B1zO.js";var a,o,s,c,l,u,d;function f(){return(f=e((()=>{n(),r(),{expect:a,userEvent:o,within:s}=__STORYBOOK_MODULE_TEST__,c={title:`ORL/04 Voix et déglutition/VoiceSwallowingWorkbench`,component:i,tags:[`autodocs`,`test`],args:{findings:t}},l={play:async({canvasElement:e})=>{let t=s(e),n=t.getByRole(`button`,{name:`Déglutition`});await o.click(n),await a(n).toHaveAttribute(`aria-pressed`,`true`),await a(t.getByRole(`heading`,{name:`Mesures de déglutition`})).toBeVisible()}},u={args:{state:`empty`}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const swallowing = canvas.getByRole("button", {
      name: "Déglutition"
    });
    await userEvent.click(swallowing);
    await expect(swallowing).toHaveAttribute("aria-pressed", "true");
    await expect(canvas.getByRole("heading", {
      name: "Mesures de déglutition"
    })).toBeVisible();
  }
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    state: "empty"
  }
}`,...u.parameters?.docs?.source}}},d=[`VoicePreliminary`,`Empty`]})))()}f();export{u as Empty,l as VoicePreliminary,d as __namedExportsOrder,c as default};