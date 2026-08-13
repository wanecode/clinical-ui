import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{i as t,t as n}from"./fixtures-ZNOUvIHx.js";import{a as r,n as i}from"./diagnostics-Dt7gQq2O.js";var a,o,s,c,l,u,d,f,p,m,h;function g(){return(g=e((()=>{r(),n(),{expect:a,fn:o,userEvent:s,within:c}=__STORYBOOK_MODULE_TEST__,l={title:`Cardiology/EcgWorkbench`,component:i,tags:[`autodocs`,`test`],args:{study:t,onValidate:o()}},u={play:async({canvasElement:e,args:t})=>{let n=c(e);await a(n.getByRole(`img`,{name:/Tracé ECG synthétique/})).toBeVisible(),await s.click(n.getByRole(`button`,{name:`Tableau`})),await a(n.getByRole(`table`,{name:`Échantillons du signal ECG synthétique`})).toBeVisible(),await s.click(n.getByRole(`button`,{name:`Valider humainement`})),await a(t.onValidate).toHaveBeenCalledOnce()}},d={args:{study:{...t,origin:`observed`,reportStatus:`validated`}}},f={args:{availability:`signal-absent`}},p={args:{availability:`device-unavailable`}},m={args:{state:`error`}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement,
    args
  }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("img", {
      name: /Tracé ECG synthétique/
    })).toBeVisible();
    await userEvent.click(canvas.getByRole("button", {
      name: "Tableau"
    }));
    await expect(canvas.getByRole("table", {
      name: "Échantillons du signal ECG synthétique"
    })).toBeVisible();
    await userEvent.click(canvas.getByRole("button", {
      name: "Valider humainement"
    }));
    await expect(args.onValidate).toHaveBeenCalledOnce();
  }
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    study: {
      ...syntheticEcgStudy,
      origin: "observed",
      reportStatus: "validated"
    }
  }
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    availability: "signal-absent"
  }
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    availability: "device-unavailable"
  }
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    state: "error"
  }
}`,...m.parameters?.docs?.source}}},h=[`ImportedPreliminary`,`ValidatedNominal`,`SignalAbsent`,`DeviceUnavailable`,`FailureState`]})))()}g();export{p as DeviceUnavailable,m as FailureState,u as ImportedPreliminary,f as SignalAbsent,d as ValidatedNominal,h as __namedExportsOrder,l as default};