import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{d as t,s as n,t as r,u as i}from"./fixtures-ZNOUvIHx.js";import{r as a,t as o}from"./overview-rH38DwAs.js";var s,c,l,u,d,f,p,m,h,g;function _(){return(_=e((()=>{r(),a(),{expect:s,fn:c,userEvent:l,within:u}=__STORYBOOK_MODULE_TEST__,d={title:`Cardiology/CardiovascularSummary`,component:o,tags:[`autodocs`,`test`],args:{data:t,riskScore:i,patientLabel:`Awa Ndiaye — synthétique`,decisionOwner:`Dr Synthèse`,onReviewDecision:c()}},f={play:async({canvasElement:e,args:t})=>{let n=u(e);await s(n.getByText(`6,3 % à 10 ans`)).toBeVisible(),await l.click(n.getByRole(`button`,{name:`Ouvrir la revue`})),await s(t.onReviewDecision).toHaveBeenCalledOnce()}},p={args:{riskScore:n}},m={args:{state:`loading`}},h={args:{state:`error`}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement,
    args
  }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("6,3 % à 10 ans")).toBeVisible();
    await userEvent.click(canvas.getByRole("button", {
      name: "Ouvrir la revue"
    }));
    await expect(args.onReviewDecision).toHaveBeenCalledOnce();
  }
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    riskScore: syntheticIncompleteRiskScore
  }
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    state: "loading"
  }
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    state: "error"
  }
}`,...h.parameters?.docs?.source}}},g=[`Nominal`,`DonneesManquantes`,`Loading`,`FailureState`]})))()}_();export{p as DonneesManquantes,h as FailureState,m as Loading,f as Nominal,g as __namedExportsOrder,d as default};