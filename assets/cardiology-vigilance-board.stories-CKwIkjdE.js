import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{p as t,t as n}from"./fixtures-ZNOUvIHx.js";import{o as r,r as i}from"./care-UENto56y.js";var a,o,s,c,l,u,d,f,p,m;function h(){return(h=e((()=>{r(),n(),{expect:a,fn:o,userEvent:s,within:c}=__STORYBOOK_MODULE_TEST__,l={title:`Cardiology/CardiologyVigilanceBoard`,component:i,tags:[`autodocs`,`test`],args:{items:t,onAcknowledge:o()}},u={play:async({canvasElement:e,args:t})=>{let n=c(e),r=n.getByRole(`button`,{name:`Prendre en compte`});await s.click(r),await a(n.getAllByText(`Décision tracée`)).toHaveLength(2),await a(t.onAcknowledge).toHaveBeenCalledWith(`interaction`)}},d={args:{items:t.map(e=>({...e,status:`resolved`}))}},f={args:{state:`empty`}},p={args:{state:`forbidden`}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement,
    args
  }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", {
      name: "Prendre en compte"
    });
    await userEvent.click(button);
    await expect(canvas.getAllByText("Décision tracée")).toHaveLength(2);
    await expect(args.onAcknowledge).toHaveBeenCalledWith("interaction");
  }
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    items: syntheticVigilanceItems.map(item => ({
      ...item,
      status: "resolved" as const
    }))
  }
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    state: "empty"
  }
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    state: "forbidden"
  }
}`,...p.parameters?.docs?.source}}},m=[`CriticalWithOwner`,`ResolvedNominal`,`Empty`,`Forbidden`]})))()}h();export{u as CriticalWithOwner,f as Empty,p as Forbidden,d as ResolvedNominal,m as __namedExportsOrder,l as default};