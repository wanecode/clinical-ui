import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{s as t,t as n}from"./fixtures-BtNEQcAc.js";import{n as r,t as i}from"./ocular-emergency-summary-BHWL-9Nx.js";var a,o,s,c,l,u,d,f,p,m;function h(){return(h=e((()=>{n(),r(),{expect:a,fn:o,userEvent:s,within:c}=__STORYBOOK_MODULE_TEST__,l={title:`Ophthalmology/OcularEmergencySummary`,component:i,tags:[`autodocs`,`test`],args:{data:t,onDisposition:o()},parameters:{docs:{description:{component:`Résumé critique pour baisse brutale, douleur, trauma, orientation et filet de sécurité.`}}}},u={play:async({args:e,canvasElement:n})=>{let r=c(n);await a(r.getByText(/signes critiques/)).toBeVisible(),await s.click(r.getByRole(`button`,{name:`Confirmer l’orientation`})),await a(e.onDisposition).toHaveBeenCalledWith(t.disposition)}},d={play:async({canvasElement:e})=>{let t=c(e);await s.click(t.getByRole(`checkbox`,{name:/Plaie transfixiante/})),await a(t.getByText(`1 signe critique`)).toBeVisible()}},f={args:{data:{...t,painScore:2,findings:t.findings.map(e=>({...e,present:!1})),disposition:`Consultation programmée après réévaluation`}}},p={parameters:{viewport:{defaultViewport:`mobile1`}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  play: async ({
    args,
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText(/signes critiques/)).toBeVisible();
    await userEvent.click(canvas.getByRole("button", {
      name: "Confirmer l’orientation"
    }));
    await expect(args.onDisposition).toHaveBeenCalledWith(syntheticEmergencyData.disposition);
  }
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  play: async ({
    canvasElement
  }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("checkbox", {
      name: /Plaie transfixiante/
    }));
    await expect(canvas.getByText("1 signe critique")).toBeVisible();
  }
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    data: {
      ...syntheticEmergencyData,
      painScore: 2,
      findings: syntheticEmergencyData.findings.map(finding => ({
        ...finding,
        present: false
      })),
      disposition: "Consultation programmée après réévaluation"
    }
  }
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  parameters: {
    viewport: {
      defaultViewport: "mobile1"
    }
  }
}`,...p.parameters?.docs?.source}}},m=[`Critique`,`TriageInteractif`,`SansDrapeauRouge`,`CompactMobile`]})))()}h();export{p as CompactMobile,u as Critique,f as SansDrapeauRouge,d as TriageInteractif,m as __namedExportsOrder,l as default};