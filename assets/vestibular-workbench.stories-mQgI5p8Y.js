import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{d as t,t as n}from"./fixtures-D5uNXNAw.js";import{a as r,r as i}from"./specialty-workbenches-BTw9B1zO.js";var a,o,s,c,l,u,d;function f(){return(f=e((()=>{n(),r(),{expect:a,userEvent:o,within:s}=__STORYBOOK_MODULE_TEST__,c={title:`ORL/03 Équilibre/VestibularWorkbench`,component:i,tags:[`autodocs`,`test`],args:{findings:t}},l={play:async({canvasElement:e})=>{let t=s(e),n=t.getByRole(`button`,{name:/VNG/});await o.click(n),await a(n).toHaveAttribute(`aria-current`,`true`),await a(t.getByText(`Compte rendu externe disponible`)).toBeVisible()}},u={args:{state:`loading`}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    const vng = canvas.getByRole("button", {
      name: /VNG/
    });
    await userEvent.click(vng);
    await expect(vng).toHaveAttribute("aria-current", "true");
    await expect(canvas.getByText("Compte rendu externe disponible")).toBeVisible();
  }
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    state: "loading"
  }
}`,...u.parameters?.docs?.source}}},d=[`ObservedAndImported`,`Loading`]})))()}f();export{u as Loading,l as ObservedAndImported,d as __namedExportsOrder,c as default};