import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{c as t,t as n}from"./fixtures-ZNOUvIHx.js";import{a as r,o as i}from"./care-UENto56y.js";var a,o,s,c,l,u,d,f,p,m;function h(){return(h=e((()=>{i(),n(),{expect:a,fn:o,userEvent:s,within:c}=__STORYBOOK_MODULE_TEST__,l={title:`Cardiology/PrescriptionSafetyBoard`,component:r,tags:[`autodocs`,`test`],args:{items:t,owner:`Dr Synthèse`,onConfirm:o()}},u={play:async({canvasElement:e,args:t})=>{let n=c(e);await s.click(n.getByRole(`button`,{name:`Confirmer après revue`})),await a(n.getByText(`Confirmation humaine enregistrée`)).toBeVisible(),await a(t.onConfirm).toHaveBeenCalledWith(`apixaban`)}},d={args:{items:t.filter(e=>e.status===`confirmed`)}},f={args:{state:`loading`}},p={args:{state:`forbidden`}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement,
    args
  }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", {
      name: "Confirmer après revue"
    }));
    await expect(canvas.getByText("Confirmation humaine enregistrée")).toBeVisible();
    await expect(args.onConfirm).toHaveBeenCalledWith("apixaban");
  }
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    items: syntheticPrescriptionItems.filter(item => item.status === "confirmed")
  }
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    state: "loading"
  }
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    state: "forbidden"
  }
}`,...p.parameters?.docs?.source}}},m=[`SafetyReview`,`ConfirmedNominal`,`Loading`,`Forbidden`]})))()}h();export{d as ConfirmedNominal,p as Forbidden,f as Loading,u as SafetyReview,m as __namedExportsOrder,l as default};